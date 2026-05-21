"use client";

import { Command, Download, FileInput, Maximize2, Menu, Play, Search, Share2, Square, Undo2, Redo2 } from "lucide-react";
import { toast } from "sonner";
import { playWithWebAudio, scoreToPlaybackEvents } from "@harmony/audio";
import { t } from "@/lib/i18n";
import { useEditorStore } from "@/lib/editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { exportScoreMidi, exportScoreMusicXml, exportScoreSvg, printScorePdf, shareScoreLink } from "@/lib/exporters";

interface TopBarProps {
  readonly onOpenCommand: () => void;
  readonly onOpenImport: () => void;
}

let playbackStop: (() => void) | undefined;

export function TopBar({ onOpenCommand, onOpenImport }: TopBarProps) {
  const score = useEditorStore((state) => state.score);
  const autosaveState = useEditorStore((state) => state.autosaveState);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const setTitle = useEditorStore((state) => state.setTitle);
  const setPlayingEventId = useEditorStore((state) => state.setPlayingEventId);
  const toggleZenMode = useEditorStore((state) => state.toggleZenMode);
  const playingEventId = useEditorStore((state) => state.playingEventId);

  const play = () => {
    playbackStop?.();
    const handle = playWithWebAudio(scoreToPlaybackEvents(score), score.flows[0].tempo, setPlayingEventId);
    playbackStop = handle.stop;
  };

  const stop = () => {
    playbackStop?.();
    playbackStop = undefined;
    setPlayingEventId(null);
  };

  const exportAndToast = (action: () => void) => {
    action();
    toast.success(t("status.exported"));
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3">
      <div className="mobile-only">
        <Button aria-label={t("mobile.menu")} size="icon" variant="ghost">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <Input
        aria-label={t("panel.title")}
        className="h-9 max-w-64 border-transparent bg-transparent px-1 text-base font-semibold focus:border-slate-200"
        value={score.metadata.title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <span className="hidden text-xs text-slate-500 sm:inline">
        {autosaveState === "saved" ? t("top.saved") : t("top.saving")}
      </span>
      <div className="ml-auto flex items-center gap-1">
        <Button aria-label={t("toolbar.undo")} size="icon" variant="ghost" onClick={undo}>
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button aria-label={t("toolbar.redo")} size="icon" variant="ghost" onClick={redo}>
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button aria-label={t("toolbar.play")} size="icon" variant="ghost" onClick={play}>
          <Play className="h-4 w-4" />
        </Button>
        <Button aria-label={t("toolbar.stop")} disabled={!playingEventId} size="icon" variant="ghost" onClick={stop}>
          <Square className="h-4 w-4" />
        </Button>
        <Button aria-label={t("top.command")} className="desktop-only" variant="secondary" onClick={onOpenCommand}>
          <Search className="h-4 w-4" />
          <span>{t("top.command")}</span>
          <Command className="h-3.5 w-3.5 text-slate-400" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label={t("top.export")} size="icon" variant="ghost">
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => exportAndToast(() => exportScoreMusicXml(score))}>
              <Download className="h-4 w-4" />
              {t("export.musicxml")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exportAndToast(() => exportScoreSvg(score))}>
              <Download className="h-4 w-4" />
              {t("export.svg")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exportAndToast(() => exportScoreMidi(score))}>
              <Download className="h-4 w-4" />
              {t("export.midi")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exportAndToast(printScorePdf)}>
              <Download className="h-4 w-4" />
              {t("export.pdf")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onOpenImport}>
              <FileInput className="h-4 w-4" />
              {t("command.importMusicXml")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          aria-label={t("top.share")}
          size="icon"
          variant="ghost"
          onClick={() => void shareScoreLink(score).then(() => toast.success(t("share.copied")))}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button aria-label={t("top.zen")} size="icon" variant="ghost" onClick={toggleZenMode}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
