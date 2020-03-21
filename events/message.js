const fs = require("fs");
const Discord = require("discord.js");
const cooldowns = new Discord.Collection();
const Event = require("../structures/Event");
const colors = require("../data/colors.json");

const { webhooks } = require("../tokens.json");
const webhookClient = new Discord.WebhookClient(webhooks["messageID"], webhooks["messageToken"]);

module.exports = class Message extends Event {
  constructor (...args) {
    super(...args);
  }

  async run (message) {

    if (message.author.bot) return;
    if (message.channel.type === "text") {
      if (!message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;
    }

    const mPrefix = new RegExp(`^<@!?${this.client.user.id}> `);
    const fPrefix = message.content.match(mPrefix) ? message.content.match(mPrefix)[0] : this.client.settings.prefix;
    if (message.content.toLowerCase().indexOf(fPrefix) !== 0) return;
    const args = message.content.slice(fPrefix.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();
    const cmd = this.client.commands.get(command) || this.client.commands.find(c => c.aliases && c.aliases.includes(command));
    if (!cmd) {
      if (fs.existsSync(`./commands/${command}.js`)) {
        try {
          const commandFile = require(`./commands/${command}.js`);
          if (commandFile) commandFile.run(this.client, message, args);
        } catch (error) {
          console.error(error);
          message.reply("There was an error trying to execute that command!");
        }
      }
      return;
    }

    if (cmd && !message.guild && cmd.guildOnly) return message.channel.send("I can't execute that command inside DMs!. Please run this command in a server.");
    if (cmd && !args.length && cmd.args === true) return message.channel.send(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`${fPrefix}${cmd.name} ${cmd.usage}\``);

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = cmd.cooldown * 100;

    console.log(`${cmd.name} used by ${message.author.tag} (${message.author.id}) from ${message.guild.name} (${message.guild.id})`);
    const embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
      .setColor(colors.main)
      .setDescription(`**${cmd.name}** command used by **${message.author.tag}** (${message.author.id})`)
      .setFooter(`${message.guild.name} (${message.guild.id})`, message.guild.iconURL())
      .setTimestamp();

    webhookClient.send({
      username: "CoronaCord",
      avatarURL: this.client.settings.avatar,
      embeds: [embed],
    });

    if (!timestamps.has(message.author.id)) {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`);
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
      // let random = Math.floor(Math.random() * 5); 
      // if(random == 1) {
      //   this.client.dbl.hasVoted(message.author.id).then(voted => {
      //       if(!voted){
      //         const embed = new Discord.MessageEmbed()
      //         .setDescription(`Enjoying the bot? Vote for it here (it only takes a few seconds!): https://top.gg/bot/685159987638435861`)
      //         .setFooter(`Voting will remove this message.`)
      //         .setColor(colors.main)
      //         message.channel.send(embed);
      //       }
      //   });
      // }
      await cmd.execute(this.client, message, args);
    } catch (e) {
      console.error(e);
      message.reply("There was an error trying to execute that command!");
    }
  }
};