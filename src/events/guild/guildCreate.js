const Discord = require('discord.js');
const moment = require('moment');
const Event = require('../../structures/Event');

const webhookClient = new Discord.WebhookClient(process.env.GUILD_WEBHOOK_ID, process.env.GUILD_WEBHOOK_TOKEN);

module.exports = class GuildCreate extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(guild) {

    const embed = new Discord.MessageEmbed()
      .setAuthor(`Coronacord | Guild ID: ${guild.id}`, this.client.user.displayAvatarURL())
      .setColor(this.client.colors.online)
      .setThumbnail(guild.iconURL())
      .setDescription('Coronacord has been **ADDED** to a server.')
      .addField('Guild', `${guild.name}`, true)
      .addField('Users', `${guild.memberCount}`, true)
      .addField('Owner', `${guild.owner.user.username}`, true)
      .addField('Region', `${guild.region}`, true)
      .setFooter(`Created On - ${moment(guild.createdAt).format('LLLL')}`, guild.iconURL())
      .setTimestamp();

    webhookClient.send({
      username: 'Coronacord',
      avatarURL: this.client.settings.avatar,
      embeds: [embed],
    });
  }
};