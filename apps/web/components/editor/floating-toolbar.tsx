"use client";

import { Trash2 } from "lucide-react";
import { useEditorStore } from "@/lib/editor-store";
import { Button } from "@/components/ui/button";

export function FloatingToolbar() {
  const selection = useEditorStore((state) => state.selection);
  const toggleArticulation = useEditorStore((state) => state.toggleArticulation);
  const removeSelected = useEditorStore((state) => state.removeSelected);

  if (selection.kind !== "event") {
    return null;
  }

  return (
    <div className="pointer-events-auto absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
      <Button aria-label="Staccato" size="icon" variant="ghost" onClick={() => toggleArticulation("staccato")}>
        <span className="text-lg leading-none">.</span>
      </Button>
      <Button aria-label="Accent" size="icon" variant="ghost" onClick={() => toggleArticulation("accent")}>
        <span className="text-lg leading-none">&gt;</span>
      </Button>
      <Button aria-label="Tenuto" size="icon" variant="ghost" onClick={() => toggleArticulation("tenuto")}>
        <span className="text-lg leading-none">-</span>
      </Button>
      <Button aria-label="Delete" size="icon" variant="ghost" onClick={removeSelected}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
