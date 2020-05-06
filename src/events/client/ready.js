const Discord = require('discord.js');
const Event = require('../../structures/Event');
const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
const DBL = require('dblapi.js');

class Ready extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(client) { // eslint-disable-line no-unused-vars
    this.client.user.setActivity('c.help');
    this.client.users.cache = new Discord.Collection();
    await this.client.users.fetch('644977600057573389');
    setInterval(async () => {
      await this.client.users.fetch('644977600057573389');
      this.client.users.cache = new Discord.Collection();

      this.client.guilds.cache.forEach(guild => {
        this.client.guilds.cache.get(guild.id).emojis.cahe = new Discord.Collection();
        this.client.guilds.cache.get(guild.id).members.cache = new Discord.Collection();
        this.client.guilds.cache.get(guild.id).voiceStates.cache = new Discord.Collection();
      });
    }, 60000);
    if (this.client.shard.ids == this.client.shard.count - 1) {
      const promises = [
        this.client.shard.fetchClientValues('guilds.cache.size'),
        this.client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
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
            .setAuthor('CoronaCord', this.client.settings.avatar)
            .setColor(this.client.colors.main)
            .setDescription('CoronaCord is online.')
            .addField('Shards', `**${this.client.shard.count}** shards`, true)
            .addField('Servers', `**${totalGuilds}** servers`, true)
            .setTimestamp()
            .setFooter(`${totalMembers} users`);

          if (this.client.user.id == '644977600057573389') {
            webhookClient.send({
              username: 'CoronaCord',
              avatarURL: this.client.settings.avatar,
              embeds: [embed],
            });

            this.client.dbl = new DBL(process.env.DBL_TOKEN, { webhookPort: process.env.DBL_PORT, webhookAuth: process.env.DBL_PASSWORD }, this.client);
            this.client.dbl.postStats(totalGuilds, this.client.shard.id, this.client.shard.count);
          }
        });
    }
  }
}

module.exports = Ready;
