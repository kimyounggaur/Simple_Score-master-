import type { PlaybackEvent } from "./scheduler";
import { beatToSeconds } from "./scheduler";

export interface PlaybackHandle {
  readonly stop: () => void;
}

export function playWithWebAudio(
  events: PlaybackEvent[],
  bpm: number,
  onCursor?: (eventId: string | null) => void
): PlaybackHandle {
  const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
  const context = new AudioContextCtor();
  const stopCallbacks: Array<() => void> = [];
  const cursorTimers: number[] = [];
  const startAt = context.currentTime + 0.08;

  for (const event of events) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const stereo = context.createStereoPanner();
    const noteStart = startAt + beatToSeconds(event.startBeat, bpm);
    const noteEnd = noteStart + beatToSeconds(event.durationBeats, bpm) * 0.92;

    oscillator.type = "triangle";
    oscillator.frequency.value = event.frequency;
    stereo.pan.value = event.pan;
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.02, event.velocity * 0.18), noteStart + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
    oscillator.connect(gain).connect(stereo).connect(context.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteEnd + 0.02);
    stopCallbacks.push(() => oscillator.stop());

    if (onCursor) {
      const startTimer = window.setTimeout(() => onCursor(event.id), beatToSeconds(event.startBeat, bpm) * 1000);
      const endTimer = window.setTimeout(
        () => onCursor(null),
        beatToSeconds(event.startBeat + event.durationBeats, bpm) * 1000
      );
      cursorTimers.push(startTimer, endTimer);
    }
  }

  return {
    stop: () => {
      for (const timer of cursorTimers) {
        window.clearTimeout(timer);
      }
      for (const stop of stopCallbacks) {
        try {
          stop();
        } catch {
          // Oscillators throw if already stopped; playback stop should remain idempotent.
        }
      }
      void context.close();
      onCursor?.(null);
    }
  };
}

declare global {
  interface Window {
    readonly webkitAudioContext?: typeof AudioContext;
  }
}
