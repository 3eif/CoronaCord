const Discord = require("discord.js");
const mongoose = require("mongoose");
const tokens = require("./tokens.json");

mongoose.connect(`mongodb://${tokens.mongoIP}:${tokens.mongoPort}/coronacord`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const client = new Discord.Client({
  messageCacheMaxSize: 10,
  messageCacheLifetime: 20,
  messageSweepInterval: 30
});

client.events = [];
client.commands = new Discord.Collection();
client.settings = require("./settings.js");
client.colors = require("./data/colors.json");
client.emojiList = require("./data/emojis.json");

["commands", "events"].forEach(handler => {
  require(`./util/handlers/${handler}`)(client);
});

client.on("raw", () => client.events.push({ timestamp: Date.now() }));
client.on("shardDisconnect", () => process.exit(1));
client.on("shardReconnecting", () => process.exit(1));
client.on("shardError", e => console.log(e));
client.on("shardWarn", w => console.log(w));
client.on("debug", (log) => {
  require("fs").appendFileSync("debug.log", `

${log}`);
});

client.login(tokens.discordToken);