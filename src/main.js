const Discord = require('discord.js');

const client = new Discord.Client({
  messageCacheMaxSize: 10,
  messageCacheLifetime: 20,
  messageSweepInterval: 30,
  intents: ['GUILD_MESSAGES', 'GUILDS'],
});

client.events = [];
client.commands = new Discord.Collection();
client.settings = require('../config/settings.js');
client.colors = require('../config/colors.json');
client.emojiList = require('../config/emojis.json');

['commands', 'events'].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on('shardDisconnect', () => process.exit(1));
client.on('shardReconnecting', () => process.exit(1));
client.on('shardError', e => console.log(e));
client.on('shardWarn', w => console.log(w));
client.on('debug', (log) => {
  require('fs').appendFileSync('debug.log', `
${log}`);
});

client.login(process.env.DISCORD_TOKEN);
