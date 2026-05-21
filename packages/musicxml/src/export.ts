import type { ChordSymbolEvent, NotationEvent, Pitch, Score } from "@harmony/notation-engine";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pitchXml(pitch: Pitch): string {
  return [
    "<pitch>",
    `<step>${pitch.step}</step>`,
    pitch.alter !== 0 ? `<alter>${pitch.alter}</alter>` : "",
    `<octave>${pitch.octave}</octave>`,
    "</pitch>"
  ].join("");
}

function durationType(event: Extract<NotationEvent, { kind: "note" | "rest" }>): string {
  return event.duration.name;
}

function noteXml(event: NotationEvent): string {
  if (event.kind === "note") {
    return [
      "<note>",
      pitchXml(event.pitch),
      "<duration>1</duration>",
      `<type>${durationType(event)}</type>`,
      event.dots > 0 ? "<dot/>".repeat(event.dots) : "",
      "</note>"
    ].join("");
  }
  if (event.kind === "rest") {
    return [
      "<note><rest/>",
      "<duration>1</duration>",
      `<type>${durationType(event)}</type>`,
      event.dots > 0 ? "<dot/>".repeat(event.dots) : "",
      "</note>"
    ].join("");
  }
  return "";
}

function chordXml(event: ChordSymbolEvent): string {
  const kindByQuality: Record<ChordSymbolEvent["quality"], string> = {
    major: "major",
    minor: "minor",
    dominant: "dominant",
    major7: "major-seventh",
    minor7: "minor-seventh",
    diminished: "diminished",
    augmented: "augmented",
    suspended: "suspended",
    power: "power",
    other: "other"
  };
  return [
    "<harmony>",
    "<root>",
    `<root-step>${event.root}</root-step>`,
    event.alter !== 0 ? `<root-alter>${event.alter}</root-alter>` : "",
    "</root>",
    `<kind>${kindByQuality[event.quality]}</kind>`,
    "</harmony>"
  ].join("");
}

export function exportMusicXml(score: Score): string {
  const flow = score.flows[0];
  const parts = score.players.flatMap((player) => player.instruments.map((instrument) => ({ player, instrument })));
  const partList = parts
    .map(
      ({ instrument }) =>
        `<score-part id="${instrument.id}"><part-name>${escapeXml(instrument.name)}</part-name></score-part>`
    )
    .join("");
  const body = parts
    .map(({ instrument }) => {
      const staffId = instrument.staves[0];
      const measures = flow.measures
        .map((measure) => {
          const events = (measure.eventsByStaff[staffId] ?? []).flatMap((voice) => voice.events);
          const harmony = events.filter((event): event is ChordSymbolEvent => event.kind === "chord-symbol").map(chordXml).join("");
          const notes = events.map(noteXml).join("");
          return [
            `<measure number="${measure.number}">`,
            measure.number === 1
              ? `<attributes><divisions>1</divisions><key><fifths>${measure.keySignature.fifths}</fifths></key><time><beats>${measure.timeSignature.beats}</beats><beat-type>${measure.timeSignature.beatUnit}</beat-type></time></attributes>`
              : "",
            harmony,
            notes,
            "</measure>"
          ].join("");
        })
        .join("");
      return `<part id="${instrument.id}">${measures}</part>`;
    })
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<score-partwise version="4.0">',
    `<work><work-title>${escapeXml(score.metadata.title)}</work-title></work>`,
    `<identification><creator type="composer">${escapeXml(score.metadata.composer ?? "")}</creator></identification>`,
    `<part-list>${partList}</part-list>`,
    body,
    "</score-partwise>"
  ].join("");
}
