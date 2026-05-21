import { describe, expect, it } from "vitest";
import {
  applyScoreOperation,
  createDuration,
  createEmptyScore,
  createInstrument,
  createNoteEvent,
  createOperation,
  createPitch,
  createPlayer
} from "@harmony/notation-engine";
import { eventsToMidiFile, scoreToPlaybackEvents } from "../index";

describe("scoreToPlaybackEvents", () => {
  it("respects mute and transposition", () => {
    const clarinet = createInstrument({
      name: "Bb Clarinet",
      shortName: "Cl.",
      family: "woodwinds",
      transposition: { chromatic: 2, diatonic: 1, octaveChange: 0 }
    });
    const score = createEmptyScore({
      measures: 1,
      players: [createPlayer({ name: "Clarinet", instruments: [clarinet] })]
    });
    const flow = score.flows[0];
    const measure = flow.measures[0];
    const staffId = clarinet.staves[0];
    const voice = measure.eventsByStaff[staffId][0];
    const event = createNoteEvent({
      staffId,
      voiceId: voice.id,
      pitch: createPitch("D", 4),
      duration: createDuration("quarter")
    });
    const next = applyScoreOperation(
      score,
      createOperation({
        type: "insert-event",
        label: "Add clarinet note",
        flowId: flow.id,
        measureId: measure.id,
        staffId,
        voiceId: voice.id,
        event
      })
    );

    expect(scoreToPlaybackEvents(next)[0].midi).toBe(60);
  });

  it("exports a standard MIDI header", () => {
    const midi = eventsToMidiFile([], 120);
    expect(String.fromCharCode(...midi.slice(0, 4))).toBe("MThd");
  });
});
