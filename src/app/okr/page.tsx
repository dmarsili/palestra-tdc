import { listOkrs } from "@/application/services";
import { OkrProgress } from "@/ui/components/OkrProgress";

export default function OkrPage() {
  const okrs = listOkrs();
  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">OKRs</h1>
      <div className="grid grid-cols-1 gap-4">
        {okrs.map((o) => (
          <div key={o.id} className="space-y-3">
            <div className="rounded-2xl border p-4">
              <h2 className="text-lg font-semibold">{o.period}</h2>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium">Objetivos</div>
                  <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                    {o.objectives.map((obj, i) => (
                      <li key={i}>{obj.title} — {obj.description}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium">Key Results</div>
                  <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                    {o.keyResults.map((kr, i) => (
                      <li key={i}>{kr.metric}: {kr.current} / {kr.target}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <OkrProgress okr={o} />
          </div>
        ))}
      </div>
    </div>
  );
}


