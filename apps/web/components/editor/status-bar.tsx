"use client";

import { scoreHealthSummary, useEditorStore } from "@/lib/editor-store";
import { t } from "@/lib/i18n";

export function StatusBar() {
  const score = useEditorStore((state) => state.score);
  const mobileViewOnly = useEditorStore((state) => state.mobileViewOnly);
  const selection = useEditorStore((state) => state.selection);

  return (
    <footer className="flex h-8 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-3 text-xs text-slate-500">
      <span>{mobileViewOnly ? t("status.mobile") : t("status.ready")}</span>
      <span>
        {selection.kind === "none" ? scoreHealthSummary(score) : `${t("panel.selection")}: ${selection.kind}`}
      </span>
    </footer>
  );
}
