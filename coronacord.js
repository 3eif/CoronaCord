const Discord = require("discord.js");
const mongoose = require("mongoose");

mongoose.connect(require("./tokens.json").db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.settings = require("./settings.js");
const tokens = require("./tokens.json");
// const DBL = require("dblapi.js");
// client.dbl = new DBL(tokens.dblToken, { webhookPort: 65335, webhookAuth: tokens.dblPassword }, this.client);

["commands","events"].forEach(handler => {
  require(`./util/${handler}`)(client);
});

client.on("shardDisconnect", () => console.log("Disconnecting..."));
client.on("shardReconnecting", () => console.log("Reconnecting..."));
client.on("shardError", e => console.log(e));
client.on("shardWarn", w => console.log(w));
client.on("debug", (log) => {
  require("fs").appendFileSync("debug.log", `

${log}`);
});
client.login(tokens.discordToken);