import type { Measure, NotationEvent, Score, StaffId, Voice, VoiceId } from "./types";

export function getPrimaryFlow(score: Score) {
  const flow = score.flows[0];
  if (!flow) {
    throw new Error("악보에 악장이 없습니다.");
  }
  return flow;
}

export function findMeasure(score: Score, measureId: string): Measure | undefined {
  return score.flows.flatMap((flow) => flow.measures).find((measure) => measure.id === measureId);
}

export function findVoice(measure: Measure, staffId: StaffId, voiceId: VoiceId): Voice | undefined {
  return measure.eventsByStaff[staffId]?.find((voice) => voice.id === voiceId);
}

export function findEvent(score: Score, eventId: string): NotationEvent | undefined {
  for (const flow of score.flows) {
    for (const measure of flow.measures) {
      for (const voices of Object.values(measure.eventsByStaff)) {
        for (const voice of voices) {
          const event = voice.events.find((candidate) => candidate.id === eventId);
          if (event) {
            return event;
          }
        }
      }
    }
  }
  return undefined;
}
