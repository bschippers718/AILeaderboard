"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  RESEARCHERS,
  RECENT_MOVES,
  COMPANY_COLORS,
  COMPANY_FILTER_LIST,
  computeTenureMonths,
  computeHeat,
  computeInfluence,
  formatTenure,
  getCompanyStats,
  type Researcher,
  type Tier,
} from "@/lib/researchers";

// ─── Sort options ──────────────────────────────────────────

type SortKey = "influence" | "hIndex" | "citations" | "tenure" | "heat";

function sortResearchers(list: Researcher[], key: SortKey): Researcher[] {
  const copy = [...list];
  switch (key) {
    case "influence":
      return copy.sort((a, b) => computeInfluence(b) - computeInfluence(a));
    case "hIndex":
      return copy.sort((a, b) => b.hIndex - a.hIndex);
    case "citations":
      return copy.sort((a, b) => b.citations - a.citations);
    case "tenure":
      return copy.sort(
        (a, b) => computeTenureMonths(b.joined) - computeTenureMonths(a.joined),
      );
    case "heat":
      return copy.sort((a, b) => computeHeat(b) - computeHeat(a));
    default:
      return copy;
  }
}

// ─── Sub-components ────────────────────────────────────────

function CompanyBadge({ company }: { company: string }) {
  const color = COMPANY_COLORS[company] || "#888";
  return (
    <span
      className="company-badge"
      style={{
        borderColor: `${color}33`,
        color,
        background: `${color}0F`,
      }}
    >
      {company}
    </span>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className={`tier-badge ${tier.toLowerCase()}`}>{tier}</span>
  );
}

function HeatBar({ heat }: { heat: number }) {
  return (
    <div className="heat-indicator" title={`Transfer heat: ${heat}/5`}>
      {[1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          className={`heat-dot ${level <= heat ? `active-${level}` : ""}`}
        />
      ))}
    </div>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ScholarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
    </svg>
  );
}

