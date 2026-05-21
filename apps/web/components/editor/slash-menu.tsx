"use client";

import { Music2, Plus, Type } from "lucide-react";
import { useState } from "react";
import type { PitchStep } from "@harmony/notation-engine";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/lib/editor-store";

interface SlashMenuProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function SlashMenu({ open, onOpenChange }: SlashMenuProps) {
  const addChord = useEditorStore((state) => state.addChord);
  const addLyric = useEditorStore((state) => state.addLyric);
  const addDynamic = useEditorStore((state) => state.addDynamic);
  const addMeasure = useEditorStore((state) => state.addMeasure);
  const [lyric, setLyric] = useState("");

  const run = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(420px,calc(100vw-32px))]">
        <DialogTitle className="sr-only">빠른 명령</DialogTitle>
        <DialogDescription className="sr-only">선택한 위치에 음악 요소를 추가합니다.</DialogDescription>
        <div className="space-y-2">
          <Button className="w-full justify-start" variant="secondary" onClick={() => run(addMeasure)}>
            <Plus className="h-4 w-4" />
            마디 추가
          </Button>
          {(["C", "D", "E", "F", "G", "A", "B"] as PitchStep[]).map((root) => (
            <Button key={root} className="w-full justify-start" variant="secondary" onClick={() => run(() => addChord(root, "major"))}>
              <Music2 className="h-4 w-4" />
              {root} 코드
            </Button>
          ))}
          <div className="flex gap-2">
            <Input placeholder="가사" value={lyric} onChange={(event) => setLyric(event.target.value)} />
            <Button
              variant="secondary"
              onClick={() =>
                run(() => {
                  addLyric(lyric);
                  setLyric("");
                })
              }
            >
              <Type className="h-4 w-4" />
            </Button>
          </div>
          <Button className="w-full justify-start" variant="secondary" onClick={() => run(() => addDynamic("mf"))}>
            mf
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
