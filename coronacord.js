const Discord = require("discord.js");
const mongoose = require("mongoose");
const tokens = require("./tokens.json");

mongoose.connect(`mongodb+srv://${tokens.mongoUsername}:${encodeURIComponent(tokens.mongoPass)}@tetracyl-unhxi.mongodb.net/coronacord?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.settings = require("./settings.js");
client.colors = require("./data/colors.json");
client.emojiList = require("./data/emojis.json");
// const DBL = require("dblapi.js");
// client.dbl = new DBL(tokens.dblToken, { webhookPort: 65335, webhookAuth: tokens.dblPassword }, this.client);

["commands", "events"].forEach(handler => {
  require(`./util/handlers/${handler}`)(client);
});

client.on("shardDisconnect", () => console.log("Disconnecting..."));
client.on("shardReconnecting", () => console.log("Reconnecting..."));
client.on("shardError", e => console.log(e));
client.on("shardWarn", w => console.log(w));

client.login(tokens.discordToken);