import { nanoid } from "nanoid";
import type {
  Accidental,
  ChordQuality,
  Clef,
  Duration,
  DurationName,
  EventId,
  Instrument,
  KeySignature,
  Measure,
  NotationEvent,
  Pitch,
  PitchStep,
  Player,
  Score,
  StaffId,
  TimeSignature,
  Voice,
  VoiceId
} from "./types";

export function createId(prefix: string): string {
  return `${prefix}_${nanoid(10)}`;
}

export function accidentalToAlter(accidental: Accidental): -2 | -1 | 0 | 1 | 2 {
  switch (accidental) {
    case "double-flat":
      return -2;
    case "flat":
      return -1;
    case "natural":
      return 0;
    case "sharp":
      return 1;
    case "double-sharp":
      return 2;
  }
}

export function createDuration(name: DurationName): Duration {
  return { name };
}

export function createPitch(step: PitchStep, octave: number, alter: -2 | -1 | 0 | 1 | 2 = 0): Pitch {
  return { step, octave, alter };
}

export function createNoteEvent(input: {
  staffId: StaffId;
  voiceId: VoiceId;
  pitch: Pitch;
  duration: Duration;
  dots?: number;
  id?: EventId;
}): NotationEvent {
  return {
    id: input.id ?? createId("evt"),
    kind: "note",
    staffId: input.staffId,
    voiceId: input.voiceId,
    pitch: input.pitch,
    duration: input.duration,
    dots: input.dots ?? 0,
    tied: { start: false, stop: false },
    articulations: [],
    lyricIds: []
  };
}

export function createRestEvent(input: {
  staffId: StaffId;
  voiceId: VoiceId;
  duration: Duration;
  dots?: number;
  id?: EventId;
}): NotationEvent {
  return {
    id: input.id ?? createId("evt"),
    kind: "rest",
    staffId: input.staffId,
    voiceId: input.voiceId,
    duration: input.duration,
    dots: input.dots ?? 0
  };
}

export function createChordSymbolEvent(input: {
  staffId: StaffId;
  voiceId: VoiceId;
  root: PitchStep;
  quality: ChordQuality;
  alter?: -2 | -1 | 0 | 1 | 2;
  attachToEventId?: EventId;
}): NotationEvent {
  return {
    id: createId("evt"),
    kind: "chord-symbol",
    staffId: input.staffId,
    voiceId: input.voiceId,
    root: input.root,
    alter: input.alter ?? 0,
    quality: input.quality,
    attachToEventId: input.attachToEventId
  };
}

export function createLyricEvent(input: {
  staffId: StaffId;
  voiceId: VoiceId;
  attachToEventId: EventId;
  text: string;
  verse?: number;
}): NotationEvent {
  return {
    id: createId("evt"),
    kind: "lyric",
    staffId: input.staffId,
    voiceId: input.voiceId,
    attachToEventId: input.attachToEventId,
    text: input.text,
    verse: input.verse ?? 1,
    syllabic: "single"
  };
}

export function createVoice(name = "Voice 1", id: VoiceId = createId("voice")): Voice {
  return { id, name, events: [] };
}

export function createMeasure(input: {
  number: number;
  staffIds: StaffId[];
  timeSignature?: TimeSignature;
  keySignature?: KeySignature;
  id?: string;
}): Measure {
  const eventsByStaff = input.staffIds.reduce<Record<StaffId, Voice[]>>((record, staffId) => {
    record[staffId] = [createVoice("Voice 1")];
    return record;
  }, {});

  return {
    id: input.id ?? createId("measure"),
    number: input.number,
    timeSignature: input.timeSignature ?? { beats: 4, beatUnit: 4 },
    keySignature: input.keySignature ?? { tonic: "C", mode: "major", fifths: 0 },
    barline: "single",
    eventsByStaff
  };
}

export function createInstrument(input?: Partial<Instrument> & { name?: string }): Instrument {
  const staffId = input?.staves?.[0] ?? createId("staff");
  const clefs: Record<StaffId, Clef> = {
    [staffId]: input?.clefs?.[staffId] ?? "treble"
  };

  return {
    id: input?.id ?? createId("instrument"),
    name: input?.name ?? "Piano",
    shortName: input?.shortName ?? "Pno.",
    family: input?.family ?? "keyboard",
    staves: input?.staves ?? [staffId],
    clefs: input?.clefs ?? clefs,
    transposition: input?.transposition,
    midiProgram: input?.midiProgram ?? 1,
    range: input?.range,
    muted: input?.muted ?? false,
    solo: input?.solo ?? false,
    volume: input?.volume ?? 0.8,
    pan: input?.pan ?? 0
  };
}

export function createPlayer(input?: Partial<Player> & { instrument?: Instrument }): Player {
  return {
    id: input?.id ?? createId("player"),
    name: input?.name ?? "Piano",
    instruments: input?.instruments ?? [input?.instrument ?? createInstrument()]
  };
}

export function createEmptyScore(input?: {
  title?: string;
  measures?: number;
  players?: Player[];
}): Score {
  const now = new Date().toISOString();
  const player = input?.players?.[0] ?? createPlayer();
  const players = input?.players ?? [player];
  const staffIds = players.flatMap((candidate) =>
    candidate.instruments.flatMap((instrument) => instrument.staves)
  );
  const flowId = createId("flow");
  const measureCount = input?.measures ?? 8;
  const measures = Array.from({ length: measureCount }, (_, index) =>
    createMeasure({
      number: index + 1,
      staffIds
    })
  );

  return {
    id: createId("score"),
    metadata: {
      title: input?.title ?? "Untitled Score",
      composer: "",
      lyricist: "",
      copyright: "",
      locale: "ko",
      createdAt: now,
      updatedAt: now
    },
    style: {
      profile: "default",
      pageSize: "a4",
      staffSize: 1,
      spacingDensity: "comfortable"
    },
    players,
    flows: [
      {
        id: flowId,
        title: "Flow 1",
        tempo: 96,
        measures
      }
    ],
    layouts: [
      {
        id: createId("layout"),
        name: "Full Score",
        kind: "full-score",
        visiblePlayerIds: players.map((candidate) => candidate.id),
        overrides: []
      }
    ],
    version: 1
  };
}

export function cloneEvent(event: NotationEvent): NotationEvent {
  return structuredClone(event) as NotationEvent;
}
