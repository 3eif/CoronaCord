const colors = require("../data/colors.json");
const Discord = require('discord.js');
const Event = require('../Event');
const tokens = require("../tokens.json");

const { webhooks } = require("../tokens.json");

const webhookClient = new Discord.WebhookClient(webhooks["webhookID"], webhooks["webhookToken"]);

const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://${tokens.mongoUsername}:${encodeURIComponent(tokens.mongoPass)}@tetracyl-unhxi.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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

                    setInterval(() => {
                        this.client.user.setActivity(`ear help | ${totalGuilds} servers`);
                    }, 1800000);

                    const embed = new Discord.MessageEmbed()
                        .setAuthor("CoronaCord", this.client.settings.avatar)
                        .setColor(colors.main)
                        .setDescription(`Coronacord is online.`)
                        .addField("Shards", `**${this.client.shard.count}** shards`, true)
                        .addField("Servers", `**${totalGuilds}** servers`, true)
                        .setTimestamp()
                        .setFooter(`${totalMembers} users`)

                    webhookClient.send({
                        username: 'Coronacord',
                        avatarURL: this.client.settings.avatar,
                        embeds: [embed],
                    });
                });
        }
    }
}

