const guildRepo = require("../database/repository/guildRepo");

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    console.log(`[GUILD] Joined: ${guild.name} (${guild.id})`);
    
    await guildRepo.upsertGuildConfig(guild.id, {
      guildId: guild.id,
      name: guild.name
    });
  }
};
