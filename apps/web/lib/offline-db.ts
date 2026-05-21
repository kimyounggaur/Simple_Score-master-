"use client";

import Dexie, { type Table } from "dexie";
import type { Score } from "@harmony/notation-engine";

export interface StoredScore {
  readonly id: string;
  readonly score: Score;
  readonly updatedAt: string;
}

class HarmonyDb extends Dexie {
  scores!: Table<StoredScore, string>;

  constructor() {
    super("harmony-db");
    this.version(1).stores({
      scores: "id, updatedAt"
    });
  }
}

export const harmonyDb = new HarmonyDb();

export async function saveScoreOffline(score: Score): Promise<void> {
  await harmonyDb.scores.put({
    id: score.id,
    score,
    updatedAt: new Date().toISOString()
  });
}

export async function loadLatestScore(): Promise<Score | undefined> {
  const scores = await harmonyDb.scores.orderBy("updatedAt").reverse().limit(1).toArray();
  return scores[0]?.score;
}
