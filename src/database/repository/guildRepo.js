const { prisma } = require("../connect");

async function getGuildConfig(guildId) {
  return prisma.guildConfig.findUnique({
    where: { guildId }
  });
}

async function upsertGuildConfig(guildId, data) {
  return prisma.guildConfig.upsert({
    where: { guildId },
    update: data,
    create: {
      guildId,
      ...data
    }
  });
}

module.exports = {
  getGuildConfig,
  upsertGuildConfig
};
