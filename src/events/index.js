const fs = require("fs");
const path = require("path");

function loadEvents(client) {
  const eventsDir = path.join(__dirname);
  const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith(".js") && file !== "index.js");

  for (const file of eventFiles) {
    const event = require(path.join(eventsDir, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  console.log(`[EVENTS] Loaded ${eventFiles.length} event(s)`);
  return Promise.resolve();
}

module.exports = loadEvents;
