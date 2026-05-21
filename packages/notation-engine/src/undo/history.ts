import { applyScoreOperation } from "../operations/apply";
import { invertScoreOperation } from "../operations/invert";
import type { Score } from "../model/types";
import type { ScoreOperation } from "../operations/types";

export interface ScoreHistory {
  readonly undoStack: ScoreOperation[];
  readonly redoStack: ScoreOperation[];
  readonly maxDepth: number;
}

export interface DispatchResult {
  readonly score: Score;
  readonly history: ScoreHistory;
}

export function createHistory(maxDepth = 100): ScoreHistory {
  return {
    undoStack: [],
    redoStack: [],
    maxDepth
  };
}

export function dispatchOperation(score: Score, history: ScoreHistory, operation: ScoreOperation): DispatchResult {
  const inverse = invertScoreOperation(score, operation);
  const nextScore = applyScoreOperation(score, operation);
  const undoStack = [...history.undoStack, inverse].slice(-history.maxDepth);
  return {
    score: nextScore,
    history: {
      ...history,
      undoStack,
      redoStack: []
    }
  };
}

export function undo(score: Score, history: ScoreHistory): DispatchResult {
  const inverse = history.undoStack.at(-1);
  if (!inverse) {
    return { score, history };
  }
  const redoOperation = invertScoreOperation(score, inverse);
  const nextScore = applyScoreOperation(score, inverse);
  return {
    score: nextScore,
    history: {
      ...history,
      undoStack: history.undoStack.slice(0, -1),
      redoStack: [...history.redoStack, redoOperation].slice(-history.maxDepth)
    }
  };
}

export function redo(score: Score, history: ScoreHistory): DispatchResult {
  const operation = history.redoStack.at(-1);
  if (!operation) {
    return { score, history };
  }
  const inverse = invertScoreOperation(score, operation);
  const nextScore = applyScoreOperation(score, operation);
  return {
    score: nextScore,
    history: {
      ...history,
      undoStack: [...history.undoStack, inverse].slice(-history.maxDepth),
      redoStack: history.redoStack.slice(0, -1)
    }
  };
}
