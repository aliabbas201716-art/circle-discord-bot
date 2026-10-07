let guildCache = {};

async function initCache(client) {
  // Cache can be pre-loaded from database here
  console.log("[CACHE] Initialized");
}

function getGuildConfig(guildId) {
  return guildCache[guildId] || null;
}

function setGuildConfig(guildId, config) {
  guildCache[guildId] = config;
}

function invalidateGuildConfig(guildId) {
  delete guildCache[guildId];
}

module.exports = {
  initCache,
  getGuildConfig,
  setGuildConfig,
  invalidateGuildConfig
};
