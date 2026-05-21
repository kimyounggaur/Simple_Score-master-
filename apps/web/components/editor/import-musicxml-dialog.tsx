"use client";

import { useState } from "react";
import { toast } from "sonner";
import { importMusicXml } from "@harmony/musicxml";
import { t } from "@/lib/i18n";
import { useEditorStore } from "@/lib/editor-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImportMusicXmlDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function ImportMusicXmlDialog({ open, onOpenChange }: ImportMusicXmlDialogProps) {
  const setScore = useEditorStore((state) => state.setScore);
  const [xml, setXml] = useState("");

  const importNow = () => {
    const result = importMusicXml(xml);
    setScore(result.score);
    toast.success(t("status.imported"));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog.importTitle")}</DialogTitle>
          <DialogDescription>{t("dialog.importDescription")}</DialogDescription>
        </DialogHeader>
        <textarea
          className="min-h-72 w-full rounded-md border border-slate-200 p-3 font-mono text-xs outline-none focus:border-teal-500"
          value={xml}
          onChange={(event) => setXml(event.target.value)}
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t("dialog.close")}
          </Button>
          <Button disabled={!xml.trim()} onClick={importNow}>
            {t("dialog.importAction")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
