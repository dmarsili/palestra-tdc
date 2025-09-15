import { KpiCard } from "@/ui/components/KpiCard";
import { FiltersBar } from "@/ui/components/FiltersBar";
import { TrendLineChart } from "@/ui/components/TrendLineChart";
import { CohortBarChart } from "@/ui/components/CohortBarChart";
import { listKpis, listLeaders, listOkrs } from "@/application/services";
import { OkrProgress } from "@/ui/components/OkrProgress";

export default function Home() {
  const leaders = listLeaders();
  const kpis = listKpis({ year: 2024 });
  const okr = listOkrs()[0];

  const avgLeadTime = Math.round(
    kpis.reduce((acc, k) => acc + k.dora.leadTime, 0) / Math.max(1, kpis.length)
  );
  const avgDeploys = (
    kpis.reduce((acc, k) => acc + k.dora.deployFreq, 0) / Math.max(1, kpis.length)
  ).toFixed(1);

  const tdcPromotionCohort = leaders.filter((l) => l.attendedTDC && l.promotions > 0).length;
  const tdcAttended = leaders.filter((l) => l.attendedTDC).length;
  const cohortPct = tdcAttended ? Math.round((tdcPromotionCohort / tdcAttended) * 100) : 0;

  const trendData = kpis
    .sort((a, b) => a.quarter - b.quarter)
    .map((k) => ({ x: `Q${k.quarter}`, y: k.dora.deployFreq }));

  const cohortData = [
    { label: "Com TDC", value: tdcPromotionCohort },
    { label: "Sem TDC", value: leaders.filter((l) => !l.attendedTDC && l.promotions > 0).length },
  ];

  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard de KPIs/OKRs</h1>
      <p className="text-sm text-gray-500">Demonstração: líderes que participaram do TDC e evolução de carreira.</p>

      <FiltersBar years={[2023, 2024, 2025]} companies={[...new Set(leaders.map((l) => l.company))]} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Lead time médio (dias)" value={avgLeadTime} tone="good" />
        <KpiCard title="Deploys/semana" value={avgDeploys} tone="good" />
        <KpiCard title="% promovidos pós-TDC" value={`${cohortPct}%`} subtitle="Até 12 meses" tone="good" />
        <KpiCard title="Líderes (total)" value={leaders.length} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrendLineChart data={trendData} xKey="x" yKey="y" label="Tendência de Deploys (2024)" />
        <CohortBarChart data={cohortData} xKey="label" yKey="value" label="Promoções por coorte" />
      </div>

      {okr ? (
        <div>
          <h2 className="mt-6 text-xl font-semibold">OKR Atual</h2>
          <OkrProgress okr={okr} />
        </div>
      ) : null}
    </div>
  );
}
