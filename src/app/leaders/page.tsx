"use client";
import useSWR from "swr";
import { DataTable, Column } from "@/ui/components/DataTable";

type Leader = {
  id: string;
  name: string;
  company: string;
  track: string;
  promoted: boolean;
  attendedTDC: boolean;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LeadersPage() {
  const params = new URLSearchParams();
  const [company, setCompany] = React.useState("");
  const [track, setTrack] = React.useState("");
  const [promoted, setPromoted] = React.useState("");

  if (company) params.set("company", company);
  if (track) params.set("track", track);
  if (promoted) params.set("promoted", promoted);

  const { data } = useSWR<Leader[]>(`/api/leaders${params.toString() ? `?${params.toString()}` : ""}`, fetcher);
  const leaders = data ?? [];

  const companies = Array.from(new Set(leaders.map((l) => l.company))).sort();
  const columns: Column<Leader & { promotedLabel: string }>[] = [
    { header: "Nome", cell: (r) => r.name },
    { header: "Empresa", cell: (r) => r.company },
    { header: "Trilha", cell: (r) => r.track },
    { header: "TDC?", cell: (r) => (r.attendedTDC ? "Sim" : "Não") },
    { header: "Promovido?", cell: (r) => (r.promoted ? "Sim" : "Não") },
  ];

  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Líderes</h1>

      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs mb-1">Empresa</label>
          <select className="border rounded px-2 py-1" value={company} onChange={(e) => setCompany(e.target.value)}>
            <option value="">Todas</option>
            {companies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Trilha</label>
          <select className="border rounded px-2 py-1" value={track} onChange={(e) => setTrack(e.target.value)}>
            <option value="">Todas</option>
            <option value="ENGENHARIA">ENGENHARIA</option>
            <option value="DADOS">DADOS</option>
            <option value="PRODUTO">PRODUTO</option>
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Promovido</label>
          <select className="border rounded px-2 py-1" value={promoted} onChange={(e) => setPromoted(e.target.value)}>
            <option value="">Todos</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>
      </div>

      <DataTable data={leaders.map((l) => ({ ...l, promotedLabel: l.promoted ? "Sim" : "Não" }))} columns={columns} />
    </div>
  );
}


