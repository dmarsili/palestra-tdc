"use client";
import React from "react";

type KpiCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  tone?: "neutral" | "good" | "bad";
};

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, tone = "neutral" }) => {
  const toneClass =
    tone === "good" ? "text-emerald-600 dark:text-emerald-400" : tone === "bad" ? "text-rose-600 dark:text-rose-400" : "text-foreground";
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</div>
      {subtitle ? <div className="mt-1 text-xs text-gray-500">{subtitle}</div> : null}
    </div>
  );
};


