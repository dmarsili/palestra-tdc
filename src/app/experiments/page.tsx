"use client";
import useSWR from "swr";

type ABResult = {
  group: "A" | "B";
  hoursPerMonth: number;
  sampleSize: number;
  promotedPct: number;
  avgMonthsToPromotion: number;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ExperimentsPage() {
  const { data } = useSWR<{ results: ABResult[] }>("/api/experiments/ab", fetcher);
  const rows = data?.results ?? [];
  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Experimentos: A/B de Mentoria</h1>
      <p className="text-sm text-muted-foreground">Grupo A: 4h/mês. Grupo B: 8h/mês.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Grupo</th>
              <th className="py-2 pr-4">Horas/mês</th>
              <th className="py-2 pr-4">Amostra</th>
              <th className="py-2 pr-4">% promovidos</th>
              <th className="py-2 pr-4">Tempo médio (meses)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.group} className="border-b">
                <td className="py-2 pr-4">{r.group}</td>
                <td className="py-2 pr-4">{r.hoursPerMonth}</td>
                <td className="py-2 pr-4">{r.sampleSize}</td>
                <td className="py-2 pr-4">{r.promotedPct}%</td>
                <td className="py-2 pr-4">{r.avgMonthsToPromotion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



