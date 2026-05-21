"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/lib/editor-store";

export function useResponsiveEditor() {
  const setMobileViewOnly = useEditorStore((state) => state.setMobileViewOnly);

  useEffect(() => {
    const update = () => {
      setMobileViewOnly(window.innerWidth < 768);
      if (window.visualViewport) {
        document.documentElement.style.setProperty("--visual-height", `${window.visualViewport.height}px`);
      }
    };
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [setMobileViewOnly]);
}
