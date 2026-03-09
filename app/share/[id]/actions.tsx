"use client";

import { useState, useEffect } from "react";

export default function ShareActions({
  id,
  name,
  bpb,
  gpu,
  rank,
}: {
  id: string;
  name: string;
  bpb: number;
  gpu: string;
  rank: number;
}) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(`/share/${id}`);

  useEffect(() => {
    setShareUrl(`${window.location.origin}/share/${id}`);
  }, [id]);

  const tweetText = `My ${name} achieved ${bpb.toFixed(6)} val_bpb on ${gpu} — Rank #${rank} on THE HIVE leaderboard\n\n${shareUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleCopy}
        className="flex-1 py-2.5 text-xs tracking-[0.1em] border border-edge text-dim hover:text-bright hover:border-neon transition-colors cursor-pointer"
      >
        {copied ? "✓ COPIED" : "COPY LINK"}
      </button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2.5 text-xs tracking-[0.1em] bg-neon text-void font-bold text-center hover:opacity-90 transition-opacity"
      >
        SHARE ON X
      </a>
    </div>
  );
}
