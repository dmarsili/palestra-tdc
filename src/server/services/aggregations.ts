export type Leader = {
  id: string;
  talkDate: Date;
  promoted: boolean;
  promotionDate?: Date | null;
  sessionNps: number;
};

export type Mentoria = { leaderId: string; hours: number };

export function computePromotionPctWithin12m(leaders: Leader[]): number {
  if (!leaders.length) return 0;
  const promoted = leaders.filter((l) => l.promoted).length;
  return Math.round((promoted / leaders.length) * 100);
}

export function computeAvgMonthsToPromotion(leaders: Leader[]): number {
  const months = leaders
    .filter((l) => l.promoted && l.promotionDate)
    .map((l) => monthsBetween(l.talkDate, l.promotionDate!));
  if (!months.length) return 0;
  return Math.round((average(months) + Number.EPSILON) * 10) / 10;
}

export function computeAvgSessionNps(leaders: Leader[]): number {
  if (!leaders.length) return 0;
  return Math.round((average(leaders.map((l) => l.sessionNps)) + Number.EPSILON) * 10) / 10;
}

export function computeMentoringEngagementRate(leaders: Leader[], mentorias: Mentoria[]): number {
  if (!leaders.length) return 0;
  const with8h = new Set(mentorias.filter((m) => m.hours >= 8).map((m) => m.leaderId));
  return Math.round((with8h.size / leaders.length) * 100);
}

function monthsBetween(a: Date, b: Date): number {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

function average(arr: number[]): number {
  return arr.reduce((s, n) => s + n, 0) / arr.length;
}



