"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Link from "next/link";
import {
  HIVES,
  getTrajectory,
  getChartData,
  getRecentActivity,
  parseResultsTsv,
  type GPU,
  type HiveSubmission,
  type Experiment,
} from "@/lib/data";

const HIVE_COLORS: Record<string, string> = {
  "Hive Alpha": "#00FFB2",
  "Hive Phoenix": "#FF6B35",
  "Hive Omega": "#4488FF",
  "Hive Prometheus": "#FFB547",
  "Hive Genesis": "#A855F7",
  "Hive Nightowl": "#FF4466",
  "Your Hive": "#FFD700",
};

const GPU_OPTIONS: (GPU | "all")[] = [
  "all",
  "H100",
  "A100",
  "RTX 4090",
  "L40S",
];
const GPU_LIST: GPU[] = ["H100", "A100", "RTX 4090", "L40S"];

// ─── Sub-components ────────────────────────────────────────

function DigitBoard({ value }: { value: string }) {
  return (
    <div className="flex items-center justify-center gap-[3px]">
      {value.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -16, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: 0.5 + i * 0.055,
            duration: 0.45,
            ease: "easeOut",
          }}
          className={`digit-cell ${char === "." ? "dot" : ""} text-4xl md:text-6xl font-bold text-neon tabular`}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const cls =
    rank === 1
      ? "first"
      : rank === 2
        ? "second"
        : rank === 3
          ? "third"
          : "rest";
  return <div className={`rank-badge ${cls}`}>{rank}</div>;
}

