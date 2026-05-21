export type ScoreId = string;
export type PlayerId = string;
export type InstrumentId = string;
export type FlowId = string;
export type MeasureId = string;
export type StaffId = string;
export type VoiceId = string;
export type EventId = string;
export type LayoutId = string;

export type PitchStep = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Accidental = "double-flat" | "flat" | "natural" | "sharp" | "double-sharp";
export type DurationName =
  | "whole"
  | "half"
  | "quarter"
  | "eighth"
  | "16th"
  | "32nd"
  | "64th";
export type Clef = "treble" | "bass" | "alto" | "tenor" | "percussion";
export type Barline = "single" | "double" | "final" | "repeat-start" | "repeat-end";
export type Syllabic = "single" | "begin" | "middle" | "end";
export type DynamicMark =
  | "ppp"
  | "pp"
  | "p"
  | "mp"
  | "mf"
  | "f"
  | "ff"
  | "fff"
  | "crescendo"
  | "diminuendo";
export type Articulation =
  | "staccato"
  | "accent"
  | "tenuto"
  | "marcato"
  | "fermata"
  | "trill";
export type ChordQuality =
  | "major"
  | "minor"
  | "dominant"
  | "major7"
  | "minor7"
  | "diminished"
  | "augmented"
  | "suspended"
  | "power"
  | "other";

export interface ScoreMetadata {
  readonly title: string;
  readonly subtitle?: string;
  readonly composer?: string;
  readonly lyricist?: string;
  readonly copyright?: string;
  readonly locale: "ko" | "en";
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ScoreStyle {
  readonly profile: "default" | "lead-sheet" | "choral" | "piano" | "engraving";
  readonly pageSize: "a4" | "letter";
  readonly staffSize: number;
  readonly spacingDensity: "compact" | "comfortable" | "spacious";
}

export interface Pitch {
  readonly step: PitchStep;
  readonly alter: -2 | -1 | 0 | 1 | 2;
  readonly octave: number;
}

export interface Duration {
  readonly name: DurationName;
  readonly tuplet?: {
    readonly actual: number;
    readonly normal: number;
  };
}

export interface TimeSignature {
  readonly beats: number;
  readonly beatUnit: 1 | 2 | 4 | 8 | 16;
}

export interface KeySignature {
  readonly tonic: PitchStep;
  readonly mode: "major" | "minor";
  readonly fifths: number;
}

export interface Transposition {
  readonly chromatic: number;
  readonly diatonic: number;
  readonly octaveChange: number;
}

export interface Instrument {
  readonly id: InstrumentId;
  readonly name: string;
  readonly shortName: string;
  readonly family:
    | "keyboard"
    | "voice"
    | "strings"
    | "woodwinds"
    | "brass"
    | "percussion"
    | "guitar"
    | "other";
  readonly staves: StaffId[];
  readonly clefs: Record<StaffId, Clef>;
  readonly transposition?: Transposition;
  readonly midiProgram: number;
  readonly range?: {
    readonly low: Pitch;
    readonly high: Pitch;
  };
  readonly muted: boolean;
  readonly solo: boolean;
  readonly volume: number;
  readonly pan: number;
}

export interface Player {
  readonly id: PlayerId;
  readonly name: string;
  readonly instruments: Instrument[];
}

export interface BaseNotationEvent {
  readonly id: EventId;
  readonly staffId: StaffId;
  readonly voiceId: VoiceId;
}

export interface NoteEvent extends BaseNotationEvent {
  readonly kind: "note";
  readonly pitch: Pitch;
  readonly duration: Duration;
  readonly dots: number;
  readonly tied: {
    readonly start: boolean;
    readonly stop: boolean;
  };
  readonly articulations: Articulation[];
  readonly lyricIds: EventId[];
}

export interface RestEvent extends BaseNotationEvent {
  readonly kind: "rest";
  readonly duration: Duration;
  readonly dots: number;
}

export interface ChordSymbolEvent extends BaseNotationEvent {
  readonly kind: "chord-symbol";
  readonly root: PitchStep;
  readonly alter: -2 | -1 | 0 | 1 | 2;
  readonly quality: ChordQuality;
  readonly bass?: Pitch;
  readonly attachToEventId?: EventId;
}

export interface LyricEvent extends BaseNotationEvent {
  readonly kind: "lyric";
  readonly verse: number;
  readonly text: string;
  readonly syllabic: Syllabic;
  readonly attachToEventId: EventId;
}

export interface DynamicEvent extends BaseNotationEvent {
  readonly kind: "dynamic";
  readonly mark: DynamicMark;
  readonly attachToEventId?: EventId;
}

export interface SlurEvent extends BaseNotationEvent {
  readonly kind: "slur";
  readonly fromEventId: EventId;
  readonly toEventId: EventId;
}

export interface RehearsalMarkEvent extends BaseNotationEvent {
  readonly kind: "rehearsal-mark";
  readonly text: string;
}

export type NotationEvent =
  | NoteEvent
  | RestEvent
  | ChordSymbolEvent
  | LyricEvent
  | DynamicEvent
  | SlurEvent
  | RehearsalMarkEvent;

export interface Voice {
  readonly id: VoiceId;
  readonly name: string;
  readonly events: NotationEvent[];
}

export interface Measure {
  readonly id: MeasureId;
  readonly number: number;
  readonly timeSignature: TimeSignature;
  readonly keySignature: KeySignature;
  readonly barline: Barline;
  readonly eventsByStaff: Record<StaffId, Voice[]>;
}

export interface Flow {
  readonly id: FlowId;
  readonly title: string;
  readonly tempo: number;
  readonly measures: Measure[];
}

export interface LayoutManualOverride {
  readonly id: string;
  readonly targetId: EventId | MeasureId | StaffId;
  readonly kind: "nudge" | "hide" | "line-break" | "page-break" | "staff-spacing";
  readonly value: number | boolean | string;
}

export interface ScoreLayout {
  readonly id: LayoutId;
  readonly name: string;
  readonly kind: "full-score" | "part" | "lead-sheet";
  readonly visiblePlayerIds: PlayerId[];
  readonly overrides: LayoutManualOverride[];
}

export interface Score {
  readonly id: ScoreId;
  readonly metadata: ScoreMetadata;
  readonly style: ScoreStyle;
  readonly players: Player[];
  readonly flows: Flow[];
  readonly layouts: ScoreLayout[];
  readonly version: number;
}

export const durationUnits: Record<DurationName, number> = {
  whole: 64,
  half: 32,
  quarter: 16,
  eighth: 8,
  "16th": 4,
  "32nd": 2,
  "64th": 1
};

export const pitchSteps: PitchStep[] = ["C", "D", "E", "F", "G", "A", "B"];
