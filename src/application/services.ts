import leadersData from "@/infrastructure/data/leaders.json";
import kpisData from "@/infrastructure/data/kpis.json";
import talksData from "@/infrastructure/data/talks.json";
import okrsData from "@/infrastructure/data/okrs.json";
import { Leader, KpiSnapshot, Talk, Okr } from "@/domain/types";

export type LeaderFilters = { year?: number; company?: string; track?: string };

export function listLeaders(filters: LeaderFilters = {}): Leader[] {
  const { company } = filters;
  let result = leadersData as Leader[];
  if (company) {
    result = result.filter((l) => l.company.toLowerCase() === company.toLowerCase());
  }
  return result;
}

export function getLeaderById(id: string): Leader | undefined {
  return (leadersData as Leader[]).find((l) => l.id === id);
}

export function listTalks(): Talk[] {
  return talksData as Talk[];
}

export function listKpis(params: { leaderId?: string; year?: number } = {}): KpiSnapshot[] {
  let result = kpisData as KpiSnapshot[];
  if (params.leaderId) {
    result = result.filter((k) => k.leaderId === params.leaderId);
  }
  if (params.year) {
    result = result.filter((k) => k.year === params.year);
  }
  return result;
}

export function listOkrs(): Okr[] {
  return okrsData as Okr[];
}


