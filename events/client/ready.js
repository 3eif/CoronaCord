const Discord = require("discord.js");
const Event = require("../../structures/Event");
const tokens = require("../../tokens.json");
const webhookClient = new Discord.WebhookClient(tokens.webhooks["webhookID"], tokens.webhooks["webhookToken"]);
const DBL = require("dblapi.js");

class Ready extends Event {
  constructor (...args) {
    super(...args);
  }

  async run (client) { // eslint-disable-line no-unused-vars
    console.log(this.client.users.cache.size);
    this.client.user.setActivity("c.help");
    this.client.users.cache = new Discord.Collection();
    setInterval(() => {
      this.client.users.cache = new Discord.Collection();
    }, 60000);
    if (this.client.shard.ids == this.client.shard.count - 1) {
      const promises = [
        this.client.shard.fetchClientValues("guilds.cache.size"),
        this.client.shard.broadcastEval("this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)"),
      ];

      return Promise.all(promises)
        .then(async results => {
          const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
          const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
          console.log(`Coronacord is online: ${this.client.shard.count} shards, ${totalGuilds} servers and ${totalMembers} members.`);

          setInterval(() => {
            this.client.user.setActivity(`c.help | ${totalGuilds} servers`);
          }, 1800000);

          const embed = new Discord.MessageEmbed()
            .setAuthor("CoronaCord", this.client.settings.avatar)
            .setColor(this.client.colors.main)
            .setDescription("CoronaCord is online.")
            .addField("Shards", `**${this.client.shard.count}** shards`, true)
            .addField("Servers", `**${totalGuilds}** servers`, true)
            .setTimestamp()
            .setFooter(`${totalMembers} users`);

          webhookClient.send({
            username: "CoronaCord",
            avatarURL: this.client.settings.avatar,
            embeds: [embed],
          });

          this.client.dbl = new DBL(tokens.dblToken, { webhookPort: 23758, webhookAuth: tokens.dblPassword }, this.client);
          this.client.dbl.postStats(totalGuilds, this.client.shard.id, this.client.shard.count);
        });
    }
  }
}

module.exports = Ready;
