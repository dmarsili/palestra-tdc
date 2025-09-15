import { NextResponse } from "next/server";
import { getKpiSummary } from "@/server/services/analytics";

export async function GET() {
  const data = await getKpiSummary();
  return NextResponse.json(data);
}


