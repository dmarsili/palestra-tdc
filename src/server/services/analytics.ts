import { prisma } from "@/server/db/client";

export type KpiSummary = {
  promotionPctWithin12m: number;
  avgMonthsToPromotion: number;
  avgSessionNps: number;
  mentoringEngagementRate: number; // leaders with >= 8h mentoring
  seniorityEvolution: { before: string; after: string; count: number }[];
  avgOkrProgressByQuarter: { quarter: string; progress: number }[];
  promotionsByTrack: { track: string; count: number }[];
};

export async function getKpiSummary(): Promise<KpiSummary> {
  const [leaders, mentorias, okrs] = await Promise.all([
    prisma.leader.findMany(),
    prisma.mentoria.findMany(),
    prisma.oKR.findMany({ include: { keyResults: true } }),
  ]);

  const total = leaders.length || 1;
  const promotedWithin12m = leaders.filter((l) => l.promoted).length;
  const promotionPctWithin12m = Math.round((promotedWithin12m / total) * 100);

  const monthsToPromotion: number[] = leaders
    .filter((l) => l.promoted && l.promotionDate)
    .map((l) => monthsBetween(l.talkDate, l.promotionDate!));
  const avgMonthsToPromotion = round1(avg(monthsToPromotion.length ? monthsToPromotion : [8]));

  const avgSessionNps = round1(avg(leaders.map((l) => l.sessionNps)));

  const leadersWith8h = new Set(
    mentorias.filter((m) => m.hours >= 8).map((m) => m.leaderId)
  ).size;
  const mentoringEngagementRate = Math.round((leadersWith8h / total) * 100);

  const seniorityEvolutionMap = new Map<string, { before: string; after: string; count: number }>();
  for (const l of leaders) {
    const key = `${l.seniorityBefore}->${l.seniorityAfter ?? l.seniorityBefore}`;
    const entry = seniorityEvolutionMap.get(key) ?? {
      before: l.seniorityBefore,
      after: l.seniorityAfter ?? l.seniorityBefore,
      count: 0,
    };
    entry.count += 1;
    seniorityEvolutionMap.set(key, entry);
  }
  const seniorityEvolution = Array.from(seniorityEvolutionMap.values());

  const okrByQuarter = new Map<string, number[]>();
  for (const o of okrs) {
    const p = averageOkrProgress(o.keyResults);
    const arr = okrByQuarter.get(o.quarter) ?? [];
    arr.push(p);
    okrByQuarter.set(o.quarter, arr);
  }
  const avgOkrProgressByQuarter = Array.from(okrByQuarter.entries()).map(([quarter, arr]) => ({
    quarter,
    progress: round2(avg(arr)),
  }));

  const promotionsByTrackMap = new Map<string, number>();
  for (const l of leaders) {
    if (l.promoted) promotionsByTrackMap.set(l.track, (promotionsByTrackMap.get(l.track) ?? 0) + 1);
  }
  const promotionsByTrack = Array.from(promotionsByTrackMap.entries()).map(([track, count]) => ({ track, count }));

  return {
    promotionPctWithin12m,
    avgMonthsToPromotion,
    avgSessionNps,
    mentoringEngagementRate,
    seniorityEvolution,
    avgOkrProgressByQuarter,
    promotionsByTrack,
  };
}

function averageOkrProgress(krs: { target: number; current: number }[]): number {
  if (!krs.length) return 0;
  const ps = krs.map((kr) => (kr.target === 0 ? (kr.current > 0 ? 1 : 0) : kr.current / kr.target));
  return clamp(avg(ps));
}

function monthsBetween(a: Date, b: Date): number {
  const months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  return Math.max(0, months);
}

function avg(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((s, n) => s + n, 0) / arr.length;
}

function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}



