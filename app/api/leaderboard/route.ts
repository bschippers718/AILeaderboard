import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSubmissions, addSubmission } from "@/lib/store";
import { HIVES, type ExperimentStatus } from "@/lib/data";

export async function GET() {
  const userSubmissions = await getSubmissions();
  return NextResponse.json({
    featured: HIVES,
    submissions: userSubmissions,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.gpu || !body.experiments?.length) {
      return NextResponse.json(
        { error: "Missing required fields: name, gpu, experiments" },
        { status: 400 },
      );
    }

    const experiments = body.experiments;
    const keeps = experiments.filter(
      (e: { status: ExperimentStatus }) => e.status === "keep",
    );
    const crashes = experiments.filter(
      (e: { status: ExperimentStatus }) => e.status === "crash",
    );
    const bestBpb =
      keeps.length > 0
        ? Math.min(...keeps.map((e: { valBpb: number }) => e.valBpb))
        : 0;
    const baseline = experiments[0]?.valBpb || 1;

    const submission = {
      id: randomUUID(),
      name: body.name,
      gpu: body.gpu,
      operator: body.operator || "@anonymous",
      bestValBpb: bestBpb,
      totalExperiments: experiments.length,
      keepRate: Math.round((keeps.length / experiments.length) * 100),
      crashRate: Math.round((crashes.length / experiments.length) * 100),
      improvementPct: parseFloat(
        (((baseline - bestBpb) / baseline) * 100).toFixed(2),
      ),
      experiments,
    };

    await addSubmission(submission);

    return NextResponse.json({
      id: submission.id,
      shareUrl: `/share/${submission.id}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 },
    );
  }
}
