require("dotenv").config();
require("./models/user");
require("./models/post");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const { connectRedis, isRedisReady } = require("./config/redis");
const { corsOrigins, env, jwtSecret, port } = require("./config/env");
const rateLimiter = require("./middleware/rateLimiter");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const searchRoutes = require("./routes/search");
const userRoutes = require("./routes/user");

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(morgan(env === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use("/api", rateLimiter);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    redis: isRedisReady() ? "connected" : "disabled"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }

  await connectDB();
  await connectRedis();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