function formatCitations(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toString();
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

// ─── Main Page ─────────────────────────────────────────────

export default function RosterPage() {
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("influence");
  const [showCount, setShowCount] = useState(50);

  const filtered = useMemo(() => {
    if (companyFilter === "all") return RESEARCHERS;
    return RESEARCHERS.filter((r) => r.company === companyFilter);
  }, [companyFilter]);

  const sorted = useMemo(
    () => sortResearchers(filtered, sortKey),
    [filtered, sortKey],
  );

  const displayed = sorted.slice(0, showCount);

  const companyStats = useMemo(
    () => getCompanyStats(RESEARCHERS).slice(0, 10),
    [],
  );

  const uniqueCompanies = useMemo(
    () => new Set(RESEARCHERS.map((r) => r.company)).size,
    [],
  );

  const recentMovesCount = RECENT_MOVES.length;

  const tierCounts = useMemo(() => {
    const counts: Record<Tier, number> = { S: 0, A: 0, B: 0, C: 0 };
    for (const r of RESEARCHERS) counts[r.tier]++;
    return counts;
  }, []);

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
            <Link
              href="/"
              className="text-ghost hover:text-bright transition-colors"
            >
              Experiments
            </Link>
            <span className="text-ember font-semibold">Roster</span>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {[350, 550, 750, 1000].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                borderColor: `rgba(255, 181, 71, ${0.04 - i * 0.007})`,
              }}
              animate={{
                opacity: [0.3, 0.65, 0.3],
                scale: [1, 1.015, 1],
              }}
              transition={{
                duration: 6 + i * 1.5,
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
            ml talent intelligence
          </div>
          <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-black leading-[0.85] tracking-tight mb-6 text-bright">
            THE <span className="text-ember glow-ember">ROSTER</span>
          </h1>
          <p className="text-dim text-base max-w-lg mx-auto mb-10 leading-relaxed">
            The most valuable minds in AI. Who they work for, what they&apos;ve
            built, and when they might move next.
          </p>

          <div className="flex gap-4 justify-center">
            <a
              href="#leaderboard"
              className="px-7 py-3 bg-ember text-void font-bold text-xs tracking-[0.15em] hover:opacity-90 transition-opacity"
            >
              VIEW RANKINGS
            </a>
            <a
              href="#companies"
              className="px-7 py-3 border border-edge text-dim hover:text-bright hover:border-ember transition-colors text-xs tracking-[0.15em]"
            >
              COMPANY POWER
            </a>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-void pointer-events-none z-10" />
      </section>

      {/* ═══ STATS ═══ */}
      <section className="border-y border-line relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 divide-x divide-line">
          <StatBox label="ON THE ROSTER">
            <span className="text-ember">{RESEARCHERS.length}</span>
          </StatBox>
          <StatBox label="COMPANIES">{uniqueCompanies}</StatBox>
          <StatBox label="RECENT MOVES">
            <span className="text-blaze">{recentMovesCount}</span>
          </StatBox>
          <StatBox label="S-TIER LEGENDS">{tierCounts.S}</StatBox>
          <StatBox label="A-TIER LEADERS">{tierCounts.A}</StatBox>
        </div>
      </section>

      {/* ═══ TRANSFER TICKER ═══ */}
      <section className="border-b border-line relative z-10 overflow-hidden bg-base/40">
        <div className="py-3 px-6">
          <div className="flex items-center gap-4">
            <span className="text-ember text-[10px] tracking-[0.2em] font-bold uppercase shrink-0">
              TRANSFERS
            </span>
            <div className="overflow-hidden flex-1">
              <div className="ticker-track">
                {[...RECENT_MOVES, ...RECENT_MOVES].map((move, i) => (
                  <span
                    key={i}
                    className="text-dim text-[11px] flex items-center gap-2"
                  >
                    <span className="text-bright font-medium">{move.name}</span>
                    <span className="text-ghost">
                      {move.from}
                    </span>
                    <span className="text-ember">→</span>
                    <span className="text-ghost">
                      {move.to}
                    </span>
                    <span className="text-ghost/50 text-[10px]">
                      {move.date}
                    </span>
                    {i < RECENT_MOVES.length * 2 - 1 && (
                      <span className="text-line mx-2">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LEADERBOARD ═══ */}
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
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-2">
                RANKINGS
              </h2>
              <p className="text-dim text-sm">
                Sorted by{" "}
                <span className="text-ghost">{sortKey}</span>
                {companyFilter !== "all" && (
                  <>
                    {" "}
                    · filtered to{" "}
                    <span className="text-ghost">{companyFilter}</span>
                  </>
                )}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setCompanyFilter("all")}
                  className={`px-3 py-1.5 text-[10px] tracking-wider transition-all cursor-pointer ${
                    companyFilter === "all"
                      ? "bg-ember text-void font-bold"
                      : "bg-raised text-dim hover:text-bright border border-line"
                  }`}
                >
                  ALL
                </button>
                {COMPANY_FILTER_LIST.map((company) => (
                  <button
                    key={company}
                    onClick={() => setCompanyFilter(company)}
                    className={`px-3 py-1.5 text-[10px] tracking-wider transition-all cursor-pointer ${
                      companyFilter === company
                        ? "bg-ember text-void font-bold"
                        : "bg-raised text-dim hover:text-bright border border-line"
                    }`}
                  >
                    {company === "Google DeepMind"
                      ? "DEEPMIND"
                      : company.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5">
                {(
                  [
                    "influence",
                    "hIndex",
                    "citations",
                    "tenure",
                    "heat",
                  ] as SortKey[]
                ).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSortKey(key)}
                    className={`px-3 py-1.5 text-[10px] tracking-wider transition-all cursor-pointer ${
                      sortKey === key
                        ? "bg-bright text-void font-bold"
                        : "bg-raised text-ghost hover:text-bright border border-line"
                    }`}
                  >
                    {key === "hIndex" ? "h-INDEX" : key.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-line overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header */}
              <div className="grid grid-cols-[44px_1fr_130px_130px_60px_70px_36px_52px_76px] gap-3 px-5 py-3 bg-raised text-ghost text-[10px] tracking-[0.15em] uppercase border-b border-line">
                <span>#</span>
                <span>Researcher</span>
                <span>Company</span>
                <span>Previous</span>
                <span>h-idx</span>
                <span>Citations</span>
                <span>Tier</span>
                <span>Heat</span>
                <span>Links</span>
              </div>

              {/* Rows */}
              {displayed.map((r, i) => {
                const heat = computeHeat(r);
                const tenure = computeTenureMonths(r.joined);
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.02, 0.5), duration: 0.3 }}
                    className={`grid grid-cols-[44px_1fr_130px_130px_60px_70px_36px_52px_76px] gap-3 px-5 py-3.5 items-center border-b border-line/30 hover:bg-hover transition-colors group ${
                      i === 0 ? "box-glow-ember bg-raised/40" : ""
                    }`}
                  >
                    {/* Rank */}
                    <div
                      className={`rank-badge ${
                        i === 0
                          ? "first"
                          : i === 1
                            ? "second"
                            : i === 2
                              ? "third"
                              : "rest"
                      }`}
                    >
                      {i + 1}
                    </div>

                    {/* Name + Role */}
                    <div className="min-w-0">
                      <div className="text-bright text-sm font-semibold truncate">
                        {r.name}
                      </div>
                      <div className="text-ghost text-[11px] truncate">
                        {r.role}
                      </div>
                    </div>

                    {/* Company + Tenure */}
                    <div className="min-w-0">
                      <CompanyBadge company={r.company} />
                      <div className="text-ghost text-[10px] mt-1">
                        {formatTenure(tenure)}
                      </div>
                    </div>

                    {/* Previous */}
                    <div className="min-w-0">
                      <div className="text-dim text-[12px] truncate">
                        {r.prevCompany}
                      </div>
                      <div className="text-ghost text-[10px]">
                        {r.prevTenure > 0 ? formatTenure(r.prevTenure) : "—"}
                      </div>
                    </div>

                    {/* h-index */}
                    <div className="tabular text-dim text-sm">
                      {r.hIndex > 0 ? r.hIndex : "—"}
                    </div>

                    {/* Citations */}
                    <div className="tabular text-dim text-sm">
                      {r.citations > 0 ? formatCitations(r.citations) : "—"}
                    </div>

                    {/* Tier */}
                    <TierBadge tier={r.tier} />

                    {/* Heat */}
                    <HeatBar heat={heat} />

                    {/* Social links */}
                    <div className="flex items-center gap-1">
                      {r.twitter && (
                        <a
                          href={`https://x.com/${r.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          title={`@${r.twitter}`}
                        >
                          <XIcon />
                        </a>
                      )}
                      {r.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${r.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          title="LinkedIn"
                        >
                          <LinkedInIcon />
                        </a>
                      )}
                      {r.scholar && (
                        <a
                          href={`https://scholar.google.com/citations?user=${r.scholar}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          title="Google Scholar"
                        >
                          <ScholarIcon />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Show more */}
          {showCount < sorted.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowCount((c) => c + 50)}
                className="px-8 py-3 border border-edge text-dim hover:text-ember hover:border-ember transition-colors text-xs tracking-[0.15em] cursor-pointer"
              >
                SHOW MORE ({sorted.length - showCount} remaining)
              </button>
            </div>
          )}
        </motion.div>
      </section>

      {/* ═══ NOTABLE WORK HIGHLIGHTS ═══ */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-2">
            NOTABLE WORKS
          </h2>
          <p className="text-dim text-sm mb-8">
            Breakthrough papers and projects from the roster.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RESEARCHERS.filter((r) => r.tier === "S")
              .slice(0, 9)
              .map((r) => (
                <div
                  key={r.id}
                  className="border border-line bg-base/60 p-5 hover:border-ember/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-bright text-sm font-semibold">
                        {r.name}
                      </div>
                      <div className="text-ghost text-[11px]">{r.company}</div>
                    </div>
                    <TierBadge tier={r.tier} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.notable.map((work) => (
                      <span
                        key={work}
                        className="text-[10px] px-2 py-0.5 bg-raised border border-line text-dim rounded"
                      >
                        {work}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ COMPANY POWER RANKINGS ═══ */}
      <section
        id="companies"
        className="max-w-7xl mx-auto px-6 py-20 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-2">
            COMPANY POWER
          </h2>
          <p className="text-dim text-sm mb-10">
            Who&apos;s winning the talent war.{" "}
            <span className="text-ghost">
              Based on roster count, research output, and net talent flow.
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {companyStats.map((co, i) => {
              const color = COMPANY_COLORS[co.name] || "#888";
              return (
                <motion.div
                  key={co.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="border border-line bg-base/60 p-5 hover:bg-hover transition-colors relative overflow-hidden group"
                >
                  <div
                    className="absolute top-0 left-0 w-full h-[2px]"
                    style={{ background: color }}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div
                        className="text-sm font-bold"
                        style={{ color }}
                      >
                        {co.name}
                      </div>
                      <div className="text-ghost text-[10px] tracking-wider mt-0.5">
                        #{i + 1} POWER RANK
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-bright text-lg font-bold tabular">
                        {co.count}
                      </div>
                      <div className="text-ghost text-[10px]">on roster</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-dim text-sm tabular font-medium">
                        {co.avgHIndex}
                      </div>
                      <div className="text-ghost text-[9px] tracking-wider uppercase">
                        avg h
                      </div>
                    </div>
                    <div>
                      <div className="text-dim text-sm tabular font-medium">
                        {formatCitations(co.totalCitations)}
                      </div>
                      <div className="text-ghost text-[9px] tracking-wider uppercase">
                        total cit
                      </div>
                    </div>
                    <div>
                      <div
                        className={`text-sm tabular font-bold ${
                          co.netFlow > 0
                            ? "text-neon"
                            : co.netFlow < 0
                              ? "text-blaze"
                              : "text-dim"
                        }`}
                      >
                        {co.netFlow > 0 ? `+${co.netFlow}` : co.netFlow}
                      </div>
                      <div className="text-ghost text-[9px] tracking-wider uppercase">
                        net flow
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-line py-10 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-ghost text-xs">
            built for the silicon minds ·{" "}
            <Link
              href="/"
              className="text-dim hover:text-neon transition-colors"
            >
              THE HIVE
            </Link>{" "}
            ·{" "}
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
            data from public sources · arXiv · Google Scholar · press coverage
          </div>
        </div>
      </footer>
    </main>
  );
}
