import { Redis } from "@upstash/redis";
import type { HiveSubmission } from "./data";

const REDIS_KEY = "hive:submissions";

function getRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.STORAGE_URL ||
    process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.STORAGE_TOKEN ||
    process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// ── Redis storage ──────────────────────────────────────────

async function redisGet(redis: Redis): Promise<HiveSubmission[]> {
  const data = await redis.get<HiveSubmission[]>(REDIS_KEY);
  return data || [];
}

async function redisSet(
  redis: Redis,
  data: HiveSubmission[],
): Promise<void> {
  await redis.set(REDIS_KEY, data);
}

// ── File storage (local dev fallback) ──────────────────────

async function fileGet(): Promise<HiveSubmission[]> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "data", "submissions.json");
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function fileSet(data: HiveSubmission[]): Promise<void> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const dir = path.join(process.cwd(), "data");
  await fs.mkdir(dir, { recursive: true }).catch(() => {});
  await fs.writeFile(
    path.join(dir, "submissions.json"),
    JSON.stringify(data, null, 2),
  );
}

// ── Public API ─────────────────────────────────────────────

export async function getSubmissions(): Promise<HiveSubmission[]> {
  const redis = getRedis();
  return redis ? redisGet(redis) : fileGet();
}

export async function addSubmission(sub: HiveSubmission): Promise<void> {
  const redis = getRedis();
  const current = redis ? await redisGet(redis) : await fileGet();
  current.push(sub);
  return redis ? redisSet(redis, current) : fileSet(current);
}

export async function getSubmissionById(
  id: string,
): Promise<HiveSubmission | null> {
  const subs = await getSubmissions();
  return subs.find((s) => s.id === id) || null;
}
