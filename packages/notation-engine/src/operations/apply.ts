import { produce, type Draft } from "immer";
import { createVoice } from "../model/factory";
import type { Flow, Measure, NotationEvent, Score, Voice } from "../model/types";
import type { ScoreOperation } from "./types";

function requireFlow(score: Draft<Score>, flowId: string): Draft<Flow> {
  const flow = score.flows.find((candidate) => candidate.id === flowId);
  if (!flow) {
    throw new Error("대상 악장을 찾을 수 없습니다.");
  }
  return flow;
}

function requireMeasure(flow: Draft<Flow>, measureId: string): Draft<Measure> {
  const measure = flow.measures.find((candidate) => candidate.id === measureId);
  if (!measure) {
    throw new Error("대상 마디를 찾을 수 없습니다.");
  }
  return measure;
}

function requireVoice(measure: Draft<Measure>, staffId: string, voiceId: string): Draft<Voice> {
  const voice = measure.eventsByStaff[staffId]?.find((candidate) => candidate.id === voiceId);
  if (!voice) {
    throw new Error("대상 보이스를 찾을 수 없습니다.");
  }
  return voice;
}

function replaceEvent(score: Draft<Score>, eventId: string, next: NotationEvent): void {
  for (const flow of score.flows) {
    for (const measure of flow.measures) {
      for (const voices of Object.values(measure.eventsByStaff)) {
        for (const voice of voices) {
          const index = voice.events.findIndex((event) => event.id === eventId);
          if (index >= 0) {
            voice.events[index] = next;
            return;
          }
        }
      }
    }
  }
  throw new Error("수정할 악보 요소를 찾을 수 없습니다.");
}

function removeEvent(score: Draft<Score>, eventId: string): void {
  for (const flow of score.flows) {
    for (const measure of flow.measures) {
      for (const voices of Object.values(measure.eventsByStaff)) {
        for (const voice of voices) {
          const index = voice.events.findIndex((event) => event.id === eventId);
          if (index >= 0) {
            voice.events.splice(index, 1);
            return;
          }
        }
      }
    }
  }
  throw new Error("삭제할 악보 요소를 찾을 수 없습니다.");
}

function renumberMeasures(flow: Draft<Flow>): void {
  flow.measures.forEach((measure, index) => {
    measure.number = index + 1;
  });
}

function ensurePlayerStavesInMeasures(score: Draft<Score>, operation: Extract<ScoreOperation, { type: "add-player" }>): void {
  const staffIds = operation.player.instruments.flatMap((instrument) => instrument.staves);
  for (const flow of score.flows) {
    for (const measure of flow.measures) {
      for (const staffId of staffIds) {
        measure.eventsByStaff[staffId] = measure.eventsByStaff[staffId] ?? [createVoice()];
      }
    }
  }
}

function assertNever(operation: never): never {
  throw new Error(`지원하지 않는 작업입니다: ${JSON.stringify(operation)}`);
}

export function applyScoreOperation(score: Score, operation: ScoreOperation): Score {
  return produce(score, (draft) => {
    switch (operation.type) {
      case "insert-event": {
        const flow = requireFlow(draft, operation.flowId);
        const measure = requireMeasure(flow, operation.measureId);
        const voice = requireVoice(measure, operation.staffId, operation.voiceId);
        const index = operation.index ?? voice.events.length;
        voice.events.splice(index, 0, operation.event);
        break;
      }
      case "remove-event": {
        removeEvent(draft, operation.eventId);
        break;
      }
      case "update-event": {
        replaceEvent(draft, operation.eventId, operation.next);
        break;
      }
      case "add-measure": {
        const flow = requireFlow(draft, operation.flowId);
        const index = operation.index ?? flow.measures.length;
        flow.measures.splice(index, 0, operation.measure);
        renumberMeasures(flow);
        break;
      }
      case "remove-measure": {
        const flow = requireFlow(draft, operation.flowId);
        const index = flow.measures.findIndex((measure) => measure.id === operation.measureId);
        if (index < 0) {
          throw new Error("삭제할 마디를 찾을 수 없습니다.");
        }
        flow.measures.splice(index, 1);
        renumberMeasures(flow);
        break;
      }
      case "add-player": {
        draft.players.push(operation.player);
        ensurePlayerStavesInMeasures(draft, operation);
        for (const layout of draft.layouts) {
          layout.visiblePlayerIds.push(operation.player.id);
        }
        break;
      }
      case "remove-player": {
        const playerIndex = draft.players.findIndex((player) => player.id === operation.playerId);
        if (playerIndex < 0) {
          throw new Error("삭제할 연주자를 찾을 수 없습니다.");
        }
        const [player] = draft.players.splice(playerIndex, 1);
        const staffIds = player.instruments.flatMap((instrument) => instrument.staves);
        for (const flow of draft.flows) {
          for (const measure of flow.measures) {
            for (const staffId of staffIds) {
              delete measure.eventsByStaff[staffId];
            }
          }
        }
        for (const layout of draft.layouts) {
          layout.visiblePlayerIds = layout.visiblePlayerIds.filter((id) => id !== operation.playerId);
        }
        break;
      }
      case "update-instrument": {
        for (const player of draft.players) {
          const instrument = player.instruments.find(
            (candidate) => candidate.id === operation.instrumentId
          );
          if (instrument) {
            Object.assign(instrument, operation.patch);
            break;
          }
        }
        break;
      }
      case "set-tempo": {
        const flow = requireFlow(draft, operation.flowId);
        flow.tempo = operation.tempo;
        break;
      }
      case "set-metadata": {
        Object.assign(draft.metadata, operation.patch, { updatedAt: new Date().toISOString() });
        break;
      }
      case "set-dynamic": {
        const dynamic: NotationEvent = {
          id: `dyn_${operation.eventId}`,
          kind: "dynamic",
          staffId: "",
          voiceId: "",
          mark: operation.mark,
          attachToEventId: operation.eventId
        };
        for (const flow of draft.flows) {
          for (const measure of flow.measures) {
            for (const [staffId, voices] of Object.entries(measure.eventsByStaff)) {
              for (const voice of voices) {
                const noteIndex = voice.events.findIndex((event) => event.id === operation.eventId);
                if (noteIndex >= 0) {
                  voice.events.splice(noteIndex + 1, 0, {
                    ...dynamic,
                    staffId,
                    voiceId: voice.id
                  });
                  return;
                }
              }
            }
          }
        }
        break;
      }
      default:
        assertNever(operation);
    }

    draft.version += 1;
  });
}
