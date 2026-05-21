"use client";

import { useEffect } from "react";
import type { Score } from "@harmony/notation-engine";
import { loadLatestScore, saveScoreOffline } from "@/lib/offline-db";
import { useEditorStore } from "@/lib/editor-store";

export function useAutosave(score: Score) {
  const setScore = useEditorStore((state) => state.setScore);
  const setAutosaveState = useEditorStore((state) => state.setAutosaveState);

  useEffect(() => {
    let active = true;
    void loadLatestScore().then((storedScore) => {
      if (active && storedScore) {
        setScore(storedScore);
        setAutosaveState("saved");
      }
    });
    return () => {
      active = false;
    };
  }, [setAutosaveState, setScore]);

  useEffect(() => {
    setAutosaveState("saving");
    const timeout = window.setTimeout(() => {
      void saveScoreOffline(score).then(() => setAutosaveState("saved"));
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [score, setAutosaveState]);
}
