import { NextResponse } from "next/server";
import { getLeaderById } from "@/application/services";
import { getLeaderParamsSchema } from "@/infrastructure/api/validators";

export function GET(_: Request, { params }: { params: { id: string } }) {
  const parsed = getLeaderParamsSchema.safeParse({ id: params.id });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const leader = getLeaderById(parsed.data.id);
  if (!leader) {
    return NextResponse.json({ error: "Leader não encontrado" }, { status: 404 });
  }
  return NextResponse.json(leader);
}


