import type {
  Clef,
  Measure,
  NotationEvent,
  Pitch,
  Score,
  StaffId
} from "@harmony/notation-engine";

export interface LayoutOptions {
  readonly width: number;
  readonly staffHeight: number;
  readonly measureWidth: number;
  readonly measuresPerSystem: number;
  readonly marginX: number;
  readonly marginY: number;
}

export interface LayoutNote {
  readonly event: NotationEvent;
  readonly x: number;
  readonly y: number;
  readonly measureId: string;
  readonly staffId: StaffId;
}

export interface LayoutStaff {
  readonly staffId: StaffId;
  readonly clef: Clef;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly measureIds: string[];
  readonly notes: LayoutNote[];
}

export interface LayoutSystem {
  readonly index: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly measures: Measure[];
  readonly staves: LayoutStaff[];
}

export interface ScoreLayoutResult {
  readonly width: number;
  readonly height: number;
  readonly systems: LayoutSystem[];
}

export const defaultLayoutOptions: LayoutOptions = {
  width: 1120,
  staffHeight: 92,
  measureWidth: 236,
  measuresPerSystem: 4,
  marginX: 54,
  marginY: 48
};

const stepOffsets: Record<Pitch["step"], number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6
};

export function pitchToMidi(pitch: Pitch): number {
  const semitoneByStep: Record<Pitch["step"], number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11
  };
  return (pitch.octave + 1) * 12 + semitoneByStep[pitch.step] + pitch.alter;
}

function pitchToStaffPosition(pitch: Pitch, clef: Clef): number {
  const reference = clef === "bass" ? { step: "F" as const, octave: 3 } : { step: "E" as const, octave: 4 };
  const pitchValue = pitch.octave * 7 + stepOffsets[pitch.step];
  const referenceValue = reference.octave * 7 + stepOffsets[reference.step];
  return pitchValue - referenceValue;
}

function eventX(measureIndex: number, eventIndex: number, eventCount: number, options: LayoutOptions): number {
  const spacing = options.measureWidth / Math.max(eventCount + 1, 2);
  return options.marginX + measureIndex * options.measureWidth + spacing * (eventIndex + 1);
}

function collectStaffIds(score: Score): Array<{ readonly staffId: StaffId; readonly clef: Clef }> {
  return score.players.flatMap((player) =>
    player.instruments.flatMap((instrument) =>
      instrument.staves.map((staffId) => ({
        staffId,
        clef: instrument.clefs[staffId] ?? "treble"
      }))
    )
  );
}

export function layoutScore(score: Score, partial?: Partial<LayoutOptions>): ScoreLayoutResult {
  const options = { ...defaultLayoutOptions, ...partial };
  const flow = score.flows[0];
  const staffDefinitions = collectStaffIds(score);
  const systems: LayoutSystem[] = [];

  for (let start = 0; start < flow.measures.length; start += options.measuresPerSystem) {
    const measures = flow.measures.slice(start, start + options.measuresPerSystem);
    const systemIndex = systems.length;
    const systemY = options.marginY + systemIndex * (staffDefinitions.length * options.staffHeight + 90);
    const staves = staffDefinitions.map((definition, staffIndex) => {
      const y = systemY + staffIndex * options.staffHeight;
      const notes = measures.flatMap((measure, measureIndex) => {
        const voices = measure.eventsByStaff[definition.staffId] ?? [];
        const events = voices.flatMap((voice) => voice.events);
        return events.map<LayoutNote>((event, eventIndex) => {
          const x = eventX(measureIndex, eventIndex, events.length, options);
          const yOffset =
            event.kind === "note"
              ? pitchToStaffPosition(event.pitch, definition.clef) * -5
              : event.kind === "dynamic"
                ? 40
                : event.kind === "chord-symbol"
                  ? -34
                  : event.kind === "lyric"
                    ? 54
                    : 0;
          return {
            event,
            x,
            y: y + 20 + yOffset,
            measureId: measure.id,
            staffId: definition.staffId
          };
        });
      });

      return {
        staffId: definition.staffId,
        clef: definition.clef,
        x: options.marginX,
        y,
        width: options.measureWidth * options.measuresPerSystem,
        measureIds: measures.map((measure) => measure.id),
        notes
      };
    });

    systems.push({
      index: systemIndex,
      x: options.marginX,
      y: systemY,
      width: options.measureWidth * options.measuresPerSystem,
      height: staffDefinitions.length * options.staffHeight,
      measures,
      staves
    });
  }

  const height =
    options.marginY * 2 + Math.max(1, systems.length) * (staffDefinitions.length * options.staffHeight + 90);

  return {
    width: options.width,
    height,
    systems
  };
}

export function yToPitch(y: number, staffY: number, clef: Clef): Pitch {
  const reference = clef === "bass" ? { step: "F" as const, octave: 3 } : { step: "E" as const, octave: 4 };
  const position = Math.round((staffY + 20 - y) / 5);
  const absolute = reference.octave * 7 + stepOffsets[reference.step] + position;
  const steps = ["C", "D", "E", "F", "G", "A", "B"] as const;
  const stepIndex = ((absolute % 7) + 7) % 7;
  const octave = Math.floor(absolute / 7);
  return {
    step: steps[stepIndex],
    octave,
    alter: 0
  };
}
