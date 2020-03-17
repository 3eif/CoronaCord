const colors = require("../data/colors.json");
const Discord = require('discord.js');
const Event = require('../Event');

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args)
    }

    async run(client) {

        this.client.user.setActivity(`c.help`);

        if (this.client.shard.ids == this.client.shard.count - 1) {
            const promises = [
                this.client.shard.fetchClientValues('guilds.cache.size'),
                this.client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
            ];

            return Promise.all(promises)
                .then(async results => {
                    const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                    const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
                    console.log(`Coronacord is online: ${this.client.shard.count} shards, ${totalGuilds} servers and ${totalMembers} members.`)
                });
        }
    }
}

