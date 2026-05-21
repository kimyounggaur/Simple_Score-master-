import type {
  DynamicMark,
  EventId,
  FlowId,
  Instrument,
  Measure,
  MeasureId,
  NotationEvent,
  Player,
  ScoreMetadata,
  StaffId,
  VoiceId
} from "../model/types";

export interface OperationBase {
  readonly id: string;
  readonly createdAt: string;
  readonly label: string;
}

export interface InsertEventOperation extends OperationBase {
  readonly type: "insert-event";
  readonly flowId: FlowId;
  readonly measureId: MeasureId;
  readonly staffId: StaffId;
  readonly voiceId: VoiceId;
  readonly event: NotationEvent;
  readonly index?: number;
}

export interface RemoveEventOperation extends OperationBase {
  readonly type: "remove-event";
  readonly flowId: FlowId;
  readonly measureId: MeasureId;
  readonly staffId: StaffId;
  readonly voiceId: VoiceId;
  readonly eventId: EventId;
}

export interface UpdateEventOperation extends OperationBase {
  readonly type: "update-event";
  readonly eventId: EventId;
  readonly next: NotationEvent;
}

export interface AddMeasureOperation extends OperationBase {
  readonly type: "add-measure";
  readonly flowId: FlowId;
  readonly measure: Measure;
  readonly index?: number;
}

export interface RemoveMeasureOperation extends OperationBase {
  readonly type: "remove-measure";
  readonly flowId: FlowId;
  readonly measureId: MeasureId;
}

export interface AddPlayerOperation extends OperationBase {
  readonly type: "add-player";
  readonly player: Player;
}

export interface RemovePlayerOperation extends OperationBase {
  readonly type: "remove-player";
  readonly playerId: string;
}

export interface UpdateInstrumentOperation extends OperationBase {
  readonly type: "update-instrument";
  readonly instrumentId: string;
  readonly patch: Partial<Pick<Instrument, "muted" | "solo" | "volume" | "pan" | "name" | "shortName">>;
}

export interface SetTempoOperation extends OperationBase {
  readonly type: "set-tempo";
  readonly flowId: FlowId;
  readonly tempo: number;
}

export interface SetMetadataOperation extends OperationBase {
  readonly type: "set-metadata";
  readonly patch: Partial<Pick<ScoreMetadata, "title" | "composer" | "lyricist" | "copyright" | "subtitle">>;
}

export interface SetDynamicOperation extends OperationBase {
  readonly type: "set-dynamic";
  readonly eventId: EventId;
  readonly mark: DynamicMark;
}

export type ScoreOperation =
  | InsertEventOperation
  | RemoveEventOperation
  | UpdateEventOperation
  | AddMeasureOperation
  | RemoveMeasureOperation
  | AddPlayerOperation
  | RemovePlayerOperation
  | UpdateInstrumentOperation
  | SetTempoOperation
  | SetMetadataOperation
  | SetDynamicOperation;
