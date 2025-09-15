import { describe, it, expect } from "vitest";
import {
  computePromotionPctWithin12m,
  computeAvgMonthsToPromotion,
  computeAvgSessionNps,
} from "@/server/services/aggregations";

function leader(overrides: Partial<{ id: string; talkDate: Date; promoted: boolean; promotionDate?: Date | null; sessionNps: number }> = {}) {
  return {
    id: overrides.id ?? Math.random().toString(36).slice(2),
    talkDate: overrides.talkDate ?? new Date(2024, 0, 1),
    promoted: overrides.promoted ?? false,
    promotionDate: overrides.promotionDate ?? null,
    sessionNps: overrides.sessionNps ?? 8,
  };
}

describe("KPI aggregations", () => {
  it("computes promotion % within 12m", () => {
    const leaders = [leader({ promoted: true }), leader({ promoted: false }), leader({ promoted: true })];
    expect(computePromotionPctWithin12m(leaders)).toBe(67);
  });

  it("computes avg months to promotion", () => {
    const t0 = new Date(2024, 0, 1);
    const leaders = [
      leader({ promoted: true, talkDate: t0, promotionDate: new Date(2024, 6, 1) }), // 6m
      leader({ promoted: true, talkDate: t0, promotionDate: new Date(2024, 9, 1) }), // 9m
    ];
    expect(computeAvgMonthsToPromotion(leaders)).toBe(7.5);
  });

  it("computes avg session NPS", () => {
    const leaders = [leader({ sessionNps: 8 }), leader({ sessionNps: 9 }), leader({ sessionNps: 7.5 })];
    expect(computeAvgSessionNps(leaders)).toBe(8.2);
  });
});



