# Discord Bot Runtime

A production-ready Discord bot with moderation, auto-mod, welcome messages, starboard, suggestions, and forms. Runs independently and syncs configuration with the web dashboard in real-time.

## Features

- **Moderation Commands**: `/ban`, `/kick`, `/mute`, `/timeout`, `/warn`
- **Auto-Moderation**: Detect spam, invite links, mass mentions, blacklisted words
- **Welcome/Goodbye System**: Customizable join/leave messages with auto-roles
- **Event Logging**: Track all server events with configurable log channels
- **Starboard**: Showcase popular messages on a dedicated channel
- **Suggestions**: Discord modal-based suggestion system
- **Forms & Appeals**: User submissions for ban appeals and applications
- **Real-time Sync API**: Receive config updates from dashboard instantly

## Tech Stack

- **Runtime**: Node.js 20
- **Discord Library**: discord.js v14
- **Database**: PostgreSQL with Prisma ORM
- **API Server**: Express.js
- **Real-time Sync**: REST API + in-memory config cache

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Discord Bot Token
- Shared database with dashboard

### Setup

1. Clone the repository:

```bash
git clone https://github.com/aliabbas201716-art/circle-discord-bot.git
cd circle-discord-bot
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Configure environment variables (see `.env.example`)

5. Start the bot:

```bash
npm run dev
```

For production:

```bash
npm start
```

## Environment Variables

See `.env.example` for all required variables:

- `DISCORD_TOKEN` - Your Discord bot token
- `DATABASE_URL` - PostgreSQL connection string
- `BOT_API_SECRET` - Shared secret with dashboard
- `BOT_API_PORT` - Port for sync API (default: 3001)
- `NODE_ENV` - Environment (development/production)

## API Endpoints

The bot exposes a REST API for receiving config sync from the dashboard:

### Sync Guild Config

```
POST /api/sync/guilds/:guildId
Header: x-api-secret: <BOT_API_SECRET>
Body: { guildId, config }
```

Response:
```json
{
  "success": true,
  "guildId": "123456789",
  "cached": true
}
```

### Get Guild Config

```
GET /api/guilds/:guildId
Header: x-api-secret: <BOT_API_SECRET>
```

Response:
```json
{
  "guildId": "123456789",
  "welcomeChannel": "...",
  "autoRoleIds": [...],
  ...
}
```

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "uptime": 12345,
  "cachedGuilds": 5
}
```

## Project Structure

```
.
├── src/
│   ├── index.js                 # Bot entry point
│   ├── api/
│   │   ├── server.js           # Express API server
│   │   └── routes/
│   │       ├── sync.js         # Config sync endpoint
│   │       ├── guilds.js       # Guild routes
│   │       └── health.js       # Health check
│   ├── config/
│   │   └── env.js              # Environment config
│   ├── database/
│   │   ├── connect.js          # Prisma connection
│   │   └── repository/
│   │       ├── guildRepo.js
│   │       ├── logRepo.js
│   │       └── moderationRepo.js
│   ├── events/
│   │   ├── ready.js
│   │   ├── guildCreate.js
│   │   ├── messageCreate.js
│   │   ├── guildMemberAdd.js
│   │   ├── guildMemberRemove.js
│   │   └── interactionCreate.js
│   ├── commands/
│   │   ├── admin/
│   │   │   ├── ban.js
│   │   │   ├── kick.js
│   │   │   ├── mute.js
│   │   │   ├── warn.js
│   │   │   └── moderation.js
│   │   └── utility/
│   │       ├── ping.js
│   │       └── help.js
│   ├── services/
│   │   ├── autoModService.js
│   │   ├── welcomeService.js
│   │   ├── moderationService.js
│   │   ├── starboardService.js
│   │   └── suggestionService.js
│   └── utils/
│       ├── logger.js
│       ├── embeds.js
│       ├── permissions.js
│       └── cache.js
├── prisma/
│   └── schema.prisma           # Database schema (shared)
├── .env.example
├── package.json
├── vercel.json                 # Vercel deployment config
└── README.md
```

## Discord OAuth Setup for Bot

The bot doesn't need Discord OAuth (that's for the dashboard). Instead:

1. Create a Discord Application
2. Create a Bot user
3. Copy the bot token
4. Add to `.env` as `DISCORD_TOKEN`
5. Invite with permissions:
   - Manage Roles
   - Manage Messages
   - Kick Members
   - Ban Members
   - Timeout Members
   - Read Message History
   - Send Messages
   - Manage Channels

## Real-time Config Sync

When the dashboard updates server settings:

1. Settings saved to PostgreSQL
2. Dashboard calls `POST /api/sync/guilds/:guildId`
3. Bot receives update
4. Bot invalidates config cache
5. Bot reloads from database
6. New rules apply instantly (no restart needed)

## Database Schema

Shared with the dashboard. See `prisma/schema.prisma`:

- `GuildConfig` - Server configuration
- `Warning` - User warnings and mod actions
- `LogEntry` - Event logs
- `Suggestion` - User suggestions
- `ReactionRole` - Role menus
- `FormSubmission` - User form submissions

## Deployment

### Vercel

```bash
vercel
```

This uses `vercel.json` to configure the deployment.

### Docker

```bash
docker build -t circle-discord-bot .
docker run --env-file .env circle-discord-bot
```

### Railway

```bash
railway up
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT
