const Discord = require("discord.js");
const colors = require("../data/colors.json")
const { loading } = require("../data/emojis.json");

module.exports = {
    name: 'stats',
    description: 'Displays the bot\'s stats',
    cooldown: '5',
    async execute(client, message, args) {

        const msg = await message.channel.send(`${loading} Gathering stats...`);
        const os = require('os');
        const arch = os.arch();
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        // const usage = process.memoryUsage().rss / 1024 / 1024;
        let totalSeconds = process.uptime();
        let realTotalSecs = Math.floor(totalSeconds % 60);
        let days = Math.floor((totalSeconds % 31536000) / 86400);
        let hours = Math.floor((totalSeconds / 3600) % 24);
        let mins = Math.floor((totalSeconds / 60) % 60);

        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
        ];

            Promise.all(promises)
                .then(results => {
                    const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                    const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

                    var ping = client.ping;
                    const statsEmbed = new Discord.MessageEmbed()
                        .setAuthor("CoronaCord", client.user.displayAvatarURL())
                        .setColor(colors.main)
                        .setThumbnail(client.settings.avatar)
                        .addField("Born On", client.user.createdAt)
                        .addField("Current Version", client.settings.version, true)
                        .addField(`Servers`, `${totalGuilds} servers`, true)
                        .addField(`Members`, `${totalMembers} members`, true)
                        .addField(`Shards`, `${parseInt(client.shard.ids) + 1}/${client.shard.count}`, true)
                        .addField(`Memory Used`, `${Math.round(used * 100) / 100}MB`, true)
                        .addField(`Uptime`, `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds`)
                        .setFooter(`Latency ${msg.createdTimestamp - message.createdTimestamp}ms`)
                        .setTimestamp()
                    return msg.edit("", statsEmbed);
                })
                .catch(console.error);
    },
};