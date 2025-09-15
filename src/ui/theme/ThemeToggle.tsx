"use client";
import { useTheme } from "next-themes";
import React from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      className="rounded-md border px-3 py-1 text-sm"
      onClick={() => setTheme(next)}
      aria-label="Alternar tema"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}


