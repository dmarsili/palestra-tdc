import { NextResponse } from "next/server";

type Result = {
  group: "A" | "B";
  hoursPerMonth: number;
  sampleSize: number;
  promotedPct: number;
  avgMonthsToPromotion: number;
};

export function GET() {
  // Synthetic A/B: A=4h/month, B=8h/month
  const results: Result[] = [
    simulateGroup("A", 4, 60),
    simulateGroup("B", 8, 60),
  ];
  return NextResponse.json({ results });
}

function simulateGroup(group: "A" | "B", hoursPerMonth: number, size: number): Result {
  const basePromotion = 0.3;
  const uplift = group === "B" ? 0.12 : 0.0; // 12pp uplift for 8h/month
  const promoted = Math.round(size * (basePromotion + uplift));
  const months = Array.from({ length: promoted }).map(() => 6 + Math.random() * 6);
  const avgMonths = months.length ? months.reduce((a, b) => a + b, 0) / months.length : 0;
  return {
    group,
    hoursPerMonth,
    sampleSize: size,
    promotedPct: Math.round(((promoted / size) * 100)),
    avgMonthsToPromotion: Math.round(avgMonths * 10) / 10,
  };
}



