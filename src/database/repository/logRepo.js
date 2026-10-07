const { prisma } = require("../connect");

async function addLog(guildId, options = {}) {
  return prisma.logEntry.create({
    data: {
      guildId,
      eventType: options.eventType || "unknown",
      userId: options.userId,
      moderatorId: options.moderatorId,
      channelId: options.channelId,
      messageId: options.messageId,
      payload: options.payload || {}
    }
  });
}

module.exports = {
  addLog
};
