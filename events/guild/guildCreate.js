const Discord = require("discord.js");
const moment = require("moment");
const Event = require("../../structures/Event");
const colors = require("../../data/colors.json");
const { webhooks } = require("../../tokens.json");

const webhookClient = new Discord.WebhookClient(webhooks["guildID"], webhooks["guildToken"]);

module.exports = class GuildCreate extends Event {
  constructor (...args) {
    super(...args);
  }

  async run (guild) {

    const embed = new Discord.MessageEmbed()
      .setAuthor(`Coronacord | Guild ID: ${guild.id}`, this.client.user.displayAvatarURL())
      .setColor(colors.online)
      .setThumbnail(guild.iconURL())
      .setDescription("Coronacord has been **ADDED** to a server.")
      .addField("Guild", `${guild.name}`, true)
      .addField("Users", `${guild.memberCount}`, true)
      .addField("Owner", `${guild.owner.user.username}`, true)
      .addField("Region", `${guild.region}`, true)
      .setFooter(`Created On - ${moment(guild.createdAt).format("LLLL")}`, guild.iconURL())
      .setTimestamp();

    webhookClient.send({
      username: "Coronacord",
      avatarURL: this.client.settings.avatar,
      embeds: [embed],
    });

    //   const dbl = new DBL(config.dblToken, this.client)
    //   snekfetch.post(`https://discordbots.org/api/bots/472714545723342848/stats`)
    //   .set('Authorization', config.dblToken)
    //   .send({ server_count: require('util').inspect(guilds.reduce((prev, val) => prev + val, 0)), 
    //         shard_count: this.client.shard.count})
    //   .then(() => console.log(`Posted to dbl.`))
    //   .catch((e) => console.error(e));
  }
};