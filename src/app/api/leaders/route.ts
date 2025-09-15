import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company") ?? undefined;
  const track = searchParams.get("track") ?? undefined;
  const promoted = searchParams.get("promoted") ?? undefined;
  const where: any = {};
  if (company) where.company = company;
  if (track) where.track = track;
  if (promoted !== undefined) where.promoted = promoted === "true";
  const data = await prisma.leader.findMany({ where });
  return NextResponse.json(data);
}


