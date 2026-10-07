const { EmbedBuilder } = require("discord.js");
const guildRepo = require("../database/repository/guildRepo");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const config = await guildRepo.getGuildConfig(member.guild.id);
    if (!config) return;

    // Auto-role assignment
    if (config.autoRoleIds && config.autoRoleIds.length > 0) {
      for (const roleId of config.autoRoleIds) {
        const role = member.guild.roles.cache.get(roleId);
        if (role) {
          await member.roles.add(role).catch(() => {});
        }
      }
    }

    // Send welcome message
    if (config.welcomeChannel) {
      const channel = member.guild.channels.cache.get(config.welcomeChannel);
      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle("Welcome!")
          .setDescription(
            config.welcomeMessage || `Welcome ${member.user.username} to ${member.guild.name}!`
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setColor("#5865F2");

        await channel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
};