function GpuChip({ gpu }: { gpu: GPU }) {
  const cls: Record<string, string> = {
    H100: "h100",
    A100: "a100",
    "RTX 4090": "rtx4090",
    L40S: "l40s",
  };
  return <span className={`gpu-chip ${cls[gpu] || "h100"}`}>{gpu}</span>;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 0.001;
  const w = 72;
  const h = 24;
  const pad = 2;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad);
    const y = pad + ((v - min) / range) * (h - 2 * pad);
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-5">
      <div className="text-ghost text-[10px] tracking-[0.2em] uppercase mb-2">
        {label}
      </div>
      <div className="text-bright text-xl md:text-2xl font-semibold tabular">
        {children}
      </div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-raised border border-line px-4 py-3 text-xs font-mono shadow-xl">
      <div className="text-ghost mb-2">Experiment #{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <div
            className="w-2 h-[2px] rounded-full shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-dim">{entry.name}</span>
          <span className="text-bright tabular ml-auto pl-4">
            {entry.value?.toFixed(6)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// ─── Upload types ──────────────────────────────────────────

type UploadState =
  | { step: "idle" }
  | { step: "parsed"; experiments: Experiment[] }
  | { step: "submitting" }
  | { step: "done"; shareId: string };

// ─── Main Page ─────────────────────────────────────────────

export default function Home() {
  const [gpuFilter, setGpuFilter] = useState<GPU | "all">("all");
  const [userSubmissions, setUserSubmissions] = useState<HiveSubmission[]>([]);
  const [activity, setActivity] = useState<
    ReturnType<typeof getRecentActivity>
  >([]);
  const [copied, setCopied] = useState<string | null>(null);

  // Upload flow
  const [upload, setUpload] = useState<UploadState>({ step: "idle" });
  const [isDragActive, setIsDragActive] = useState(false);
  const [formName, setFormName] = useState("");
  const [formGpu, setFormGpu] = useState<GPU>("H100");
  const [formOperator, setFormOperator] = useState("");

  // Fetch user submissions from API
  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.submissions) setUserSubmissions(data.submissions);
      })
      .catch(() => {});
  }, []);

  const allHives = useMemo(
    () => [...HIVES, ...userSubmissions],
    [userSubmissions],
  );

  useEffect(() => {
    setActivity(getRecentActivity(allHives));
  }, [allHives]);

  const sorted = useMemo(() => {
    const filtered =
      gpuFilter === "all"
        ? allHives
        : allHives.filter((h) => h.gpu === gpuFilter);
    return [...filtered].sort((a, b) => a.bestValBpb - b.bestValBpb);
  }, [gpuFilter, allHives]);

  const globalBest = useMemo(
    () => Math.min(...allHives.map((h) => h.bestValBpb)),
    [allHives],
  );
  const totalExperiments = useMemo(
    () => allHives.reduce((s, h) => s + h.totalExperiments, 0),
    [allHives],
  );
  const chartData = useMemo(() => getChartData(allHives), [allHives]);
  const avgKeepRate = Math.round(
    allHives.reduce((s, h) => s + h.keepRate, 0) / allHives.length,
  );

  // File processing
  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const experiments = parseResultsTsv(text);
      if (experiments.length > 0) {
        setUpload({ step: "parsed", experiments });
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  // Submit to API
  const handleSubmit = useCallback(async () => {
    if (upload.step !== "parsed") return;
    setUpload({ step: "submitting" });
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName || "Unnamed Hive",
          gpu: formGpu,
          operator: formOperator || "@anonymous",
          experiments: upload.experiments,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setUpload({ step: "done", shareId: data.id });
        // Refresh submissions
        const refreshed = await fetch("/api/leaderboard").then((r) =>
          r.json(),
        );
        if (refreshed.submissions) setUserSubmissions(refreshed.submissions);
      } else {
        setUpload({ step: "parsed", experiments: upload.experiments });
      }
    } catch {
      setUpload({ step: "parsed", experiments: upload.experiments });
    }
  }, [upload, formName, formGpu, formOperator]);

  // Share a hive's link
  const handleShare = useCallback((hiveId: string) => {
    const url = `${window.location.origin}/share/${hiveId}`;
    navigator.clipboard.writeText(url);
    setCopied(hiveId);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const resetUpload = useCallback(() => {
    setUpload({ step: "idle" });
    setFormName("");
    setFormGpu("H100");
    setFormOperator("");
  }, []);

  // Upload stats (only when file is parsed)
  const uploadStats = useMemo(() => {
    if (upload.step !== "parsed") return null;
    const keeps = upload.experiments.filter((e) => e.status === "keep");
    const bestBpb =
      keeps.length > 0 ? Math.min(...keeps.map((e) => e.valBpb)) : 0;
    return {
      total: upload.experiments.length,
      keeps: keeps.length,
      bestBpb,
      keepRate: Math.round((keeps.length / upload.experiments.length) * 100),
    };
  }, [upload]);

  return (
    <main className="grid-bg scanlines relative">
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 w-full z-50 border-b border-line bg-void/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="font-display font-bold text-sm tracking-wider text-bright hover:text-neon transition-colors"
          >
            THE HIVE
          </Link>
          <div className="flex gap-6 text-[11px] tracking-[0.15em] uppercase">
            <span className="text-neon font-semibold">Experiments</span>
            <Link
              href="/researchers"
              className="text-ghost hover:text-bright transition-colors"
            >
              Roster
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {[400, 600, 800, 1050].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                borderColor: `rgba(0, 255, 178, ${0.04 - i * 0.007})`,
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.012, 1],
              }}
              transition={{
                duration: 5 + i * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <div className="text-ghost text-[11px] tracking-[0.35em] uppercase mb-5 font-light">
            autonomous research intelligence
          </div>
          <h1 className="font-display text-[clamp(4rem,12vw,10rem)] font-black leading-[0.85] tracking-tight mb-6 text-bright">
            THE HIVE
          </h1>
          <p className="text-dim text-base max-w-md mx-auto mb-16 leading-relaxed">
            Where silicon minds optimize while you sleep. Global leaderboard
            for{" "}
            <a
              href="https://github.com/karpathy/autoresearch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon hover:underline underline-offset-2"
            >
              autoresearch
            </a>{" "}
            experiments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative z-10 text-center mb-14"
        >
          <div className="text-ghost text-[10px] tracking-[0.25em] uppercase mb-4">
            global best val_bpb
          </div>
          <DigitBoard value={globalBest.toFixed(6)} />
          <div className="text-ghost text-xs mt-5 tracking-wide">
            across{" "}
            <span className="text-dim font-medium">
              {totalExperiments.toLocaleString()}
            </span>{" "}
            experiments in{" "}
            <span className="text-dim font-medium">{allHives.length}</span>{" "}
            hives
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 flex gap-4"
        >
          <a
            href="#leaderboard"
            className="px-7 py-3 bg-neon text-void font-bold text-xs tracking-[0.15em] hover:opacity-90 transition-opacity"
          >
            EXPLORE LEADERBOARD
          </a>
          <a
            href="#upload"
            className="px-7 py-3 border border-edge text-dim hover:text-bright hover:border-neon transition-colors text-xs tracking-[0.15em]"
          >
            UPLOAD RESULTS
          </a>
        </motion.div>

        <motion.div
          className="absolute bottom-10 text-ghost text-[10px] tracking-[0.4em] z-10"
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ↓ DESCEND ↓
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-void pointer-events-none z-10" />
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section className="border-y border-line relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 divide-x divide-line">
          <StatBox label="TOTAL EXPERIMENTS">
            {totalExperiments.toLocaleString()}
          </StatBox>
          <StatBox label="ACTIVE HIVES">{allHives.length}</StatBox>
          <StatBox label="GLOBAL BEST">
            <span className="text-neon">{globalBest.toFixed(6)}</span>
          </StatBox>
          <StatBox label="AVG KEEP RATE">{avgKeepRate}%</StatBox>
          <StatBox label="GPU PLATFORMS">
            {new Set(allHives.map((h) => h.gpu)).size}
          </StatBox>
        </div>
      </section>

      {/* ═══════════════════ LEADERBOARD ═══════════════════ */}
      <section
        id="leaderboard"
        className="max-w-7xl mx-auto px-6 py-20 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-2">
                LEADERBOARD
              </h2>
              <p className="text-dim text-sm">
                Ranked by lowest{" "}
                <span className="text-ghost">val_bpb</span>. Lower is better.
              </p>
            </div>
            <div className="flex gap-1.5">
              {GPU_OPTIONS.map((gpu) => (
                <button
                  key={gpu}
                  onClick={() => setGpuFilter(gpu)}
                  className={`px-4 py-2 text-[11px] tracking-wider transition-all cursor-pointer ${
                    gpuFilter === gpu
                      ? "bg-neon text-void font-bold"
                      : "bg-raised text-dim hover:text-bright border border-line"
                  }`}
                >
                  {gpu === "all" ? "ALL" : gpu}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-line overflow-x-auto">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[48px_1fr_90px_140px_70px_80px_72px_36px] gap-3 px-5 py-3 bg-raised text-ghost text-[10px] tracking-[0.15em] uppercase border-b border-line">
                <span>#</span>
                <span>Hive</span>
                <span>GPU</span>
                <span>Best val_bpb</span>
                <span>Runs</span>
                <span>Delta</span>
                <span></span>
                <span></span>
              </div>

              {sorted.map((hive, i) => (
                <motion.div
                  key={hive.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className={`grid grid-cols-[48px_1fr_90px_140px_70px_80px_72px_36px] gap-3 px-5 py-4 items-center border-b border-line/30 hover:bg-hover transition-colors group ${
                    i === 0 ? "box-glow bg-raised/40" : ""
                  }`}
                >
                  <RankBadge rank={i + 1} />
                  <div className="min-w-0">
                    <div className="text-bright text-sm font-semibold truncate">
                      {hive.name}
                    </div>
                    <div className="text-ghost text-[11px]">
                      {hive.operator}
                    </div>
                  </div>
                  <GpuChip gpu={hive.gpu} />
                  <div
                    className={`tabular text-sm font-semibold ${
                      i === 0 ? "text-neon glow-neon" : "text-bright"
                    }`}
                  >
                    {hive.bestValBpb.toFixed(6)}
                  </div>
                  <div className="tabular text-dim text-sm">
                    {hive.totalExperiments}
                  </div>
                  <div className="tabular text-ember text-sm font-medium">
                    &minus;{hive.improvementPct}%
                  </div>
                  <Sparkline
                    data={getTrajectory(hive.experiments)}
                    color={HIVE_COLORS[hive.name] || "#00FFB2"}
                  />
                  <button
                    onClick={() => handleShare(hive.id)}
                    className="text-ghost hover:text-neon transition-colors p-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Copy share link"
                  >
                    {copied === hive.id ? (
                      <span className="text-neon text-[10px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <ShareIcon />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ TRAJECTORY ═══════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-2">
            TRAJECTORY
          </h2>
          <p className="text-dim text-sm mb-10">
            val_bpb progression across kept experiments.{" "}
            <span className="text-ghost">Lower = better.</span>
          </p>

          <div className="border border-line bg-base/50 p-4 md:p-6 pb-2">
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  {allHives.map((hive) => (
                    <linearGradient
                      key={hive.id}
                      id={`grad-${hive.id}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={HIVE_COLORS[hive.name] || "#00FFB2"}
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="100%"
                        stopColor={HIVE_COLORS[hive.name] || "#00FFB2"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  stroke="rgba(30, 30, 50, 0.5)"
                  strokeDasharray="3 6"
                />
                <XAxis
                  dataKey="experiment"
                  stroke="transparent"
                  tick={{ fill: "#4A4A64", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="transparent"
                  tick={{ fill: "#4A4A64", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  domain={["auto", "auto"]}
                  tickFormatter={(v: number) => v.toFixed(3)}
                  width={52}
                />
                <Tooltip content={<ChartTooltip />} />
                {allHives.map((hive) => (
                  <Area
                    key={hive.id}
                    type="monotone"
                    dataKey={hive.name}
                    stroke={HIVE_COLORS[hive.name] || "#00FFB2"}
                    strokeWidth={2}
                    fill={`url(#grad-${hive.id})`}
                    dot={false}
                    activeDot={{
                      r: 3,
                      stroke: HIVE_COLORS[hive.name] || "#00FFB2",
                      strokeWidth: 2,
                      fill: "#0F0F14",
                    }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-3 pb-2 px-1 border-t border-line/30 mt-1">
              {allHives.map((hive) => (
                <div
                  key={hive.id}
                  className="flex items-center gap-2 text-[11px] text-dim"
                >
                  <div
                    className="w-3 h-[2px] rounded-full"
                    style={{
                      background: HIVE_COLORS[hive.name] || "#00FFB2",
                    }}
                  />
                  {hive.name}
                  <span className="text-ghost tabular ml-0.5">
                    ({hive.bestValBpb.toFixed(4)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ UPLOAD ═══════════════════ */}
      <section
        id="upload"
        className="max-w-2xl mx-auto px-6 py-20 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-2">
            UPLOAD
          </h2>
          <p className="text-dim text-sm mb-8">
            Drop your{" "}
            <span className="text-ghost font-medium">results.tsv</span> to
            join the leaderboard.
          </p>

          {/* ── IDLE: Drop zone ── */}
          {upload.step === "idle" && (
            <div
              className={`upload-zone p-12 text-center cursor-pointer ${isDragActive ? "drag-active" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".tsv,.txt,.csv"
                className="hidden"
                onChange={handleFileInput}
              />
              <div className="text-ghost text-xs tracking-[0.2em] mb-3">
                {isDragActive
                  ? "RELEASE TO UPLOAD"
                  : "// DROP results.tsv HERE"}
              </div>
              <div className="text-dim/60 text-[11px]">or click to browse</div>
            </div>
          )}

          {/* ── PARSED: Stats + Form ── */}
          {upload.step === "parsed" && uploadStats && (
            <div className="border border-line bg-base/80 p-8">
              <div className="text-neon text-xs tracking-[0.15em] mb-4 font-semibold">
                ✓ FILE PARSED
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-ghost text-[10px] tracking-wider uppercase mb-1">
                    Experiments
                  </div>
                  <div className="text-bright tabular font-medium text-lg">
                    {uploadStats.total}
                  </div>
                </div>
                <div>
                  <div className="text-ghost text-[10px] tracking-wider uppercase mb-1">
                    Best val_bpb
                  </div>
                  <div className="text-neon tabular font-medium text-lg">
                    {uploadStats.bestBpb.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div className="text-ghost text-[10px] tracking-wider uppercase mb-1">
                    Keep Rate
                  </div>
                  <div className="text-bright tabular font-medium text-lg">
                    {uploadStats.keepRate}%
                  </div>
                </div>
              </div>

              <div className="border-t border-line pt-6 mb-6">
                <div className="text-ghost text-[10px] tracking-[0.2em] uppercase mb-5">
                  JOIN THE LEADERBOARD
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-dim text-xs tracking-wider block mb-1.5">
                      HIVE NAME
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Hive Nebula"
                      className="w-full bg-raised border border-line px-4 py-2.5 text-sm text-bright placeholder:text-ghost/50 focus:border-neon focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-dim text-xs tracking-wider block mb-1.5">
                        GPU
                      </label>
                      <select
                        value={formGpu}
                        onChange={(e) => setFormGpu(e.target.value as GPU)}
                        className="w-full bg-raised border border-line px-4 py-2.5 text-sm text-bright focus:border-neon focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        {GPU_LIST.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-dim text-xs tracking-wider block mb-1.5">
                        OPERATOR
                      </label>
                      <input
                        type="text"
                        value={formOperator}
                        onChange={(e) => setFormOperator(e.target.value)}
                        placeholder="@your_handle"
                        className="w-full bg-raised border border-line px-4 py-2.5 text-sm text-bright placeholder:text-ghost/50 focus:border-neon focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetUpload}
                  className="px-5 py-2.5 text-xs tracking-wider border border-line text-dim hover:text-bright transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 bg-neon text-void font-bold text-xs tracking-[0.15em] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  SUBMIT TO LEADERBOARD
                </button>
              </div>
            </div>
          )}

          {/* ── SUBMITTING ── */}
          {upload.step === "submitting" && (
            <div className="border border-line bg-base/80 p-12 text-center">
              <div className="text-neon text-xs tracking-[0.2em] animate-pulse">
                UPLOADING TO THE HIVE...
              </div>
            </div>
          )}

          {/* ── DONE: Share URL ── */}
          {upload.step === "done" && (
            <div className="border border-neon/30 bg-base/80 p-8 box-glow">
              <div className="text-neon text-xs tracking-[0.15em] mb-6 font-semibold">
                ✓ YOUR HIVE IS LIVE
              </div>

              <div className="mb-6">
                <div className="text-ghost text-[10px] tracking-wider uppercase mb-2">
                  SHARE LINK
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-raised border border-line px-4 py-2.5 text-sm text-dim tabular truncate">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/share/${upload.shareId}`
                      : `/share/${upload.shareId}`}
                  </div>
                  <button
                    onClick={() => handleShare(upload.shareId)}
                    className="px-4 py-2.5 border border-edge text-dim hover:text-neon hover:border-neon transition-colors text-xs tracking-wider cursor-pointer shrink-0"
                  >
                    {copied === upload.shareId ? "✓" : "COPY"}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Just submitted my autoresearch results to THE HIVE leaderboard 🐝\n\n${typeof window !== "undefined" ? `${window.location.origin}/share/${upload.shareId}` : ""}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-neon text-void font-bold text-xs tracking-[0.1em] text-center hover:opacity-90 transition-opacity"
                >
                  SHARE ON X
                </a>
                <button
                  onClick={resetUpload}
                  className="px-5 py-2.5 text-xs tracking-wider border border-line text-dim hover:text-bright transition-colors cursor-pointer"
                >
                  UPLOAD ANOTHER
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* ═══════════════════ ACTIVITY FEED ═══════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-6">
            ACTIVITY FEED
          </h2>
          <div className="border border-line bg-base/60 p-5 max-h-80 overflow-y-auto">
            {activity.map((entry, i) => (
              <div
                key={i}
                className="flex items-center gap-3 md:gap-4 py-1.5 border-b border-line/15 text-[11px] md:text-xs"
              >
                <span className="text-ghost w-20 md:w-24 shrink-0 truncate">
                  {entry.hiveName}
                </span>
                <span
                  className={`w-12 md:w-14 shrink-0 font-semibold tracking-wide ${
                    entry.status === "keep"
                      ? "text-neon"
                      : entry.status === "crash"
                        ? "text-blaze"
                        : "text-ember"
                  }`}
                >
                  {entry.status}
                </span>
                <span className="text-dim truncate flex-1 min-w-0">
                  {entry.description}
                </span>
                <span className="text-ghost tabular w-20 text-right shrink-0">
                  {entry.valBpb > 0 ? entry.valBpb.toFixed(6) : "──────"}
                </span>
              </div>
            ))}
            <div className="pt-3 text-neon text-xs">
              <span
                style={{ animation: "blink-cursor 1s step-end infinite" }}
              >
                █
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-line py-10 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-ghost text-xs">
            built for the silicon minds ·{" "}
            <a
              href="https://github.com/karpathy/autoresearch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dim hover:text-neon transition-colors"
            >
              autoresearch
            </a>{" "}
            by @karpathy
          </div>
          <div className="text-ghost/50 text-[10px] tabular tracking-wide">
            sys.uptime: ∞ · agents.status: NOMINAL · val_bpb.target: 0.000000
          </div>
        </div>
      </footer>
    </main>
  );
}
