"use client";

import { eventsToMidiFile, scoreToPlaybackEvents } from "@harmony/audio";
import { exportMusicXml } from "@harmony/musicxml";
import type { Score } from "@harmony/notation-engine";

function download(name: string, type: string, data: BlobPart) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportScoreMusicXml(score: Score) {
  download(`${score.metadata.title || "harmony"}.musicxml`, "application/vnd.recordare.musicxml+xml", exportMusicXml(score));
}

export function exportScoreMidi(score: Score) {
  const flow = score.flows[0];
  const bytes = eventsToMidiFile(scoreToPlaybackEvents(score), flow.tempo);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  download(`${score.metadata.title || "harmony"}.mid`, "audio/midi", buffer);
}

export function exportScoreSvg(score: Score) {
  const svg = document.querySelector("#score-svg");
  if (!(svg instanceof SVGSVGElement)) {
    return;
  }
  const serialized = new XMLSerializer().serializeToString(svg);
  download(`${score.metadata.title || "harmony"}.svg`, "image/svg+xml", serialized);
}

export function printScorePdf() {
  window.print();
}

export async function shareScoreLink(score: Score): Promise<void> {
  const url = `${location.origin}/?score=${encodeURIComponent(score.id)}`;
  await navigator.clipboard.writeText(url);
}
