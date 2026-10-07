const { prisma } = require("../connect");

async function addWarning(guildId, userId, moderatorId, reason, type = "warn") {
  return prisma.warning.create({
    data: {
      guildId,
      userId,
      moderatorId,
      reason,
      type
    }
  });
}

async function getWarnings(guildId, userId) {
  return prisma.warning.findMany({
    where: { guildId, userId },
    orderBy: { createdAt: "desc" }
  });
}

module.exports = {
  addWarning,
  getWarnings
};
