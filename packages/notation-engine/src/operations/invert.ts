import { createOperation } from "./create-operation";
import { findEvent } from "../model/guards";
import type { Instrument, Measure, NotationEvent, Player, Score } from "../model/types";
import type { ScoreOperation } from "./types";

function findMeasureWithIndex(score: Score, measureId: string): { readonly measure: Measure; readonly index: number } {
  for (const flow of score.flows) {
    const index = flow.measures.findIndex((measure) => measure.id === measureId);
    if (index >= 0) {
      return { measure: flow.measures[index], index };
    }
  }
  throw new Error("되돌릴 마디를 찾을 수 없습니다.");
}

function findPlayerWithIndex(score: Score, playerId: string): { readonly player: Player; readonly index: number } {
  const index = score.players.findIndex((player) => player.id === playerId);
  if (index < 0) {
    throw new Error("되돌릴 연주자를 찾을 수 없습니다.");
  }
  return { player: score.players[index], index };
}

function findInstrument(score: Score, instrumentId: string): Instrument {
  for (const player of score.players) {
    const instrument = player.instruments.find((candidate) => candidate.id === instrumentId);
    if (instrument) {
      return instrument;
    }
  }
  throw new Error("되돌릴 악기를 찾을 수 없습니다.");
}

function findEventPlacement(score: Score, eventId: string) {
  for (const flow of score.flows) {
    for (const measure of flow.measures) {
      for (const [staffId, voices] of Object.entries(measure.eventsByStaff)) {
        for (const voice of voices) {
          const index = voice.events.findIndex((event) => event.id === eventId);
          if (index >= 0) {
            return { flowId: flow.id, measureId: measure.id, staffId, voiceId: voice.id, index };
          }
        }
      }
    }
  }
  throw new Error("되돌릴 악보 요소 위치를 찾을 수 없습니다.");
}

export function invertScoreOperation(before: Score, operation: ScoreOperation): ScoreOperation {
  switch (operation.type) {
    case "insert-event":
      return createOperation({
        type: "remove-event",
        label: "Undo insert event",
        flowId: operation.flowId,
        measureId: operation.measureId,
        staffId: operation.staffId,
        voiceId: operation.voiceId,
        eventId: operation.event.id
      });
    case "remove-event": {
      const event = findEvent(before, operation.eventId);
      if (!event) {
        throw new Error("되돌릴 악보 요소를 찾을 수 없습니다.");
      }
      const placement = findEventPlacement(before, operation.eventId);
      return createOperation({
        type: "insert-event",
        label: "Undo remove event",
        flowId: placement.flowId,
        measureId: placement.measureId,
        staffId: placement.staffId,
        voiceId: placement.voiceId,
        event: event as NotationEvent,
        index: placement.index
      });
    }
    case "update-event": {
      const previous = findEvent(before, operation.eventId);
      if (!previous) {
        throw new Error("되돌릴 이전 악보 요소를 찾을 수 없습니다.");
      }
      return createOperation({
        type: "update-event",
        label: "Undo update event",
        eventId: operation.eventId,
        next: previous
      });
    }
    case "add-measure":
      return createOperation({
        type: "remove-measure",
        label: "Undo add measure",
        flowId: operation.flowId,
        measureId: operation.measure.id
      });
    case "remove-measure": {
      const { measure, index } = findMeasureWithIndex(before, operation.measureId);
      return createOperation({
        type: "add-measure",
        label: "Undo remove measure",
        flowId: operation.flowId,
        measure,
        index
      });
    }
    case "add-player":
      return createOperation({
        type: "remove-player",
        label: "Undo add player",
        playerId: operation.player.id
      });
    case "remove-player": {
      const { player } = findPlayerWithIndex(before, operation.playerId);
      return createOperation({
        type: "add-player",
        label: "Undo remove player",
        player
      });
    }
    case "update-instrument": {
      const instrument = findInstrument(before, operation.instrumentId);
      return createOperation({
        type: "update-instrument",
        label: "Undo update instrument",
        instrumentId: operation.instrumentId,
        patch: {
          muted: instrument.muted,
          solo: instrument.solo,
          volume: instrument.volume,
          pan: instrument.pan,
          name: instrument.name,
          shortName: instrument.shortName
        }
      });
    }
    case "set-tempo": {
      const flow = before.flows.find((candidate) => candidate.id === operation.flowId);
      if (!flow) {
        throw new Error("되돌릴 템포 정보를 찾을 수 없습니다.");
      }
      return createOperation({
        type: "set-tempo",
        label: "Undo tempo",
        flowId: operation.flowId,
        tempo: flow.tempo
      });
    }
    case "set-metadata":
      return createOperation({
        type: "set-metadata",
        label: "Undo metadata",
        patch: {
          title: before.metadata.title,
          subtitle: before.metadata.subtitle,
          composer: before.metadata.composer,
          lyricist: before.metadata.lyricist,
          copyright: before.metadata.copyright
        }
      });
    case "set-dynamic": {
      const dynamicId = `dyn_${operation.eventId}`;
      const placement = findEventPlacement(before, operation.eventId);
      return createOperation({
        type: "remove-event",
        label: "Undo dynamic",
        flowId: placement.flowId,
        measureId: placement.measureId,
        staffId: placement.staffId,
        voiceId: placement.voiceId,
        eventId: dynamicId
      });
    }
  }
}
