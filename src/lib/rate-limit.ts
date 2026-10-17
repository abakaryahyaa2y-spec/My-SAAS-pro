// ==============================================================================
// EduSaaS - Rate Limiter Côté Serveur (Sliding Window in-memory)
// Prévention des attaques par force brute et DoS sur les endpoints sensibles
// ==============================================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Nettoyage régulier des clés expirées toutes les 5 minutes pour éviter toute fuite mémoire
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  windowMs?: number; // Fenêtre de temps en millisecondes (défaut : 60 000 ms = 1 minute)
  max?: number;      // Nombre maximal de requêtes autorisées par fenêtre
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs || 60 * 1000;
  const max = options.max || 60;
  const now = Date.now();

  const record = rateLimitStore.get(identifier);

  if (!record || record.resetAt <= now) {
    // Nouvelle fenêtre
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      limit: max,
      remaining: max - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (record.count < max) {
    record.count += 1;
    return {
      success: true,
      limit: max,
      remaining: max - record.count,
      reset: Math.ceil(record.resetAt / 1000),
    };
  }

  // Seuil dépassé
  return {
    success: false,
    limit: max,
    remaining: 0,
    reset: Math.ceil(record.resetAt / 1000),
  };
}
