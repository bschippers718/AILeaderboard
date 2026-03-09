import { Metadata } from "next";
import Link from "next/link";
import { HIVES, type HiveSubmission } from "@/lib/data";
import { getSubmissions, getSubmissionById } from "@/lib/store";
import { notFound } from "next/navigation";
import ShareActions from "./actions";

async function findHive(id: string): Promise<HiveSubmission | null> {
  const featured = HIVES.find((h) => h.id === id);
  if (featured) return featured;
  return getSubmissionById(id);
}

async function getRank(hive: HiveSubmission): Promise<number> {
  const userSubs = await getSubmissions();
  const all = [...HIVES, ...userSubs];
  const sorted = [...all].sort((a, b) => a.bestValBpb - b.bestValBpb);
  const idx = sorted.findIndex((h) => h.id === hive.id);
  return idx >= 0 ? idx + 1 : all.length;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const hive = await findHive(id);
  if (!hive) return { title: "THE HIVE" };

  const rank = await getRank(hive);
  const ogParams = new URLSearchParams({
    name: hive.name,
    rank: String(rank),
    bpb: hive.bestValBpb.toFixed(6),
    gpu: hive.gpu,
    delta: String(hive.improvementPct),
  });
  const ogUrl = `/api/og?${ogParams}`;

  return {
    title: `${hive.name} — Rank #${rank} | THE HIVE`,
    description: `${hive.bestValBpb.toFixed(6)} val_bpb on ${hive.gpu} · −${hive.improvementPct}% from baseline`,
    openGraph: {
      title: `${hive.name} — Rank #${rank} | THE HIVE`,
      description: `${hive.bestValBpb.toFixed(6)} val_bpb on ${hive.gpu}`,
      images: [ogUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: `${hive.name} — Rank #${rank}`,
      description: `${hive.bestValBpb.toFixed(6)} val_bpb on ${hive.gpu}`,
      images: [ogUrl],
    },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hive = await findHive(id);
  if (!hive) notFound();

  const rank = await getRank(hive);

  const gpuClass: Record<string, string> = {
    H100: "h100",
    A100: "a100",
    "RTX 4090": "rtx4090",
    L40S: "l40s",
  };

  return (
    <main className="grid-bg scanlines min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg border border-line bg-base/80 p-8 md:p-10 relative">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neon/30" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-neon/30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-neon/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neon/30" />

        <div className="text-ghost text-[10px] tracking-[0.3em] uppercase mb-10 text-center">
          THE HIVE · AUTONOMOUS RESEARCH INTELLIGENCE
        </div>

        {/* Rank + Name */}
        <div className="flex items-center gap-4 mb-10">
          <div
            className={`rank-badge ${rank === 1 ? "first" : rank === 2 ? "second" : rank === 3 ? "third" : "rest"}`}
            style={{ width: 52, height: 52, fontSize: 20 }}
          >
            {rank}
          </div>
          <div>
            <div className="text-bright text-xl font-bold">{hive.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`gpu-chip ${gpuClass[hive.gpu] || "h100"}`}>
                {hive.gpu}
              </span>
              <span className="text-ghost text-xs">{hive.operator}</span>
            </div>
          </div>
        </div>

        {/* Big number */}
        <div className="text-center mb-10">
          <div className="text-neon text-5xl md:text-6xl font-bold tabular glow-neon mb-2">
            {hive.bestValBpb.toFixed(6)}
          </div>
          <div className="text-ghost text-[10px] tracking-[0.25em] uppercase">
            val_bpb
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 border-t border-line pt-6 mb-8">
          <div>
            <div className="text-ghost text-[10px] tracking-wider uppercase mb-1">
              Experiments
            </div>
            <div className="text-bright tabular font-semibold">
              {hive.totalExperiments}
            </div>
          </div>
          <div>
            <div className="text-ghost text-[10px] tracking-wider uppercase mb-1">
              Keep Rate
            </div>
            <div className="text-bright tabular font-semibold">
              {hive.keepRate}%
            </div>
          </div>
          <div>
            <div className="text-ghost text-[10px] tracking-wider uppercase mb-1">
              Improvement
            </div>
            <div className="text-ember tabular font-semibold">
              −{hive.improvementPct}%
            </div>
          </div>
        </div>

        {/* Actions */}
        <ShareActions
          id={hive.id}
          name={hive.name}
          bpb={hive.bestValBpb}
          gpu={hive.gpu}
          rank={rank}
        />
      </div>

      <Link
        href="/"
        className="mt-8 text-dim text-sm hover:text-neon transition-colors"
      >
        ← View Full Leaderboard
      </Link>
    </main>
  );
}
