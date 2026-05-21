"use client";

import { Music2, Plus, Volume2, VolumeX, MousePointer2, Circle, Minus, Mic2 } from "lucide-react";
import type { DurationName } from "@harmony/notation-engine";
import { t } from "@/lib/i18n";
import { useEditorStore, type EditorTool } from "@/lib/editor-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const durations: Array<{ readonly value: DurationName; readonly label: string }> = [
  { value: "whole", label: "1" },
  { value: "half", label: "2" },
  { value: "quarter", label: "4" },
  { value: "eighth", label: "8" },
  { value: "16th", label: "16" },
  { value: "32nd", label: "32" }
];

const tools: Array<{ readonly value: EditorTool; readonly label: string; readonly icon: React.ReactNode }> = [
  { value: "select", label: t("tool.select"), icon: <MousePointer2 className="h-4 w-4" /> },
  { value: "note", label: t("tool.note"), icon: <Music2 className="h-4 w-4" /> },
  { value: "rest", label: t("tool.rest"), icon: <Minus className="h-4 w-4" /> },
  { value: "chord", label: t("tool.chord"), icon: <Circle className="h-4 w-4" /> },
  { value: "lyric", label: t("tool.lyric"), icon: <Mic2 className="h-4 w-4" /> }
];

export function LeftSidebar() {
  const score = useEditorStore((state) => state.score);
  const tool = useEditorStore((state) => state.tool);
  const duration = useEditorStore((state) => state.duration);
  const setTool = useEditorStore((state) => state.setTool);
  const setDuration = useEditorStore((state) => state.setDuration);
  const addMeasure = useEditorStore((state) => state.addMeasure);
  const addInstrument = useEditorStore((state) => state.addInstrument);
  const updateInstrument = useEditorStore((state) => state.updateInstrument);

  return (
    <aside className="desktop-only flex w-64 shrink-0 flex-col gap-4 border-r border-slate-200 bg-slate-50 p-3">
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase text-slate-500">{t("sidebar.input")}</h2>
        <div className="grid grid-cols-2 gap-1">
          {tools.map((candidate) => (
            <Button
              key={candidate.value}
              className={cn("justify-start", tool === candidate.value && "border-teal-600 bg-teal-50 text-teal-900")}
              variant="secondary"
              onClick={() => setTool(candidate.value)}
            >
              {candidate.icon}
              {candidate.label}
            </Button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase text-slate-500">{t("sidebar.duration")}</h2>
        <div className="grid grid-cols-3 gap-1">
          {durations.map((candidate) => (
            <Button
              key={candidate.value}
              className={cn(duration === candidate.value && "border-teal-600 bg-teal-50 text-teal-900")}
              size="sm"
              variant="secondary"
              onClick={() => setDuration(candidate.value)}
            >
              {candidate.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <Button variant="secondary" onClick={addMeasure}>
          <Plus className="h-4 w-4" />
          {t("sidebar.addMeasure")}
        </Button>
        <Button variant="secondary" onClick={() => addInstrument("violin")}>
          <Plus className="h-4 w-4" />
          {t("sidebar.addPart")}
        </Button>
      </section>
      <section className="min-h-0 flex-1 overflow-auto">
        <h2 className="mb-2 text-xs font-semibold uppercase text-slate-500">{t("sidebar.parts")}</h2>
        <div className="space-y-2">
          {score.players.flatMap((player) =>
            player.instruments.map((instrument) => (
              <div key={instrument.id} className="rounded-md border border-slate-200 bg-white p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{instrument.name}</span>
                  <div className="flex gap-1">
                    <Button
                      aria-label="Mute"
                      className={cn(instrument.muted && "text-red-600")}
                      size="icon"
                      variant="ghost"
                      onClick={() => updateInstrument(instrument.id, { muted: !instrument.muted })}
                    >
                      {instrument.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      aria-label="Solo"
                      className={cn(instrument.solo && "text-teal-600")}
                      size="icon"
                      variant="ghost"
                      onClick={() => updateInstrument(instrument.id, { solo: !instrument.solo })}
                    >
                      S
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </aside>
  );
}
