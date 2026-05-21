import type { DurationName, Instrument, NoteEvent, Pitch, Score, StaffId } from "@harmony/notation-engine";

export interface PlaybackEvent {
  readonly id: string;
  readonly staffId: StaffId;
  readonly instrumentId: string;
  readonly startBeat: number;
  readonly durationBeats: number;
  readonly midi: number;
  readonly frequency: number;
  readonly velocity: number;
  readonly pan: number;
}

const durationBeats: Record<DurationName, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
  "16th": 0.25,
  "32nd": 0.125,
  "64th": 0.0625
};

const semitoneByStep: Record<Pitch["step"], number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11
};

export function pitchToMidi(pitch: Pitch): number {
  return (pitch.octave + 1) * 12 + semitoneByStep[pitch.step] + pitch.alter;
}

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function noteDurationBeats(note: Pick<NoteEvent, "duration" | "dots">): number {
  const base = durationBeats[note.duration.name];
  return Array.from({ length: note.dots }).reduce<number>(
    (total, _, index) => total + base / 2 ** (index + 1),
    base
  );
}

function instrumentForStaff(score: Score, staffId: StaffId): Instrument | undefined {
  return score.players
    .flatMap((player) => player.instruments)
    .find((instrument) => instrument.staves.includes(staffId));
}

function shouldPlay(instrument: Instrument, soloActive: boolean): boolean {
  if (instrument.muted) {
    return false;
  }
  if (soloActive) {
    return instrument.solo;
  }
  return true;
}

export function scoreToPlaybackEvents(score: Score): PlaybackEvent[] {
  const instruments = score.players.flatMap((player) => player.instruments);
  const soloActive = instruments.some((instrument) => instrument.solo);
  const events: PlaybackEvent[] = [];

  for (const flow of score.flows) {
    let measureStartBeat = 0;
    for (const measure of flow.measures) {
      const measureBeats = measure.timeSignature.beats * (4 / measure.timeSignature.beatUnit);
      for (const [staffId, voices] of Object.entries(measure.eventsByStaff)) {
        const instrument = instrumentForStaff(score, staffId);
        if (!instrument || !shouldPlay(instrument, soloActive)) {
          continue;
        }
        for (const voice of voices) {
          let voiceBeat = measureStartBeat;
          for (const event of voice.events) {
            if (event.kind === "note") {
              const writtenMidi = pitchToMidi(event.pitch);
              const soundingMidi = writtenMidi - (instrument.transposition?.chromatic ?? 0);
              events.push({
                id: event.id,
                staffId,
                instrumentId: instrument.id,
                startBeat: voiceBeat,
                durationBeats: noteDurationBeats(event),
                midi: soundingMidi,
                frequency: midiToFrequency(soundingMidi),
                velocity: instrument.volume,
                pan: instrument.pan
              });
              voiceBeat += noteDurationBeats(event);
            } else if (event.kind === "rest") {
              voiceBeat += durationBeats[event.duration.name];
            }
          }
        }
      }
      measureStartBeat += measureBeats;
    }
  }

  return events.sort((a, b) => a.startBeat - b.startBeat);
}

export function beatToSeconds(beat: number, bpm: number): number {
  return (60 / bpm) * beat;
}
