import type { NotationEvent, Score } from "@harmony/notation-engine";
import { layoutScore, type LayoutOptions, type ScoreLayoutResult } from "./layout";

export interface VexFlowNotePlan {
  readonly id: string;
  readonly keys: string[];
  readonly duration: string;
  readonly clef: string;
  readonly semanticEvent: NotationEvent;
}

export interface VexFlowMeasurePlan {
  readonly measureId: string;
  readonly staffId: string;
  readonly notes: VexFlowNotePlan[];
}

export interface VexFlowRenderPlan {
  readonly layout: ScoreLayoutResult;
  readonly measures: VexFlowMeasurePlan[];
}

function vexDuration(event: NotationEvent): string {
  if (event.kind !== "note" && event.kind !== "rest") {
    return "q";
  }
  const map: Record<string, string> = {
    whole: "w",
    half: "h",
    quarter: "q",
    eighth: "8",
    "16th": "16",
    "32nd": "32",
    "64th": "64"
  };
  return `${map[event.duration.name]}${event.kind === "rest" ? "r" : ""}`;
}

function vexKey(event: NotationEvent): string[] {
  if (event.kind !== "note") {
    return ["b/4"];
  }
  const accidental = event.pitch.alter === 1 ? "#" : event.pitch.alter === -1 ? "b" : "";
  return [`${event.pitch.step.toLowerCase()}${accidental}/${event.pitch.octave}`];
}

export function createVexFlowRenderPlan(score: Score, options?: Partial<LayoutOptions>): VexFlowRenderPlan {
  const layout = layoutScore(score, options);
  const measures = layout.systems.flatMap((system) =>
    system.staves.flatMap((staff) =>
      system.measures.map<VexFlowMeasurePlan>((measure) => {
        const clef = staff.clef;
        const events = (measure.eventsByStaff[staff.staffId] ?? []).flatMap((voice) => voice.events);
        return {
          measureId: measure.id,
          staffId: staff.staffId,
          notes: events
            .filter((event) => event.kind === "note" || event.kind === "rest")
            .map((event) => ({
              id: event.id,
              keys: vexKey(event),
              duration: vexDuration(event),
              clef,
              semanticEvent: event
            }))
        };
      })
    )
  );

  return { layout, measures };
}
