import { describe, expect, it } from "vitest";
import { computePromotionLikelihood } from "@/domain/usecases";
import { Leader, KpiSnapshot } from "@/domain/types";

function leader(partial: Partial<Leader> = {}): Leader {
  return {
    id: "l",
    name: "Teste",
    company: "ACME",
    roleAtTime: "TL",
    yearsExperience: 8,
    attendedTDC: false,
    talks: [],
    promotions: 0,
    ...partial,
  };
}

function kpiSeries(values: Array<Partial<KpiSnapshot>>): KpiSnapshot[] {
  return values.map((v, i) => ({
    leaderId: "l",
    year: 2024,
    quarter: ((i % 4) + 1) as 1 | 2 | 3 | 4,
    dora: { leadTime: 10, deployFreq: 3, mttr: 10, changeFailRate: 0.15 },
    teamNps: 10,
    deliveryPredictability: 0.5,
    ...v,
  }));
}

describe("computePromotionLikelihood", () => {
  it("dá bônus quando attendedTDC = true", () => {
    const baseHistory = kpiSeries([
      { dora: { leadTime: 10, deployFreq: 3, mttr: 10, changeFailRate: 0.15 }, teamNps: 10 },
      { dora: { leadTime: 9, deployFreq: 4, mttr: 9, changeFailRate: 0.14 }, teamNps: 20 },
    ]);
    const scoreNoTdc = computePromotionLikelihood({ leader: leader({ attendedTDC: false }), history: baseHistory, talks: [] });
    const scoreWithTdc = computePromotionLikelihood({ leader: leader({ attendedTDC: true }), history: baseHistory, talks: [] });
    expect(scoreWithTdc).toBeGreaterThan(scoreNoTdc);
  });

  it("melhora de DORA e NPS aumenta score", () => {
    const worse = kpiSeries([
      { dora: { leadTime: 10, deployFreq: 3, mttr: 10, changeFailRate: 0.15 }, teamNps: 10 },
      { dora: { leadTime: 11, deployFreq: 2, mttr: 11, changeFailRate: 0.16 }, teamNps: 8 },
    ]);
    const better = kpiSeries([
      { dora: { leadTime: 10, deployFreq: 3, mttr: 10, changeFailRate: 0.15 }, teamNps: 10 },
      { dora: { leadTime: 8, deployFreq: 5, mttr: 7, changeFailRate: 0.12 }, teamNps: 30 },
    ]);
    const scoreWorse = computePromotionLikelihood({ leader: leader(), history: worse, talks: [] });
    const scoreBetter = computePromotionLikelihood({ leader: leader(), history: better, talks: [] });
    expect(scoreBetter).toBeGreaterThan(scoreWorse);
  });
});


