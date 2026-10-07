const express = require("express");
const { prisma } = require("../database/connect");
const router = express.Router();

router.get("/:guildId", async (req, res) => {
  try {
    const { guildId } = req.params;

    const config = await prisma.guildConfig.findUnique({
      where: { guildId }
    });

    if (!config) {
      return res.status(404).json({ error: "Guild config not found" });
    }

    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch config" });
  }
});

router.get("/:guildId/logs", async (req, res) => {
  try {
    const { guildId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const logs = await prisma.logEntry.findMany({
      where: { guildId },
      orderBy: { createdAt: "desc" },
      take: limit
    });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;
