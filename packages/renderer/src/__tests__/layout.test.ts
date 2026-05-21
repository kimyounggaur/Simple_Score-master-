import { describe, expect, it } from "vitest";
import { createDuration, createEmptyScore, createNoteEvent, createOperation, createPitch, applyScoreOperation } from "@harmony/notation-engine";
import { createVexFlowRenderPlan, layoutScore } from "../index";

describe("layoutScore", () => {
  it("keeps layout coordinates outside the semantic model", () => {
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
    const layout = layoutScore(next);
    expect(layout.systems[0].staves[0].notes[0].x).toBeGreaterThan(0);
    expect("x" in event).toBe(false);
  });

  it("creates a VexFlow render plan", () => {
    const score = createEmptyScore({ measures: 1 });
    expect(createVexFlowRenderPlan(score).measures).toHaveLength(1);
  });
});
