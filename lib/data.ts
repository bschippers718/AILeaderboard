export type GPU = "H100" | "A100" | "RTX 4090" | "L40S";

export type ExperimentStatus = "keep" | "discard" | "crash";

export interface Experiment {
  step: number;
  commit: string;
  valBpb: number;
  memoryGb: number;
  status: ExperimentStatus;
  description: string;
}

export interface HiveSubmission {
  id: string;
  name: string;
  gpu: GPU;
  operator: string;
  bestValBpb: number;
  totalExperiments: number;
  keepRate: number;
  crashRate: number;
  improvementPct: number;
  experiments: Experiment[];
}

function c(): string {
  return Math.random().toString(16).slice(2, 9);
}

export const HIVES: HiveSubmission[] = [
  {
    id: "alpha",
    name: "Hive Alpha",
    gpu: "H100",
    operator: "@karpathy",
    bestValBpb: 0.962134,
    totalExperiments: 20,
    keepRate: 70,
    crashRate: 10,
    improvementPct: 3.59,
    experiments: [
      { step: 1, commit: c(), valBpb: 0.9979, memoryGb: 44.0, status: "keep", description: "baseline" },
      { step: 2, commit: c(), valBpb: 0.9932, memoryGb: 44.2, status: "keep", description: "increase LR 0.02 → 0.04" },
      { step: 3, commit: c(), valBpb: 0.9901, memoryGb: 44.1, status: "keep", description: "add rotary positional embeddings" },
      { step: 4, commit: c(), valBpb: 0.9878, memoryGb: 44.5, status: "keep", description: "SwiGLU activation function" },
      { step: 5, commit: c(), valBpb: 0.0, memoryGb: 0.0, status: "crash", description: "double model width (OOM)" },
      { step: 6, commit: c(), valBpb: 0.9856, memoryGb: 46.1, status: "keep", description: "depth 8 → 12 layers" },
      { step: 7, commit: c(), valBpb: 0.9845, memoryGb: 46.0, status: "keep", description: "QK-norm in attention" },
      { step: 8, commit: c(), valBpb: 0.9823, memoryGb: 46.2, status: "keep", description: "cosine LR schedule w/ warmup" },
      { step: 9, commit: c(), valBpb: 0.9831, memoryGb: 46.1, status: "discard", description: "RMSNorm instead of LayerNorm" },
      { step: 10, commit: c(), valBpb: 0.9798, memoryGb: 47.8, status: "keep", description: "2× batch with grad accum" },
      { step: 11, commit: c(), valBpb: 0.9812, memoryGb: 47.5, status: "discard", description: "weight decay 0.1 on all params" },
      { step: 12, commit: c(), valBpb: 0.9756, memoryGb: 47.6, status: "keep", description: "Muon warmup 200 steps" },
      { step: 13, commit: c(), valBpb: 0.9721, memoryGb: 48.9, status: "keep", description: "depth 10 + width 896" },
      { step: 14, commit: c(), valBpb: 0.9734, memoryGb: 48.8, status: "discard", description: "gradient clip 1.0 → 0.5" },
      { step: 15, commit: c(), valBpb: 0.0, memoryGb: 0.0, status: "crash", description: "knowledge distillation init" },
      { step: 16, commit: c(), valBpb: 0.9688, memoryGb: 50.2, status: "keep", description: "embed dim → 960" },
      { step: 17, commit: c(), valBpb: 0.9695, memoryGb: 50.1, status: "discard", description: "attention dropout 0.05" },
      { step: 18, commit: c(), valBpb: 0.9654, memoryGb: 50.5, status: "keep", description: "parallel attention + FFN" },
      { step: 19, commit: c(), valBpb: 0.9671, memoryGb: 51.2, status: "discard", description: "context length 512 → 768" },
      { step: 20, commit: c(), valBpb: 0.962134, memoryGb: 50.8, status: "keep", description: "multi-query attention" },
    ],
  },
  {
    id: "phoenix",
    name: "Hive Phoenix",
    gpu: "H100",
    operator: "@cursor_eng",
    bestValBpb: 0.970123,
    totalExperiments: 13,
    keepRate: 69,
    crashRate: 8,
    improvementPct: 2.79,
    experiments: [
      { step: 1, commit: c(), valBpb: 0.9979, memoryGb: 44.0, status: "keep", description: "baseline" },
      { step: 2, commit: c(), valBpb: 0.0, memoryGb: 0.0, status: "crash", description: "aggressive width 768 → 1536" },
      { step: 3, commit: c(), valBpb: 0.9934, memoryGb: 46.8, status: "keep", description: "width 896 + depth 6" },
      { step: 4, commit: c(), valBpb: 0.9901, memoryGb: 46.9, status: "keep", description: "SwiGLU + RMSNorm combo" },
      { step: 5, commit: c(), valBpb: 0.9867, memoryGb: 47.1, status: "keep", description: "rotary + flash attention" },
      { step: 6, commit: c(), valBpb: 0.9845, memoryGb: 47.2, status: "keep", description: "cosine schedule 1e-4 min LR" },
      { step: 7, commit: c(), valBpb: 0.9823, memoryGb: 47.0, status: "keep", description: "multi-query attention 4 KV heads" },
      { step: 8, commit: c(), valBpb: 0.9812, memoryGb: 48.4, status: "keep", description: "batch 64 → 96" },
      { step: 9, commit: c(), valBpb: 0.9818, memoryGb: 48.3, status: "discard", description: "gradient clip tuning" },
      { step: 10, commit: c(), valBpb: 0.9789, memoryGb: 48.6, status: "keep", description: "Muon LR 0.03 → 0.045" },
      { step: 11, commit: c(), valBpb: 0.9756, memoryGb: 50.1, status: "keep", description: "embed dim 960" },
      { step: 12, commit: c(), valBpb: 0.9767, memoryGb: 50.0, status: "discard", description: "16 attention heads" },
      { step: 13, commit: c(), valBpb: 0.970123, memoryGb: 50.4, status: "keep", description: "parallel FFN block" },
    ],
  },
  {
    id: "omega",
    name: "Hive Omega",
    gpu: "H100",
    operator: "@deepmind_res",
    bestValBpb: 0.976891,
    totalExperiments: 15,
    keepRate: 67,
    crashRate: 13,
    improvementPct: 2.11,
    experiments: [
      { step: 1, commit: c(), valBpb: 0.9979, memoryGb: 44.0, status: "keep", description: "baseline" },
      { step: 2, commit: c(), valBpb: 0.9951, memoryGb: 44.1, status: "keep", description: "LR 0.02 → 0.03" },
      { step: 3, commit: c(), valBpb: 0.9943, memoryGb: 44.2, status: "keep", description: "weight decay 0.05" },
      { step: 4, commit: c(), valBpb: 0.0, memoryGb: 0.0, status: "crash", description: "width 768 → 1024 (OOM)" },
      { step: 5, commit: c(), valBpb: 0.9912, memoryGb: 46.8, status: "keep", description: "width 768 → 896" },
      { step: 6, commit: c(), valBpb: 0.9889, memoryGb: 46.9, status: "keep", description: "SwiGLU activation" },
      { step: 7, commit: c(), valBpb: 0.9867, memoryGb: 47.0, status: "keep", description: "cosine annealing schedule" },
      { step: 8, commit: c(), valBpb: 0.9852, memoryGb: 47.1, status: "keep", description: "RMSNorm everywhere" },
      { step: 9, commit: c(), valBpb: 0.9834, memoryGb: 48.5, status: "keep", description: "batch size increase" },
      { step: 10, commit: c(), valBpb: 0.9841, memoryGb: 48.4, status: "discard", description: "gradient accumulation 2×" },
      { step: 11, commit: c(), valBpb: 0.9801, memoryGb: 48.7, status: "keep", description: "rotary position embeddings" },
      { step: 12, commit: c(), valBpb: 0.9812, memoryGb: 49.5, status: "discard", description: "6 layers + width 1024" },
      { step: 13, commit: c(), valBpb: 0.9789, memoryGb: 48.9, status: "keep", description: "flash attention v2" },
      { step: 14, commit: c(), valBpb: 0.0, memoryGb: 0.0, status: "crash", description: "multi-head latent attention" },
      { step: 15, commit: c(), valBpb: 0.976891, memoryGb: 49.2, status: "keep", description: "Muon momentum tuning" },
    ],
  },
  {
    id: "prometheus",
    name: "Hive Prometheus",
    gpu: "A100",
    operator: "@lambda_labs",
    bestValBpb: 0.994512,
    totalExperiments: 12,
    keepRate: 67,
    crashRate: 17,
    improvementPct: 2.83,
    experiments: [
      { step: 1, commit: c(), valBpb: 1.0234, memoryGb: 38.2, status: "keep", description: "baseline" },
      { step: 2, commit: c(), valBpb: 1.0189, memoryGb: 38.3, status: "keep", description: "increase LR" },
      { step: 3, commit: c(), valBpb: 1.0145, memoryGb: 38.4, status: "keep", description: "rotary embeddings" },
      { step: 4, commit: c(), valBpb: 1.0098, memoryGb: 38.6, status: "keep", description: "SwiGLU activation" },
      { step: 5, commit: c(), valBpb: 0.0, memoryGb: 0.0, status: "crash", description: "width increase (OOM)" },
      { step: 6, commit: c(), valBpb: 1.0067, memoryGb: 39.8, status: "keep", description: "depth 10 layers" },
      { step: 7, commit: c(), valBpb: 1.0023, memoryGb: 39.9, status: "keep", description: "cosine schedule" },
      { step: 8, commit: c(), valBpb: 1.0015, memoryGb: 39.8, status: "keep", description: "RMSNorm" },
      { step: 9, commit: c(), valBpb: 0.9989, memoryGb: 40.5, status: "keep", description: "optimize throughput — smaller model faster steps" },
      { step: 10, commit: c(), valBpb: 0.9945, memoryGb: 40.8, status: "keep", description: "multi-query attention" },
      { step: 11, commit: c(), valBpb: 0.9956, memoryGb: 41.2, status: "discard", description: "batch tuning" },
      { step: 12, commit: c(), valBpb: 0.0, memoryGb: 0.0, status: "crash", description: "distillation from larger checkpoint" },
    ],
  },
  {
    id: "genesis",
    name: "Hive Genesis",
    gpu: "L40S",
    operator: "@stanford_ml",
    bestValBpb: 0.988945,
    totalExperiments: 10,
    keepRate: 70,
    crashRate: 10,
    improvementPct: 1.98,
    experiments: [
      { step: 1, commit: c(), valBpb: 1.0089, memoryGb: 30.1, status: "keep", description: "baseline" },
      { step: 2, commit: c(), valBpb: 1.0045, memoryGb: 30.2, status: "keep", description: "LR tuning" },
      { step: 3, commit: c(), valBpb: 1.0012, memoryGb: 30.3, status: "keep", description: "SwiGLU activation" },
      { step: 4, commit: c(), valBpb: 0.9978, memoryGb: 30.5, status: "keep", description: "rotary embeddings" },
      { step: 5, commit: c(), valBpb: 0.9956, memoryGb: 30.6, status: "keep", description: "cosine schedule" },
      { step: 6, commit: c(), valBpb: 0.0, memoryGb: 0.0, status: "crash", description: "wider model (OOM)" },
      { step: 7, commit: c(), valBpb: 0.9934, memoryGb: 31.2, status: "keep", description: "RMSNorm + param tuning" },
      { step: 8, commit: c(), valBpb: 0.9912, memoryGb: 31.5, status: "keep", description: "multi-query attention" },
      { step: 9, commit: c(), valBpb: 0.9923, memoryGb: 31.8, status: "discard", description: "batch optimization" },
      { step: 10, commit: c(), valBpb: 0.988945, memoryGb: 31.6, status: "keep", description: "parallel attention + FFN" },
    ],
  },
  {
    id: "nightowl",
    name: "Hive Nightowl",
    gpu: "RTX 4090",
    operator: "@indie_dev",
    bestValBpb: 1.018923,
    totalExperiments: 10,
    keepRate: 70,
    crashRate: 0,
    improvementPct: 3.07,
    experiments: [
      { step: 1, commit: c(), valBpb: 1.0512, memoryGb: 18.2, status: "keep", description: "baseline" },
      { step: 2, commit: c(), valBpb: 1.0456, memoryGb: 16.5, status: "keep", description: "reduce model size for 24GB VRAM" },
      { step: 3, commit: c(), valBpb: 1.0523, memoryGb: 16.4, status: "discard", description: "aggressive LR increase" },
      { step: 4, commit: c(), valBpb: 1.0401, memoryGb: 16.6, status: "keep", description: "moderate LR 0.025" },
      { step: 5, commit: c(), valBpb: 1.0367, memoryGb: 16.8, status: "keep", description: "SwiGLU" },
      { step: 6, commit: c(), valBpb: 1.0334, memoryGb: 16.7, status: "keep", description: "cosine schedule" },
      { step: 7, commit: c(), valBpb: 1.0298, memoryGb: 17.1, status: "keep", description: "smaller batch + more steps" },
      { step: 8, commit: c(), valBpb: 1.0256, memoryGb: 17.3, status: "keep", description: "rotary embeddings" },
      { step: 9, commit: c(), valBpb: 1.0234, memoryGb: 17.2, status: "discard", description: "RMSNorm (neutral)" },
      { step: 10, commit: c(), valBpb: 1.018923, memoryGb: 18.8, status: "keep", description: "grad checkpoint + wider model" },
    ],
  },
];

