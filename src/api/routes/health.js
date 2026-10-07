const express = require("express");
const router = express.Router();

const startTime = Date.now();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    services: [
      {
        name: "Discord Bot",
        status: "running"
      },
      {
        name: "API Server",
        status: "running"
      },
      {
        name: "Database Sync",
        status: "running"
      }
    ]
  });
});

module.exports = router;
