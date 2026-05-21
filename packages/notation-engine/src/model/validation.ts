import type { Measure, Score } from "./types";
import { durationUnits } from "./types";

export interface ScoreIssue {
  readonly severity: "info" | "warning" | "error";
  readonly targetId: string;
  readonly message: string;
}

function measureCapacity(measure: Measure): number {
  return measure.timeSignature.beats * (64 / measure.timeSignature.beatUnit);
}

export function validateScore(score: Score): ScoreIssue[] {
  const issues: ScoreIssue[] = [];

  if (score.players.length === 0) {
    issues.push({
      severity: "error",
      targetId: score.id,
      message: "연주자 또는 악기가 없습니다."
    });
  }

  for (const flow of score.flows) {
    for (const measure of flow.measures) {
      const capacity = measureCapacity(measure);
      for (const voices of Object.values(measure.eventsByStaff)) {
        for (const voice of voices) {
          const used = voice.events.reduce((total, event) => {
            if (event.kind !== "note" && event.kind !== "rest") {
              return total;
            }
            const base = durationUnits[event.duration.name];
            const dots = Array.from({ length: event.dots }).reduce<number>(
              (sum, _, index) => sum + base / 2 ** (index + 1),
              0
            );
            return total + base + dots;
          }, 0);

          if (used > capacity) {
            issues.push({
              severity: "warning",
              targetId: measure.id,
              message: `${measure.number}마디의 박자가 초과되었습니다.`
            });
          }
        }
      }
    }
  }

  return issues;
}
