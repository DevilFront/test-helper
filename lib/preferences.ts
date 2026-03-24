export const THEME_STORAGE_KEY = "cert-pref-theme";
export const FONT_STORAGE_KEY = "cert-pref-font";
export const TIMER_STORAGE_KEY = "cert-pref-timer";

export type ThemePreference = "light" | "dark" | "system";
export type FontPreference = "sm" | "md" | "lg";

export function readTheme(): ThemePreference | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function readFont(): FontPreference | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(FONT_STORAGE_KEY);
    if (v === "sm" || v === "md" || v === "lg") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function applyTheme(theme: ThemePreference): void {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }
}

export function applyFontSize(size: FontPreference): void {
  if (size === "md") {
    document.documentElement.removeAttribute("data-font-size");
  } else {
    document.documentElement.setAttribute("data-font-size", size);
  }
}

export function persistTheme(theme: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function persistFont(size: FontPreference): void {
  try {
    localStorage.setItem(FONT_STORAGE_KEY, size);
  } catch {
    /* ignore */
  }
}

export function readTimerEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(TIMER_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function persistTimerEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(TIMER_STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function initPreferencesFromStorage(): void {
  const theme = readTheme() ?? "system";
  const font = readFont() ?? "md";
  applyTheme(theme);
  applyFontSize(font);
}
