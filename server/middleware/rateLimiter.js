const { rateLimit } = require("express-rate-limit");
const { getRedisClient, isRedisReady } = require("../config/redis");
const { rateLimitMax, rateLimitWindowMs } = require("../config/env");

const memoryLimiter = rateLimit({
  windowMs: rateLimitWindowMs,
  limit: rateLimitMax,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

const getIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.ip || req.socket.remoteAddress || "unknown";
};

const rateLimiter = async (req, res, next) => {
  if (!isRedisReady()) {
    return memoryLimiter(req, res, next);
  }

  try {
    const client = getRedisClient();
    const key = `rate:${getIp(req)}:${req.method}:${req.path}`;
    const hits = await client.incr(key);

    if (hits === 1) {
      await client.pExpire(key, rateLimitWindowMs);
    }

    const ttl = await client.pTTL(key);
    res.setHeader("RateLimit-Limit", rateLimitMax);
    res.setHeader("RateLimit-Remaining", Math.max(rateLimitMax - hits, 0));
    if (ttl > 0) {
      res.setHeader("RateLimit-Reset", Math.ceil(ttl / 1000));
    }

    if (hits > rateLimitMax) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later."
      });
    }

    return next();
  } catch {
    return memoryLimiter(req, res, next);
  }
};

module.exports = rateLimiter;
