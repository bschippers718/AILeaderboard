import { NextResponse } from "next/server";
import {
  RESEARCHERS,
  RECENT_MOVES,
  computeInfluence,
  computeHeat,
  computeTenureMonths,
  getCompanyStats,
} from "@/lib/researchers";

export async function GET() {
  const enriched = RESEARCHERS.map((r) => ({
    ...r,
    influence: computeInfluence(r),
    heat: computeHeat(r),
    tenureMonths: computeTenureMonths(r.joined),
  })).sort((a, b) => b.influence - a.influence);

  return NextResponse.json({
    researchers: enriched,
    recentMoves: RECENT_MOVES,
    companyStats: getCompanyStats(RESEARCHERS),
    total: RESEARCHERS.length,
  });
}
