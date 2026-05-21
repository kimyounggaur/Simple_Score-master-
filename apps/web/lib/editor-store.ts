"use client";

import { create } from "zustand";
import {
  applyScoreOperation,
  createChordSymbolEvent,
  createDuration,
  createEmptyScore,
  createInstrument,
  createLyricEvent,
  createNoteEvent,
  createOperation,
  createPlayer,
  createRestEvent,
  dispatchOperation,
  emptySelection,
  findEvent,
  type ChordQuality,
  type DurationName,
  type DynamicMark,
  type EventId,
  type NotationEvent,
  type Pitch,
  type PitchStep,
  type Score,
  type ScoreHistory,
  type ScoreOperation,
  type Selection,
  type StaffId,
  undo as undoHistory,
  redo as redoHistory,
  createHistory
} from "@harmony/notation-engine";

export type EditorTool = "select" | "note" | "rest" | "chord" | "lyric" | "dynamic";

export interface EditorState {
  readonly score: Score;
  readonly history: ScoreHistory;
  readonly operationLog: ScoreOperation[];
  readonly selection: Selection;
  readonly tool: EditorTool;
  readonly duration: DurationName;
  readonly playingEventId: EventId | null;
  readonly zoom: number;
  readonly zenMode: boolean;
  readonly autosaveState: "idle" | "saving" | "saved";
  readonly mobileViewOnly: boolean;
  readonly setScore: (score: Score) => void;
  readonly dispatch: (operation: ScoreOperation) => void;
  readonly undo: () => void;
  readonly redo: () => void;
  readonly select: (selection: Selection) => void;
  readonly setTool: (tool: EditorTool) => void;
  readonly setDuration: (duration: DurationName) => void;
  readonly insertAt: (measureId: string, staffId: StaffId, pitch: Pitch) => void;
  readonly updateSelectedPitch: (pitch: Pitch) => void;
  readonly removeSelected: () => void;
  readonly addMeasure: () => void;
  readonly addInstrument: (template: "violin" | "cello" | "clarinet" | "voice") => void;
  readonly updateInstrument: (instrumentId: string, patch: { muted?: boolean; solo?: boolean; volume?: number; pan?: number }) => void;
  readonly addLyric: (text: string) => void;
  readonly addChord: (root: PitchStep, quality: ChordQuality) => void;
  readonly addDynamic: (mark: DynamicMark) => void;
  readonly toggleArticulation: (articulation: "staccato" | "accent" | "tenuto") => void;
  readonly setTempo: (tempo: number) => void;
  readonly setTitle: (title: string) => void;
  readonly setPlayingEventId: (eventId: EventId | null) => void;
  readonly setZoom: (zoom: number) => void;
  readonly toggleZenMode: () => void;
  readonly setAutosaveState: (state: EditorState["autosaveState"]) => void;
  readonly setMobileViewOnly: (value: boolean) => void;
}

function clampZoom(zoom: number): number {
  return Math.min(3, Math.max(0.5, zoom));
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
  return undefined;
}

function firstPlacement(score: Score) {
  const flow = score.flows[0];
  const measure = flow.measures[0];
  const staffId = Object.keys(measure.eventsByStaff)[0];
  const voice = measure.eventsByStaff[staffId][0];
  return { flowId: flow.id, measureId: measure.id, staffId, voiceId: voice.id, index: voice.events.length };
}

function placementFromSelection(score: Score, selection: Selection) {
  if (selection.kind === "event") {
    return findEventPlacement(score, selection.eventId) ?? firstPlacement(score);
  }
  if (selection.kind === "measure") {
    const flow = score.flows.find((candidate) =>
      candidate.measures.some((measure) => measure.id === selection.measureId)
    );
    const measure = flow?.measures.find((candidate) => candidate.id === selection.measureId);
    if (flow && measure) {
      const staffId = selection.staffId ?? Object.keys(measure.eventsByStaff)[0];
      const voice = measure.eventsByStaff[staffId][0];
      return { flowId: flow.id, measureId: measure.id, staffId, voiceId: voice.id, index: voice.events.length };
    }
  }
  return firstPlacement(score);
}

function selectedEvent(score: Score, selection: Selection): NotationEvent | undefined {
  if (selection.kind !== "event") {
    return undefined;
  }
  return findEvent(score, selection.eventId);
}

