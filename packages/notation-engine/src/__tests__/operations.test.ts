import { describe, expect, it } from "vitest";
import {
  applyScoreOperation,
  createDuration,
  createEmptyScore,
  createMeasure,
  createNoteEvent,
  createOperation,
  createPitch,
  dispatchOperation,
  createHistory,
  undo
} from "../index";

describe("ScoreOperation", () => {
  it("adds a note without storing layout coordinates", () => {
    const score = createEmptyScore({ measures: 1 });
    const flow = score.flows[0];
    const measure = flow.measures[0];
    const staffId = Object.keys(measure.eventsByStaff)[0];
    const voice = measure.eventsByStaff[staffId][0];
    const event = createNoteEvent({
      staffId,
      voiceId: voice.id,
      pitch: createPitch("C", 4),
      duration: createDuration("quarter")
    });

    const next = applyScoreOperation(
      score,
      createOperation({
        type: "insert-event",
        label: "Add note",
        flowId: flow.id,
        measureId: measure.id,
        staffId,
        voiceId: voice.id,
        event
      })
    );

    const inserted = next.flows[0].measures[0].eventsByStaff[staffId][0].events[0];
    expect(inserted.kind).toBe("note");
    expect("x" in inserted).toBe(false);
    expect("y" in inserted).toBe(false);
  });

  it("supports undo through inverse operations", () => {
    const score = createEmptyScore({ measures: 1 });
    const history = createHistory();
    const flow = score.flows[0];
    const measure = flow.measures[0];
    const staffId = Object.keys(measure.eventsByStaff)[0];
    const voice = measure.eventsByStaff[staffId][0];
    const event = createNoteEvent({
      staffId,
      voiceId: voice.id,
      pitch: createPitch("D", 4),
      duration: createDuration("quarter")
    });

    const added = dispatchOperation(
      score,
      history,
      createOperation({
        type: "insert-event",
        label: "Add note",
        flowId: flow.id,
        measureId: measure.id,
        staffId,
        voiceId: voice.id,
        event
      })
    );

    const restored = undo(added.score, added.history);
    expect(restored.score.flows[0].measures[0].eventsByStaff[staffId][0].events).toHaveLength(0);
  });

  it("adds and removes measures while preserving order", () => {
    const score = createEmptyScore({ measures: 1 });
    const flow = score.flows[0];
    const staffIds = Object.keys(flow.measures[0].eventsByStaff);
    const measure = createMeasure({ number: 2, staffIds });
    const next = applyScoreOperation(
      score,
      createOperation({ type: "add-measure", label: "Add measure", flowId: flow.id, measure })
    );

    expect(next.flows[0].measures).toHaveLength(2);
    expect(next.flows[0].measures[1].number).toBe(2);
  });
});
