"use client";

import { FileInput, Maximize2, Music2, Plus, Save } from "lucide-react";
import { t } from "@/lib/i18n";
import { useEditorStore } from "@/lib/editor-store";
import { exportScoreMusicXml } from "@/lib/exporters";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface CommandPaletteProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onOpenImport: () => void;
}

export function CommandPalette({ open, onOpenChange, onOpenImport }: CommandPaletteProps) {
  const score = useEditorStore((state) => state.score);
  const addMeasure = useEditorStore((state) => state.addMeasure);
  const addInstrument = useEditorStore((state) => state.addInstrument);
  const toggleZenMode = useEditorStore((state) => state.toggleZenMode);

  const run = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogTitle className="sr-only">{t("top.command")}</DialogTitle>
        <DialogDescription className="sr-only">{t("command.placeholder")}</DialogDescription>
        <Command>
          <CommandInput placeholder={t("command.placeholder")} />
          <CommandList>
            <CommandEmpty>{t("command.empty")}</CommandEmpty>
            <CommandGroup heading={t("command.group.edit")}>
              <CommandItem onSelect={() => run(addMeasure)}>
                <Plus className="h-4 w-4" />
                {t("command.addMeasure")}
              </CommandItem>
              <CommandItem onSelect={() => run(() => addInstrument("violin"))}>
                <Music2 className="h-4 w-4" />
                {t("command.addViolin")}
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading={t("command.group.score")}>
              <CommandItem onSelect={() => run(onOpenImport)}>
                <FileInput className="h-4 w-4" />
                {t("command.importMusicXml")}
              </CommandItem>
              <CommandItem onSelect={() => run(() => exportScoreMusicXml(score))}>
                <Save className="h-4 w-4" />
                {t("command.exportMusicXml")}
              </CommandItem>
              <CommandItem onSelect={() => run(toggleZenMode)}>
                <Maximize2 className="h-4 w-4" />
                {t("command.zen")}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
