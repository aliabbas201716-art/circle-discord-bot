const fs = require("fs");
const path = require("path");

function loadCommands(client) {
  const commandsDir = path.join(__dirname);
  const commandFiles = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.name.endsWith(".js")) commandFiles.push(fullPath);
    }
  }

  walk(commandsDir);

  for (const file of commandFiles) {
    const command = require(file);
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }

  console.log(`[COMMANDS] Loaded ${commandFiles.length} command(s)`);
  return Promise.resolve();
}

module.exports = loadCommands;
