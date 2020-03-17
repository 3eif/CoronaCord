const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.settings = require("./settings.js");
const tokens = require("./tokens.json");

["commands","events"].forEach(handler => {
  require(`./util/${handler}`)(client)
})

client.on("shardDisconnect", () => console.log("Disconnecting..."));
client.on("shardReconnecting", () => console.log("Reconnecting..."));
client.on("shardError", e => console.log(e));
client.on("shardWarn", w => console.log(w));

client.login(tokens.discordToken);