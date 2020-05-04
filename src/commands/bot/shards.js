const Discord = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Shards extends Command {
  constructor(client) {
    super(client, {
      name: 'shards',
      description: 'Displays the bot\'s shards',
      cooldown: '5',
      aliases: ['shardstats', 'shardinfo'],
    });
  }
  async run(client, message) {

    const promises = [
      client.shard.fetchClientValues('guilds.cache.size'),
      client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
      client.shard.fetchClientValues('events'),
    ];

    const shardInfo = await client.shard.broadcastEval(`[
        this.shard.ids,
        this.shard.mode,
        this.guilds.cache.size,
        this.channels.cache.size,
        this.users.cache.size,
        (process.memoryUsage().heapUsed / 1024 / 1024),
        this.events,
        this.ws.ping
      ]`);

    const embed = new Discord.MessageEmbed()
      .setColor(client.colors.main)
      .setAuthor('CoronaCord', client.user.displayAvatarURL());

    shardInfo.forEach(i => {
      const status = i[7] > 1 ? client.emojiList.online : client.emojiList.offline;
      embed.addField(`${status} Shard ${parseInt(i[0]) + 1}`, `\`\`\`js
Servers: ${i[2]}\nChannels: ${i[3]}\nUsers: ${i[4]}\nMemory: ${i[5].toFixed(2)}\nAPI Latency: ${i[7]}ms\nEvents: 1M: ${i[6].filter(e => ((Date.now() - 1585425784085) - e.t) < 60000).length.toLocaleString()}, 15M: ${i[6].filter(e => ((Date.now() - 1585425784085) - e.t) < 900000).length.toLocaleString()}, 1H: ${i[6].filter(e => ((Date.now() - 1585425784085) - e.t) < 3600000).length.toLocaleString()}\nTotal: ${i[6].length.toLocaleString()} Events\`\`\``);
    });

    Promise.all(promises)
      .then(results => {
        let totalEvents = 0;
        shardInfo.forEach(s => totalEvents += s[6].length);
        let totalMemory = 0;
        shardInfo.forEach(s => totalMemory += s[5]);
        let avgLatency = 0;
        shardInfo.forEach(s => avgLatency += s[7]);
        avgLatency = avgLatency / shardInfo.length;

        const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
        const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
        embed.addField('Total Stats', `**${avgLatency}ms** Avg. Latency - **${totalGuilds.toLocaleString()}** servers - **${totalMembers.toLocaleString()}** members - **${totalEvents.toLocaleString()}** events - **${totalMemory.toFixed(2)}** MB`);
        message.channel.send(embed);
      });
  }
};