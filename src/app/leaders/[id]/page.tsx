import { getLeaderById, listKpis } from "@/application/services";
import { computePromotionLikelihood } from "@/domain/usecases";
import { TrendLineChart } from "@/ui/components/TrendLineChart";

export default function LeaderDetails({ params }: { params: { id: string } }) {
  const leader = getLeaderById(params.id);
  if (!leader) return <div className="p-6">Líder não encontrado</div>;
  const history = listKpis({ leaderId: leader.id, year: 2024 });
  const score = computePromotionLikelihood({ leader, history, talks: [] });
  const trendData = history
    .sort((a, b) => a.quarter - b.quarter)
    .map((k) => ({ x: `Q${k.quarter}`, y: k.dora.leadTime }));
  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{leader.name}</h1>
        <p className="text-sm text-gray-500">{leader.company} • {leader.roleAtTime}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-500">Score de promoção</div>
          <div className="mt-2 text-3xl font-semibold">{Math.round(score * 100)}%</div>
        </div>
        <TrendLineChart data={trendData} xKey="x" yKey="y" label="Lead time por trimestre (2024)" />
      </div>
    </div>
  );
}


