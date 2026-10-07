const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.BOT_API_PORT || 3001;
const botApiSecret = process.env.BOT_API_SECRET || "dev-secret";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
});

client.commands = new Collection();
client.guildConfigCache = new Map();

app.use(express.json());

app.use((req, res, next) => {
  if (req.path === "/health") return next();
  const secret = req.headers["x-api-secret"] || req.headers["X-API-SECRET"];
  if (secret !== botApiSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

app.get("/health", async (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/guilds/:guildId", async (req, res) => {
  const { guildId } = req.params;
  const config = await prisma.guildConfig.findUnique({ where: { guildId } });
  if (!config) return res.status(404).json({ error: "Guild config not found" });
  res.json(config);
});

app.post("/api/sync/guilds/:guildId", async (req, res) => {
  try {
    const { guildId } = req.params;
    const { config } = req.body;

    if (!config) {
      return res.status(400).json({ error: "Missing config" });
    }

    const saved = await prisma.guildConfig.upsert({
      where: { guildId },
      update: config,
      create: {
        guildId,
        ...config,
      },
    });

    client.guildConfigCache.set(guildId, saved);
    console.log(`[SYNC] Updated guild config for ${guildId}`);

    res.json({ success: true, guildId, syncedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Failed to sync config" });
  }
});

client.on("ready", () => {
  console.log(`[BOT] Logged in as ${client.user.tag}`);
  client.user.setActivity("your community", { type: "WATCHING" });
});

client.on("guildCreate", async (guild) => {
  await prisma.guildConfig.upsert({
    where: { guildId: guild.id },
    update: { name: guild.name },
    create: { guildId: guild.id, name: guild.name },
  });
});

client.on("guildMemberAdd", async (member) => {
  const config = client.guildConfigCache.get(member.guild.id) ||
    (await prisma.guildConfig.findUnique({ where: { guildId: member.guild.id } }));

  if (!config) return;

  if (config.autoRoleIds?.length) {
    for (const roleId of config.autoRoleIds) {
      const role = member.guild.roles.cache.get(roleId);
      if (role) await member.roles.add(role).catch(() => {});
    }
  }

  if (config.welcomeChannel) {
    const channel = member.guild.channels.cache.get(config.welcomeChannel);
    if (channel) {
      await channel.send({ content: config.welcomeMessage || `Welcome ${member.user.username}!` }).catch(() => {});
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const config = client.guildConfigCache.get(message.guild.id) ||
    (await prisma.guildConfig.findUnique({ where: { guildId: message.guild.id } }));

  if (!config) return;

  const content = message.content.toLowerCase();

  if (config.inviteFilter && /(discord\.gg|discordapp\.com\/invite|discord\.com\/invite)/i.test(content)) {
    await message.delete().catch(() => {});
    await message.member?.timeout(60_000, "Invite links are not allowed.").catch(() => {});
    return;
  }

  if (config.blacklistedWords?.some((word) => content.includes(word.toLowerCase()))) {
    await message.delete().catch(() => {});
    return;
  }

  if (config.mentionFilter && (content.match(/@everyone|@here/g) || []).length >= 3) {
    await message.delete().catch(() => {});
    return;
  }
});

async function bootstrap() {
  await prisma.$connect();
  console.log("[BOT] Connected to PostgreSQL");

  app.listen(port, () => {
    console.log(`[API] Listening on port ${port}`);
  });

  await client.login(process.env.DISCORD_TOKEN);
}

bootstrap().catch((err) => {
  console.error("Failed to start bot:", err);
  process.exit(1);
});
