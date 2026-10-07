const express = require("express");
const env = require("../config/env");
const syncRoutes = require("./routes/sync");
const guildRoutes = require("./routes/guilds");
const healthRoutes = require("./routes/health");

const app = express();

app.use(express.json());

// Middleware: Verify API Secret
app.use((req, res, next) => {
  const secret = req.headers["x-api-secret"];
  if (req.path === "/health" || req.path.startsWith("/metrics")) {
    return next();
  }
  if (secret !== env.BOT_API_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// Routes
app.use("/api/sync", syncRoutes);
app.use("/api/guilds", guildRoutes);
app.use("/health", healthRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

function start() {
  app.listen(env.BOT_API_PORT, () => {
    console.log(`API server running on port ${env.BOT_API_PORT}`);
  });
}

module.exports = { app, start };
