// Sliding-window rate limiter using Upstash Redis REST API.
// Degrades to allow-all when UPSTASH_REDIS_REST_URL / TOKEN are not set.
// Never throws — fail open so Redis outages don't block real users.

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ success: boolean }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { success: true };

  const headers = { Authorization: `Bearer ${token}` };
  const now = Date.now();
  const windowStart = now - windowMs;
  const encodedKey = encodeURIComponent(key);

  try {
    // Add current timestamp as both score and member (unique per call)
    await fetch(`${url}/zadd/${encodedKey}/NX/${now}/${now}`, { headers });

    // Evict entries outside the window
    await fetch(`${url}/zremrangebyscore/${encodedKey}/0/${windowStart}`, { headers });

    // Count remaining entries
    const countRes = await fetch(`${url}/zcount/${encodedKey}/${windowStart}/${now}`, { headers });
    if (!countRes.ok) return { success: true };

    const { result } = await countRes.json() as { result: number };

    // Keep the key alive for 2× the window duration
    await fetch(`${url}/expire/${encodedKey}/${Math.ceil((windowMs * 2) / 1000)}`, { headers });

    return { success: result <= limit };
  } catch {
    return { success: true };
  }
}
