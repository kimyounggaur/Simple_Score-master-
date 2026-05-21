"use client";

import { useCallback, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useAutosave } from "@/hooks/use-autosave";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useResponsiveEditor } from "@/hooks/use-responsive-editor";
import { useEditorStore } from "@/lib/editor-store";
import { TopBar } from "./top-bar";
import { LeftSidebar } from "./left-sidebar";
import { ScoreView } from "./score-view";
import { PropertiesPanel } from "./properties-panel";
import { StatusBar } from "./status-bar";
import { CommandPalette } from "./command-palette";
import { ImportMusicXmlDialog } from "./import-musicxml-dialog";
import { SlashMenu } from "./slash-menu";
import { MobilePlaybackBar } from "./mobile-playback-bar";
import { ZenOverlay } from "./zen-overlay";
import { cn } from "@/lib/utils";

export function HarmonyEditor() {
  const score = useEditorStore((state) => state.score);
  const zenMode = useEditorStore((state) => state.zenMode);
  const [commandOpen, setCommandOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [slashOpen, setSlashOpen] = useState(false);
  const openCommand = useCallback(() => setCommandOpen(true), []);
  const openSlash = useCallback(() => setSlashOpen(true), []);

  useAutosave(score);
  useResponsiveEditor();
  useKeyboardShortcuts(openCommand, openSlash);

  return (
    <TooltipProvider delayDuration={220}>
      <div className="flex h-screen min-h-0 flex-col bg-slate-100">
        {!zenMode && <TopBar onOpenCommand={openCommand} onOpenImport={() => setImportOpen(true)} />}
        <div className={cn("flex min-h-0 flex-1", zenMode && "fixed inset-0 z-40 bg-slate-100")}>
          {!zenMode && <LeftSidebar />}
          <ScoreView />
          {!zenMode && <PropertiesPanel />}
        </div>
        {!zenMode && <StatusBar />}
        <MobilePlaybackBar />
        <ZenOverlay />
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} onOpenImport={() => setImportOpen(true)} />
      <ImportMusicXmlDialog open={importOpen} onOpenChange={setImportOpen} />
      <SlashMenu open={slashOpen} onOpenChange={setSlashOpen} />
      <Toaster />
    </TooltipProvider>
  );
}
