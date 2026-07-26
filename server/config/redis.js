const { createClient } = require("redis");
const { redisUrl } = require("./env");

let redisClient = null;

const connectRedis = async () => {
  if (!redisUrl) {
    console.log("Redis URL not provided; continuing without Redis cache");
    return null;
  }

  redisClient = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
    }
  });

  redisClient.on("error", (error) => {
    console.error("Redis error:", error.message);
  });

  await redisClient.connect();
  console.log("Connected to Redis");
  return redisClient;
};

const getRedisClient = () => redisClient;

const isRedisReady = () => Boolean(redisClient && redisClient.isReady);

const getCache = async (key) => {
  if (!isRedisReady()) return null;

  const cached = await redisClient.get(key);
  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch {
    return cached;
  }
};

const setCache = async (key, value, ttlSeconds = 60) => {
  if (!isRedisReady()) return;
  await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
};

const deleteCachePattern = async (pattern) => {
  if (!isRedisReady()) return;

  try {
    for await (const scanResult of redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      // node-redis can yield a key or a batch of keys, depending on its version.
      // Normalize both shapes so cached feeds are always invalidated after writes.
      const keys = (Array.isArray(scanResult) ? scanResult : [scanResult]).filter(
        (key) => typeof key === "string" && key
      );

      if (keys.length) {
        await redisClient.del(keys);
      }
    }
  } catch (error) {
    console.warn("Redis cache invalidation failed:", error.message);
  }
};

module.exports = {
  connectRedis,
  deleteCachePattern,
  getCache,
  getRedisClient,
  isRedisReady,
  setCache
};
