# Bot Runtime

A Discord bot with moderation tools, auto-mod, welcome messages, starboard, and dashboard sync API.

## Features

- Discord bot runtime
- REST API for settings sync
- Guild config persistence in PostgreSQL
- Welcome + goodbye messages
- Auto-mod filters for invites, mentions, blacklisted words
- Moderation commands and logging

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Create `.env`

```env
DISCORD_TOKEN=your_bot_token
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/botdb
BOT_API_SECRET=your_shared_secret
BOT_API_PORT=3001
NODE_ENV=development
```

### 3) Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

### 4) Start the bot

```bash
npm run dev
```

## Sync API

The dashboard sends updates to:

```http
POST /api/sync/guilds/:guildId
Headers:
  x-api-secret: <BOT_API_SECRET>
Body:
  {
    "config": { ...guild settings... }
  }
```

## Vercel deployment

```json
{
  "version": 2,
  "builds": [{ "src": "src/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.js" }]
}
```