function instrumentTemplate(template: "violin" | "cello" | "clarinet" | "voice") {
  switch (template) {
    case "violin":
      return createInstrument({
        name: "Violin",
        shortName: "Vln.",
        family: "strings",
        midiProgram: 41
      });
    case "cello":
      return createInstrument({
        name: "Cello",
        shortName: "Vc.",
        family: "strings",
        midiProgram: 43
      });
    case "clarinet":
      return createInstrument({
        name: "Bb Clarinet",
        shortName: "Cl.",
        family: "woodwinds",
        midiProgram: 72,
        transposition: { chromatic: 2, diatonic: 1, octaveChange: 0 }
      });
    case "voice":
      return createInstrument({
        name: "Voice",
        shortName: "Vox",
        family: "voice",
        midiProgram: 54
      });
  }
}

export const useEditorStore = create<EditorState>((set, get) => ({
  score: createEmptyScore({ title: "Harmony" }),
  history: createHistory(120),
  operationLog: [],
  selection: emptySelection,
  tool: "note",
  duration: "quarter",
  playingEventId: null,
  zoom: 1,
  zenMode: false,
  autosaveState: "idle",
  mobileViewOnly: false,
  setScore: (score) =>
    set({
      score,
      history: createHistory(120),
      operationLog: [],
      selection: emptySelection,
      autosaveState: "saving"
    }),
  dispatch: (operation) => {
    const { score, history, operationLog } = get();
    const result = dispatchOperation(score, history, operation);
    set({
      score: result.score,
      history: result.history,
      operationLog: [...operationLog, operation],
      autosaveState: "saving"
    });
  },
  undo: () => {
    const { score, history } = get();
    const result = undoHistory(score, history);
    set({ score: result.score, history: result.history, autosaveState: "saving" });
  },
  redo: () => {
    const { score, history } = get();
    const result = redoHistory(score, history);
    set({ score: result.score, history: result.history, autosaveState: "saving" });
  },
  select: (selection) => set({ selection }),
  setTool: (tool) => set({ tool }),
  setDuration: (duration) => set({ duration }),
  insertAt: (measureId, staffId, pitch) => {
    const state = get();
    if (state.mobileViewOnly) {
      return;
    }
    const flow = state.score.flows.find((candidate) =>
      candidate.measures.some((measure) => measure.id === measureId)
    );
    const measure = flow?.measures.find((candidate) => candidate.id === measureId);
    const voice = measure?.eventsByStaff[staffId]?.[0];
    if (!flow || !measure || !voice) {
      return;
    }
    const event =
      state.tool === "rest"
        ? createRestEvent({ staffId, voiceId: voice.id, duration: createDuration(state.duration) })
        : createNoteEvent({ staffId, voiceId: voice.id, pitch, duration: createDuration(state.duration) });
    state.dispatch(
      createOperation({
        type: "insert-event",
        label: state.tool === "rest" ? "Add rest" : "Add note",
        flowId: flow.id,
        measureId,
        staffId,
        voiceId: voice.id,
        event
      })
    );
    set({ selection: { kind: "event", eventId: event.id } });
  },
  updateSelectedPitch: (pitch) => {
    const state = get();
    const event = selectedEvent(state.score, state.selection);
    if (event?.kind !== "note") {
      return;
    }
    state.dispatch(
      createOperation({
        type: "update-event",
        label: "Change pitch",
        eventId: event.id,
        next: { ...event, pitch }
      })
    );
  },
  removeSelected: () => {
    const state = get();
    if (state.selection.kind !== "event") {
      return;
    }
    const placement = findEventPlacement(state.score, state.selection.eventId);
    if (!placement) {
      return;
    }
    state.dispatch(
      createOperation({
        type: "remove-event",
        label: "Remove event",
        flowId: placement.flowId,
        measureId: placement.measureId,
        staffId: placement.staffId,
        voiceId: placement.voiceId,
        eventId: state.selection.eventId
      })
    );
    set({ selection: emptySelection });
  },
  addMeasure: () => {
    const state = get();
    const flow = state.score.flows[0];
    const staffIds = state.score.players.flatMap((player) =>
      player.instruments.flatMap((instrument) => instrument.staves)
    );
    const measure = {
      ...flow.measures[flow.measures.length - 1],
      id: `measure_${crypto.randomUUID()}`,
      number: flow.measures.length + 1,
      eventsByStaff: Object.fromEntries(
        staffIds.map((staffId) => [
          staffId,
          [
            {
              id: `voice_${crypto.randomUUID()}`,
              name: "Voice 1",
              events: []
            }
          ]
        ])
      )
    };
    state.dispatch(
      createOperation({
        type: "add-measure",
        label: "Add measure",
        flowId: flow.id,
        measure
      })
    );
  },
  addInstrument: (template) => {
    const state = get();
    const instrument = instrumentTemplate(template);
    state.dispatch(
      createOperation({
        type: "add-player",
        label: "Add part",
        player: createPlayer({ name: instrument.name, instruments: [instrument] })
      })
    );
  },
  updateInstrument: (instrumentId, patch) => {
    get().dispatch(createOperation({ type: "update-instrument", label: "Update instrument", instrumentId, patch }));
  },
  addLyric: (text) => {
    const state = get();
    const event = selectedEvent(state.score, state.selection);
    const placement = placementFromSelection(state.score, state.selection);
    if (event?.kind !== "note" || !text.trim()) {
      return;
    }
    state.dispatch(
      createOperation({
        type: "insert-event",
        label: "Add lyric",
        flowId: placement.flowId,
        measureId: placement.measureId,
        staffId: placement.staffId,
        voiceId: placement.voiceId,
        event: createLyricEvent({
          staffId: placement.staffId,
          voiceId: placement.voiceId,
          attachToEventId: event.id,
          text: text.trim()
        }),
        index: placement.index + 1
      })
    );
  },
  addChord: (root, quality) => {
    const state = get();
    const event = selectedEvent(state.score, state.selection);
    const placement = placementFromSelection(state.score, state.selection);
    state.dispatch(
      createOperation({
        type: "insert-event",
        label: "Add chord",
        flowId: placement.flowId,
        measureId: placement.measureId,
        staffId: placement.staffId,
        voiceId: placement.voiceId,
        event: createChordSymbolEvent({
          staffId: placement.staffId,
          voiceId: placement.voiceId,
          root,
          quality,
          attachToEventId: event?.id
        }),
        index: placement.index
      })
    );
  },
  addDynamic: (mark) => {
    const state = get();
    const placement = placementFromSelection(state.score, state.selection);
    const event: NotationEvent = {
      id: `evt_${crypto.randomUUID()}`,
      kind: "dynamic",
      staffId: placement.staffId,
      voiceId: placement.voiceId,
      mark,
      attachToEventId: state.selection.kind === "event" ? state.selection.eventId : undefined
    };
    state.dispatch(
      createOperation({
        type: "insert-event",
        label: "Add dynamic",
        flowId: placement.flowId,
        measureId: placement.measureId,
        staffId: placement.staffId,
        voiceId: placement.voiceId,
        event,
        index: placement.index + 1
      })
    );
  },
  toggleArticulation: (articulation) => {
    const state = get();
    const event = selectedEvent(state.score, state.selection);
    if (event?.kind !== "note") {
      return;
    }
    const exists = event.articulations.includes(articulation);
    state.dispatch(
      createOperation({
        type: "update-event",
        label: "Toggle articulation",
        eventId: event.id,
        next: {
          ...event,
          articulations: exists
            ? event.articulations.filter((candidate) => candidate !== articulation)
            : [...event.articulations, articulation]
        }
      })
    );
  },
  setTempo: (tempo) => {
    const flow = get().score.flows[0];
    get().dispatch(createOperation({ type: "set-tempo", label: "Set tempo", flowId: flow.id, tempo }));
  },
  setTitle: (title) => {
    get().dispatch(createOperation({ type: "set-metadata", label: "Set title", patch: { title } }));
  },
  setPlayingEventId: (eventId) => set({ playingEventId: eventId }),
  setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
  toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
  setAutosaveState: (autosaveState) => set({ autosaveState }),
  setMobileViewOnly: (mobileViewOnly) => set({ mobileViewOnly })
}));

export function scoreHealthSummary(score: Score): string {
  const eventCount = score.flows
    .flatMap((flow) => flow.measures)
    .flatMap((measure) => Object.values(measure.eventsByStaff).flatMap((voices) => voices.flatMap((voice) => voice.events)))
    .length;
  return `${score.flows[0].measures.length}마디 · ${score.players.length}파트 · ${eventCount}요소`;
}

export function applyImportedScore(score: Score): void {
  useEditorStore.getState().setScore(applyScoreOperation(score, createOperation({ type: "set-metadata", label: "Import touch", patch: {} })));
}
