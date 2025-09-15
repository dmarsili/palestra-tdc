"use client";
import useSWR from "swr";
import { KpiCard } from "@/ui/components/KpiCard";
import { TrendLineChart } from "@/ui/components/TrendLineChart";
import { CohortBarChart } from "@/ui/components/CohortBarChart";

type Summary = {
  promotionPctWithin12m: number;
  avgMonthsToPromotion: number;
  avgSessionNps: number;
  mentoringEngagementRate: number;
  avgOkrProgressByQuarter: { quarter: string; progress: number }[];
  promotionsByTrack: { track: string; count: number }[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const { data } = useSWR<Summary>("/api/kpis", fetcher);

  const trendData = (data?.avgOkrProgressByQuarter ?? []).map((d) => ({ x: d.quarter, y: Math.round(d.progress * 100) }));
  const cohortData = (data?.promotionsByTrack ?? []).map((d) => ({ label: d.track, value: d.count }));

  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Career Analytics – TDC Leaders</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="% promoção ≤12m" value={data ? `${data.promotionPctWithin12m}%` : "…"} />
        <KpiCard title="Tempo médio até promoção" value={data ? `${data.avgMonthsToPromotion} m` : "…"} />
        <KpiCard title="NPS médio sessão" value={data ? data.avgSessionNps.toFixed(1) : "…"} />
        <KpiCard title="Engajamento mentoria (≥8h)" value={data ? `${data.mentoringEngagementRate}%` : "…"} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrendLineChart data={trendData} xKey="x" yKey="y" label="Progresso médio OKR (%)" />
        <CohortBarChart data={cohortData} xKey="label" yKey="value" label="Promoções por trilha" />
      </div>
    </div>
  );
}



