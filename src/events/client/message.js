/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
const Event = require('../../structures/Event');
const webhookClient = new Discord.WebhookClient(process.env.MESSAGE_WEBHOOK_ID, process.env.MESSAGE_WEBHOOK_TOKEN);

module.exports = class Message extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(message) {
    if (message.author.bot) return;
    if (message.channel.type === 'text') {
      if (!message.guild.members.cache.get(this.client.user.id)) await message.guild.members.fetch(this.client.user.id);
      if (!message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;
    }

    if (!message.channel.guild) return message.channel.send('I can\'t execute commands inside DMs! Please run this command in a server.');
    const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    let prefix;

    const messageContent = message.content.toLowerCase();
    if (messageContent.indexOf(this.client.settings.prefix) === 0) {
      prefix = this.client.settings.prefix;
    }
    else if (messageContent.split(' ')[0].match(mentionPrefix)) {
      prefix = mentionPrefix;
    }
    else {
      return;
    }

    let command;
    const args = messageContent.split(' ');

    command = args.shift().toLowerCase();
    command = command.slice(this.client.settings.prefix.length);

    const cmd = this.client.commands.get(command) || this.client.commands.find(c => c.aliases && c.aliases.includes(command));
    if (!cmd) return;

    console.log(`[Shard #${this.client.shard.ids}] ${cmd.name} used by ${message.author.tag} (${message.author.id}) from ${message.guild.name} (${message.guild.id})`);
    const embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
      .setColor(this.client.colors.main)
      .setDescription(`[Shard #${this.client.shard.ids}] **${cmd.name}** command used by **${message.author.tag}** (${message.author.id})`)
      .setFooter(`${message.guild.name} (${message.guild.id})`, message.guild.iconURL())
      .setTimestamp();

    webhookClient.send({
      username: 'CoronaCord',
      avatarURL: this.client.settings.avatar,
      embeds: [embed],
    });

    if (!cooldowns.has(cmd.name)) {
      cooldowns.set(cmd.name, new Discord.Collection());
    }

    if (cmd.permission === 'dev' && !this.client.settings.devs.includes(message.author.id)) return;

    if (cmd && !message.guild && cmd.guildOnly) return message.channel.send('I can\'t execute that command inside DMs!. Please run this command in a server.');

    if (!this.client.settings.devs.includes(message.author.id)) {
      if (!cooldowns.has(cmd.name)) {
        cooldowns.set(cmd.name, new Discord.Collection());
      }
      const now = Date.now();
      const timestamps = cooldowns.get(cmd.name);
      const cooldownAmount = (cmd.cooldown || 5) * 1000;
      if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
      else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`);
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
    }

    if (prefix == this.client.settings.prefix) {
      if (cmd && !args[0] && cmd.args === true) return message.channel.send(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`c.${cmd.name} ${cmd.usage}\``);
    }
    else if (cmd && !args[0] && cmd.args === true) {
      return message.channel.send(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`${prefix} ${cmd.name} ${cmd.usage}\` or \`${prefix}${cmd.name} ${cmd.usage}\``);
    }

    try {
      cmd.run(this.client, message, args);
    }
    catch (e) {
      console.error(e);
      message.reply('There was an error trying to execute that command!');
    }
  }
};
