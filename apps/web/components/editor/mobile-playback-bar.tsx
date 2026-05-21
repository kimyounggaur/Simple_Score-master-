"use client";

import { Minus, Plus, Play } from "lucide-react";
import { playWithWebAudio, scoreToPlaybackEvents } from "@harmony/audio";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor-store";

let mobilePlaybackStop: (() => void) | undefined;

export function MobilePlaybackBar() {
  const score = useEditorStore((state) => state.score);
  const zoom = useEditorStore((state) => state.zoom);
  const setZoom = useEditorStore((state) => state.setZoom);
  const setPlayingEventId = useEditorStore((state) => state.setPlayingEventId);

  return (
    <div className="mobile-only fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center gap-3 border-t border-slate-200 bg-white p-2">
      <Button aria-label="Zoom out" size="icon" variant="ghost" onClick={() => setZoom(zoom - 0.1)}>
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        aria-label="Play"
        size="icon"
        onClick={() => {
          mobilePlaybackStop?.();
          mobilePlaybackStop = playWithWebAudio(scoreToPlaybackEvents(score), score.flows[0].tempo, setPlayingEventId).stop;
        }}
      >
        <Play className="h-4 w-4" />
      </Button>
      <Button aria-label="Zoom in" size="icon" variant="ghost" onClick={() => setZoom(zoom + 0.1)}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
