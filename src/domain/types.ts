export type Talk = {
  id: string;
  event: "TDC";
  year: number;
  track: string;
  title: string;
};

export type TalkRef = {
  id: string;
};

export type Leader = {
  id: string;
  name: string;
  company: string;
  roleAtTime: string;
  yearsExperience: number;
  attendedTDC: boolean;
  talks: TalkRef[];
  promotions: number;
};

export type DoraMetrics = {
  leadTime: number; // dias
  deployFreq: number; // deploys/semana
  mttr: number; // horas
  changeFailRate: number; // 0..1
};

export type KpiSnapshot = {
  leaderId: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  dora: DoraMetrics;
  teamNps: number; // -100..100
  deliveryPredictability: number; // 0..1
};

export type OkrObjective = { title: string; description: string };
export type OkrKeyResult = { metric: string; target: number; current: number };

export type Okr = {
  id: string;
  period: string; // ex.: 2025-H2
  objectives: OkrObjective[];
  keyResults: OkrKeyResult[];
};

export type PromotionScoreInput = {
  leader: Leader;
  history: KpiSnapshot[];
  talks: Talk[];
};


