import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

export async function GET() {
  const okrs = await prisma.oKR.findMany({ include: { owner: true } });
  return NextResponse.json(okrs);
}


