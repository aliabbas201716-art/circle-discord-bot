const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const env = require("./config/env");
const db = require("./database/connect");
const { start: startApiServer } = require("./api/server");
const loadEvents = require("./events");
const loadCommands = require("./commands");
const { initCache } = require("./utils/cache");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User]
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.guildConfigCache = new Map();

async function boot() {
  try {
    console.log("[BOOT] Starting Discord bot...");
    
    // Connect to database
    await db.connect();
    console.log("[DATABASE] Connected");

    // Start API server (Service 1)
    startApiServer();
    console.log("[API] Server started");

    // Load bot events and commands
    await loadEvents(client);
    console.log("[EVENTS] Loaded");

    await loadCommands(client);
    console.log("[COMMANDS] Loaded");

    // Initialize cache
    await initCache(client);
    console.log("[CACHE] Initialized");

    // Login to Discord (Service 2)
    await client.login(env.DISCORD_TOKEN);
    console.log("[DISCORD] Logged in");
  } catch (error) {
    console.error("[BOOT] Failed to start bot:", error);
    process.exit(1);
  }
}

boot();

process.on("SIGINT", async () => {
  console.log("[SHUTDOWN] Graceful shutdown...");
  await client.destroy();
  await db.prisma.$disconnect();
  process.exit(0);
});
