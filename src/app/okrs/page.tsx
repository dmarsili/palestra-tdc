"use client";
import useSWR from "swr";

type Okr = {
  id: string;
  owner: { name: string };
  objective: string;
  quarter: string;
  progress: number;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function OkrsPage() {
  const { data } = useSWR<Okr[]>("/api/okrs", fetcher);
  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">OKRs</h1>
      <div className="grid grid-cols-1 gap-4">
        {(data ?? []).map((okr) => (
          <div key={okr.id} className="rounded-2xl border p-4">
            <div className="text-sm text-muted-foreground">{okr.quarter}</div>
            <div className="font-semibold">{okr.objective}</div>
            <div className="text-sm">Owner: {okr.owner?.name ?? "—"}</div>
            <div className="h-2 mt-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded">
              <div className="h-2 bg-emerald-500 rounded" style={{ width: `${Math.round((okr.progress ?? 0) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



