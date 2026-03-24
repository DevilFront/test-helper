"use client";

import { useEffect } from "react";
import {
  applyFontSize,
  applyTheme,
  initPreferencesFromStorage,
  readTheme,
} from "@/lib/preferences";

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    queueMicrotask(() => {
      initPreferencesFromStorage();
    });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      const t = readTheme();
      if (t === "system" || t === null) {
        applyTheme("system");
      }
    };
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cert-pref-theme" && e.newValue) {
        if (e.newValue === "light" || e.newValue === "dark" || e.newValue === "system") {
          applyTheme(e.newValue);
        }
      }
      if (e.key === "cert-pref-font" && e.newValue) {
        if (e.newValue === "sm" || e.newValue === "md" || e.newValue === "lg") {
          applyFontSize(e.newValue);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <>{children}</>;
}
