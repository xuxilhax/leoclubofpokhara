/**
 * Leo Club CMS — Rate Limiting
 * ----------------------------------------------------------------
 * Simple in-memory rate limiter for form submissions and auth.
 * In production, replace with Redis-backed limiter for multi-instance.
 */

type RateBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateBucket>();

// Clean up expired buckets every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
  }, 5 * 60 * 1000);
}

/**
 * Check if a request should be rate-limited.
 * @param key — unique identifier (IP + route, or email)
 * @param maxRequests — max requests in the window
 * @param windowMs — time window in milliseconds
 * @returns { allowed: boolean; remaining: number; resetAt: number }
 */
export function rateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    // Create new bucket
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  bucket.count++;
  const allowed = bucket.count <= maxRequests;
  return {
    allowed,
    remaining: Math.max(0, maxRequests - bucket.count),
    resetAt: bucket.resetAt,
  };
}

/** Get client IP from request headers */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

// ============================================================
// CSRF Protection
// ============================================================

const csrfTokens = new Set<string>();

/**
 * Generate a CSRF token.
 * In production, use a signed JWT or HMAC token instead of random.
 */
export function generateCSRFToken(): string {
  const token = crypto.randomUUID() + crypto.randomUUID();
  csrfTokens.add(token);
  // Tokens expire after 1 hour
  setTimeout(() => csrfTokens.delete(token), 60 * 60 * 1000);
  return token;
}

/** Validate a CSRF token */
export function validateCSRFToken(token: string): boolean {
  return csrfTokens.has(token);
}
