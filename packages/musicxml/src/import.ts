import { XMLParser } from "fast-xml-parser";
import {
  createChordSymbolEvent,
  createDuration,
  createEmptyScore,
  createInstrument,
  createLyricEvent,
  createNoteEvent,
  createOperation,
  createPitch,
  createPlayer,
  createRestEvent,
  applyScoreOperation,
  type ChordQuality,
  type DurationName,
  type PitchStep,
  type Score
} from "@harmony/notation-engine";
import { asArray, childRecord, isRecord, numberValue, text } from "./xml-helpers";

export interface MusicXmlImportIssue {
  readonly severity: "info" | "warning" | "error";
  readonly message: string;
  readonly path: string;
}

export interface MusicXmlImportResult {
  readonly score: Score;
  readonly issues: MusicXmlImportIssue[];
}

const durationByType: Record<string, DurationName> = {
  whole: "whole",
  half: "half",
  quarter: "quarter",
  eighth: "eighth",
  "16th": "16th",
  "32nd": "32nd",
  "64th": "64th"
};

function pitchStep(value: unknown): PitchStep {
  const candidate = text(value);
  if (candidate === "C" || candidate === "D" || candidate === "E" || candidate === "F" || candidate === "G" || candidate === "A" || candidate === "B") {
    return candidate;
  }
  return "C";
}

function alter(value: unknown): -2 | -1 | 0 | 1 | 2 {
  const numeric = numberValue(value) ?? 0;
  if (numeric <= -2) {
    return -2;
  }
  if (numeric === -1) {
    return -1;
  }
  if (numeric === 1) {
    return 1;
  }
  if (numeric >= 2) {
    return 2;
  }
  return 0;
}

function quality(kind: unknown): ChordQuality {
  const value = text(kind)?.toLowerCase();
  if (value === "minor") {
    return "minor";
  }
  if (value === "dominant") {
    return "dominant";
  }
  if (value === "major-seventh") {
    return "major7";
  }
  if (value === "minor-seventh") {
    return "minor7";
  }
  if (value === "diminished") {
    return "diminished";
  }
  if (value === "augmented") {
    return "augmented";
  }
  return "major";
}

export function importMusicXml(xml: string): MusicXmlImportResult {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@" });
  const parsed: unknown = parser.parse(xml);
  const issues: MusicXmlImportIssue[] = [];
  if (!isRecord(parsed)) {
    return {
      score: createEmptyScore({ title: "Imported Score" }),
      issues: [{ severity: "error", message: "MusicXML 문서를 읽을 수 없습니다.", path: "/" }]
    };
  }

  const root = childRecord(parsed, "score-partwise") ?? childRecord(parsed, "score-timewise");
  if (!root) {
    return {
      score: createEmptyScore({ title: "Imported Score" }),
      issues: [{ severity: "error", message: "score-partwise 루트를 찾을 수 없습니다.", path: "/score-partwise" }]
    };
  }

  const title = text(root["work"] && isRecord(root["work"]) ? root["work"]["work-title"] : undefined) ?? "Imported Score";
  const partRecords = asArray(root["part"]).filter(isRecord);
  const firstPartMeasureCount = partRecords[0] ? asArray(partRecords[0]["measure"]).length : 8;
  const players = partRecords.map((part, index) => {
    const id = text(part["@id"]) ?? `P${index + 1}`;
    const instrument = createInstrument({
      id: `instrument_${id}`,
      name: `Part ${index + 1}`,
      shortName: `P${index + 1}`,
      midiProgram: 1
    });
    return createPlayer({
      id: `player_${id}`,
      name: `Part ${index + 1}`,
      instruments: [instrument]
    });
  });

  let score = createEmptyScore({
    title,
    measures: Math.max(firstPartMeasureCount, 1),
    players: players.length ? players : undefined
  });

  for (const [partIndex, part] of partRecords.entries()) {
    const instrument = score.players[partIndex]?.instruments[0];
    if (!instrument) {
      continue;
    }
    const staffId = instrument.staves[0];
    const measures = asArray(part["measure"]).filter(isRecord);
    for (const [measureIndex, musicXmlMeasure] of measures.entries()) {
      const measure = score.flows[0].measures[measureIndex];
      const voice = measure.eventsByStaff[staffId][0];

      for (const harmony of asArray(musicXmlMeasure["harmony"]).filter(isRecord)) {
        const root = childRecord(harmony, "root");
        const rootStep = root ? pitchStep(root["root-step"]) : "C";
        score = applyScoreOperation(
          score,
          createOperation({
            type: "insert-event",
            label: "Import chord",
            flowId: score.flows[0].id,
            measureId: measure.id,
            staffId,
            voiceId: voice.id,
            event: createChordSymbolEvent({
              staffId,
              voiceId: voice.id,
              root: rootStep,
              alter: root ? alter(root["root-alter"]) : 0,
              quality: quality(harmony["kind"])
            })
          })
        );
      }

      for (const note of asArray(musicXmlMeasure["note"]).filter(isRecord)) {
        const typeName = text(note["type"]) ?? "quarter";
        const duration = createDuration(durationByType[typeName] ?? "quarter");
        const dots = asArray(note["dot"]).length;
        const event =
          "rest" in note
            ? createRestEvent({ staffId, voiceId: voice.id, duration, dots })
            : createNoteEvent({
                staffId,
                voiceId: voice.id,
                duration,
                dots,
                pitch: createPitch(
                  pitchStep(childRecord(note, "pitch")?.["step"]),
                  numberValue(childRecord(note, "pitch")?.["octave"]) ?? 4,
                  alter(childRecord(note, "pitch")?.["alter"])
                )
              });

        score = applyScoreOperation(
          score,
          createOperation({
            type: "insert-event",
            label: "Import note",
            flowId: score.flows[0].id,
            measureId: measure.id,
            staffId,
            voiceId: voice.id,
            event
          })
        );

        const lyric = childRecord(note, "lyric");
        const lyricText = lyric ? text(lyric["text"]) : undefined;
        if (event.kind === "note" && lyricText) {
          score = applyScoreOperation(
            score,
            createOperation({
              type: "insert-event",
              label: "Import lyric",
              flowId: score.flows[0].id,
              measureId: measure.id,
              staffId,
              voiceId: voice.id,
              event: createLyricEvent({
                staffId,
                voiceId: voice.id,
                attachToEventId: event.id,
                text: lyricText
              })
            })
          );
        }
      }
    }
  }

  if (partRecords.length === 0) {
    issues.push({ severity: "warning", message: "파트가 없어 빈 악보로 가져왔습니다.", path: "/score-partwise/part" });
  }

  return { score, issues };
}
