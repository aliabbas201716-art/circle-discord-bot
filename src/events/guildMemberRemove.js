const { EmbedBuilder } = require("discord.js");
const guildRepo = require("../database/repository/guildRepo");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    const config = await guildRepo.getGuildConfig(member.guild.id);
    if (!config) return;

    if (config.goodbyeChannel) {
      const channel = member.guild.channels.cache.get(config.goodbyeChannel);
      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle("Goodbye")
          .setDescription(
            config.goodbyeMessage || `${member.user.username} left ${member.guild.name}.`
          )
          .setColor("#ef4444");

        await channel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
};
