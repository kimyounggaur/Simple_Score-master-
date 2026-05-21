"use client";

import { useEffect } from "react";
import { createPitch, type DurationName, type PitchStep } from "@harmony/notation-engine";
import { useEditorStore } from "@/lib/editor-store";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable ||
    target.closest("[cmdk-input]") !== null
  );
}

function durationForKey(key: string): DurationName | undefined {
  const map: Record<string, DurationName> = {
    "1": "whole",
    "2": "half",
    "3": "quarter",
    "4": "quarter",
    "5": "eighth",
    "6": "16th",
    "7": "32nd",
    "8": "64th"
  };
  return map[key];
}

function isPitchStep(key: string): key is PitchStep {
  return ["A", "B", "C", "D", "E", "F", "G"].includes(key);
}

export function useKeyboardShortcuts(openCommand: () => void, openSlash: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const state = useEditorStore.getState();
      const mod = event.metaKey || event.ctrlKey;

      if (mod && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openCommand();
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        openSlash();
        return;
      }

      if (mod && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          state.redo();
        } else {
          state.undo();
        }
        return;
      }

      if (mod && event.key.toLowerCase() === "y") {
        event.preventDefault();
        state.redo();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        state.removeSelected();
        return;
      }

      if (event.key === "F11") {
        event.preventDefault();
        state.toggleZenMode();
        return;
      }

      const duration = durationForKey(event.key);
      if (duration) {
        state.setDuration(duration);
        return;
      }

      const pitchKey = event.key.toUpperCase();
      if (isPitchStep(pitchKey)) {
        const score = state.score;
        const placement =
          state.selection.kind === "measure"
            ? { measureId: state.selection.measureId, staffId: state.selection.staffId }
            : undefined;
        const firstMeasure = score.flows[0].measures[0];
        const staffId = placement?.staffId ?? Object.keys(firstMeasure.eventsByStaff)[0];
        const measureId = placement?.measureId ?? firstMeasure.id;
        state.insertAt(measureId, staffId, createPitch(pitchKey, pitchKey === "A" || pitchKey === "B" ? 3 : 4));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openCommand, openSlash]);
}
