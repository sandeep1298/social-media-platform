const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://social-media-app-3h5q.vercel.app",
  "https://social-media-app-3h5q-git-main-sandeeps-projects-22864139.vercel.app"
];

const parseList = (value, fallback = []) => {
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || process.env.MONGOURI,
  redisUrl: process.env.REDIS_URL || "",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  corsOrigins: parseList(process.env.CORS_ORIGIN, defaultOrigins),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 120
};
