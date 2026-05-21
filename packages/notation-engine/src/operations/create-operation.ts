import { createId } from "../model/factory";
import type { ScoreOperation } from "./types";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, Extract<keyof T, K>> : never;

export type OperationInput = DistributiveOmit<ScoreOperation, "id" | "createdAt">;

export function createOperation(input: OperationInput): ScoreOperation {
  return {
    ...input,
    id: createId("op"),
    createdAt: new Date().toISOString()
  } as ScoreOperation;
}
