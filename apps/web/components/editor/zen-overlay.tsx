"use client";

import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor-store";
import { t } from "@/lib/i18n";

export function ZenOverlay() {
  const zenMode = useEditorStore((state) => state.zenMode);
  const toggleZenMode = useEditorStore((state) => state.toggleZenMode);

  if (!zenMode) {
    return null;
  }

  return (
    <Button className="fixed right-4 top-4 z-50 bg-white" variant="secondary" onClick={toggleZenMode}>
      <Minimize2 className="h-4 w-4" />
      {t("zen.exit")}
    </Button>
  );
}
