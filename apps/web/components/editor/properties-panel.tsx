"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Hash, Music, SlidersHorizontal, Type } from "lucide-react";
import { findEvent, type DynamicMark, type PitchStep } from "@harmony/notation-engine";
import { useEditorStore } from "@/lib/editor-store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const pitchSteps: PitchStep[] = ["C", "D", "E", "F", "G", "A", "B"];
const dynamicMarks: DynamicMark[] = ["pp", "p", "mp", "mf", "f", "ff", "crescendo", "diminuendo"];

export function PropertiesPanel() {
  const score = useEditorStore((state) => state.score);
  const selection = useEditorStore((state) => state.selection);
  const setTempo = useEditorStore((state) => state.setTempo);
  const addLyric = useEditorStore((state) => state.addLyric);
  const addChord = useEditorStore((state) => state.addChord);
  const addDynamic = useEditorStore((state) => state.addDynamic);
  const updateSelectedPitch = useEditorStore((state) => state.updateSelectedPitch);
  const [lyric, setLyric] = useState("");
  const [chordRoot, setChordRoot] = useState<PitchStep>("C");
  const selected = useMemo(
    () => (selection.kind === "event" ? findEvent(score, selection.eventId) : undefined),
    [score, selection]
  );

  useEffect(() => {
    setLyric("");
  }, [selection]);

  return (
    <aside className="desktop-only w-72 shrink-0 border-l border-slate-200 bg-white p-3">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <SlidersHorizontal className="h-4 w-4" />
        {t("panel.properties")}
      </h2>
      <div className="space-y-4">
        <section className="space-y-2">
          <label className="text-xs font-medium text-slate-500" htmlFor="tempo">
            {t("panel.tempo")}
          </label>
          <Input
            id="tempo"
            max={240}
            min={30}
            type="number"
            value={score.flows[0].tempo}
            onChange={(event) => setTempo(Number(event.target.value))}
          />
        </section>
        {!selected ? (
          <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500">{t("panel.noSelection")}</p>
        ) : (
          <>
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Music className="h-4 w-4" />
                {t("sidebar.pitch")}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {pitchSteps.map((step) => (
                  <Button
                    key={step}
                    disabled={selected.kind !== "note"}
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      if (selected.kind === "note") {
                        updateSelectedPitch({ ...selected.pitch, step });
                      }
                    }}
                  >
                    {step}
                  </Button>
                ))}
              </div>
            </section>
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Type className="h-4 w-4" />
                {t("panel.lyric")}
              </div>
              <div className="flex gap-1">
                <Input value={lyric} onChange={(event) => setLyric(event.target.value)} />
                <Button
                  variant="secondary"
                  onClick={() => {
                    addLyric(lyric);
                    setLyric("");
                  }}
                >
                  +
                </Button>
              </div>
            </section>
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Hash className="h-4 w-4" />
                {t("panel.chord")}
              </div>
              <div className="flex gap-1">
                <select
                  className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm"
                  value={chordRoot}
                  onChange={(event) => setChordRoot(event.target.value as PitchStep)}
                >
                  {pitchSteps.map((step) => (
                    <option key={step} value={step}>
                      {step}
                    </option>
                  ))}
                </select>
                <Button variant="secondary" onClick={() => addChord(chordRoot, "major")}>
                  +
                </Button>
              </div>
            </section>
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Activity className="h-4 w-4" />
                {t("panel.dynamic")}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {dynamicMarks.map((mark) => (
                  <Button key={mark} size="sm" variant="secondary" onClick={() => addDynamic(mark)}>
                    {mark}
                  </Button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  );
}
