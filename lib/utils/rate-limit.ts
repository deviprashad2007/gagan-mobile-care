const buckets = new Map<string, number[]>();

/**
 * Sliding-window rate limit, per process. Returns false once `limit` calls
 * for `key` have happened within `windowMs`. Good enough for a single
 * low-traffic serverless function; swap for a DB- or Redis-backed limiter
 * if this ever runs across many concurrent instances.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Occasionally sweep stale keys so the map doesn't grow forever.
  if (Math.random() < 0.01) {
    for (const [k, timestamps] of buckets) {
      if (timestamps.every((t) => now - t > windowMs)) buckets.delete(k);
    }
  }

  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return true;
}
