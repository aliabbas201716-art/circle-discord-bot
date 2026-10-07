require("dotenv").config();

module.exports = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DATABASE_URL: process.env.DATABASE_URL,
  BOT_API_SECRET: process.env.BOT_API_SECRET || "dev-secret",
  BOT_API_PORT: process.env.BOT_API_PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info"
};
