"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "portfolio-theme-change";

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

export function setPortfolioTheme(nextTheme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (nextTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch {
    // Ignore storage write errors in private browsing
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function togglePortfolioTheme() {
  const current = getThemeSnapshot();
  setPortfolioTheme(current === "dark" ? "light" : "dark");
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot
  );

  return (
    <button
      type="button"
      onClick={togglePortfolioTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
      )}
    </button>
  );
}
