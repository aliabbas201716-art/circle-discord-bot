const express = require("express");
const { prisma } = require("../database/connect");
const router = express.Router();

let guildConfigCache = {};

router.post("/guilds/:guildId", async (req, res) => {
  try {
    const { guildId } = req.params;
    const { config } = req.body;

    if (!guildId || !config) {
      return res.status(400).json({ error: "Missing guildId or config" });
    }

    const updated = await prisma.guildConfig.upsert({
      where: { guildId },
      update: config,
      create: {
        guildId,
        ...config
      }
    });

    guildConfigCache[guildId] = updated;

    console.log(`[SYNC] Guild config updated: ${guildId}`);

    res.json({
      success: true,
      guildId,
      cached: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Failed to sync config" });
  }
});

router.get("/cache", (req, res) => {
  res.json({
    cachedGuilds: Object.keys(guildConfigCache).length,
    guilds: guildConfigCache
  });
});

module.exports = router;