export function getTrajectory(experiments: Experiment[]): number[] {
  return experiments.filter((e) => e.status === "keep").map((e) => e.valBpb);
}

export function getChartData(hives: HiveSubmission[]) {
  const trajectories = hives.map((h) => ({
    name: h.name,
    keeps: h.experiments.filter((e) => e.status === "keep").map((e) => e.valBpb),
  }));

  const maxLen = Math.max(...trajectories.map((t) => t.keeps.length));
  const data: Record<string, number | string>[] = [];

  for (let i = 0; i < maxLen; i++) {
    const point: Record<string, number | string> = { experiment: i + 1 };
    for (const t of trajectories) {
      if (i < t.keeps.length) {
        point[t.name] = t.keeps[i];
      }
    }
    data.push(point);
  }

  return data;
}

export function getRecentActivity(hives: HiveSubmission[]) {
  const all = hives.flatMap((h) =>
    h.experiments.map((e) => ({
      hiveName: h.name,
      gpu: h.gpu,
      ...e,
    })),
  );

  return all
    .sort(() => Math.random() - 0.5)
    .slice(0, 25);
}

export function parseResultsTsv(content: string): Experiment[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  return lines.slice(1).map((line, i) => {
    const parts = line.split("\t");
    const [commit, valBpb, memoryGb, status, ...descParts] = parts;
    return {
      step: i + 1,
      commit: commit || "",
      valBpb: parseFloat(valBpb) || 0,
      memoryGb: parseFloat(memoryGb) || 0,
      status: (status as ExperimentStatus) || "discard",
      description: descParts.join("\t") || "",
    };
  });
}
