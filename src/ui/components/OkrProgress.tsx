import React from "react";
import { Okr } from "@/domain/types";
import { aggregateOkrProgress } from "@/domain/usecases";

export function OkrProgress({ okr }: { okr: Okr }) {
  const pct = Math.round(aggregateOkrProgress(okr) * 100);
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm text-gray-500">Período {okr.period}</div>
      <div className="mt-1 text-lg font-semibold">Progresso geral: {pct}%</div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}


