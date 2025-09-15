import { KpiSnapshot, Okr, PromotionScoreInput } from "./types";

/**
 * Heurística simples para score de promoção (0..1).
 * Fatores:
 * - Melhora em DORA (leadTime↓, deployFreq↑, mttr↓, changeFailRate↓)
 * - NPS do time ↑
 * - Participação no TDC dá bônus
 */
export function computePromotionLikelihood(input: PromotionScoreInput): number {
  const { leader, history } = input;
  if (history.length < 2) return leader.attendedTDC ? 0.3 : 0.2;

  // ordenar por ano+trimestre
  const sorted = [...history].sort((a, b) => a.year - b.year || a.quarter - b.quarter);
  const recent = sorted.slice(-4); // últimos 4 trimestres quando possível

  // variações acumuladas
  let doraDelta = 0;
  let npsDelta = 0;
  for (let i = 1; i < recent.length; i++) {
    const prev = recent[i - 1];
    const curr = recent[i];
    const leadTimeImprovement = prev.dora.leadTime - curr.dora.leadTime; // quanto menor, melhor
    const deployIncrease = curr.dora.deployFreq - prev.dora.deployFreq;
    const mttrImprovement = prev.dora.mttr - curr.dora.mttr; // menor, melhor
    const cfrImprovement = prev.dora.changeFailRate - curr.dora.changeFailRate; // menor, melhor
    const doraStep =
      normalize(leadTimeImprovement, -10, 10) * 0.25 +
      normalize(deployIncrease, -5, 5) * 0.25 +
      normalize(mttrImprovement, -10, 10) * 0.25 +
      normalize(cfrImprovement, -0.2, 0.2) * 0.25;
    doraDelta += doraStep;

    const npsStep = normalize(curr.teamNps - prev.teamNps, -40, 40);
    npsDelta += npsStep;
  }

  const doraScore = clamp(mapTo01(doraDelta, -2, 2));
  const npsScore = clamp(mapTo01(npsDelta, -2, 2));
  const predictabilityScore = clamp(
    average(recent.map((r) => r.deliveryPredictability))
  );

  let score = doraScore * 0.45 + npsScore * 0.25 + predictabilityScore * 0.3;
  if (leader.attendedTDC) score += 0.1; // bônus TDC
  return clamp(score);
}

export function aggregateOkrProgress(okr: Okr): number {
  if (!okr.keyResults.length) return 0;
  const progresses = okr.keyResults.map((kr) => {
    if (kr.target === 0) return kr.current > 0 ? 1 : 0;
    return clamp(kr.current / kr.target);
  });
  return clamp(average(progresses));
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min) * 2 - 1; // -> [-1,1]
}

function mapTo01(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export type { KpiSnapshot };


