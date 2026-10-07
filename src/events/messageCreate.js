const guildRepo = require("../database/repository/guildRepo");
const autoModService = require("../services/autoModService");
const logRepo = require("../database/repository/logRepo");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const config = await guildRepo.getGuildConfig(message.guild.id);
    if (!config) return;

    // Run auto-moderation
    const autoModResult = await autoModService.run(message, config);
    if (autoModResult?.punished) return;
  }
};
