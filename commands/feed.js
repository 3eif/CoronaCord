const Discord = require("discord.js");
const servers = require("../models/server.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const sendFeed = require("../util/sendFeed.js");

module.exports = {
  name: "feed",
  description: "Configures the bot to post coronavirus updates every one hour.",
  usage: "<channel>",
  args: true,
  async execute (client, message, args) {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("You must have the `Manage Channels` permission to use this command.");

    let channel;
    if (message.mentions.channels.first() === undefined) {
      if (!isNaN(args[0])) channel = args[0];
      else return msg.edit("No channel detected.");
    } else {
      channel = message.mentions.channels.first().id;
    }

    const msg = await message.channel.send(`${emojis.loading} Setting up channel feed...`);

    servers.findOne({
      serverID: message.guild.id
    }, async (err, s) => {
      if (err) console.log(err);
      if (!s) {
        const newSever = new servers({
          serverID: message.guild.id,
          serverName: message.guild.name,
          prefix: client.settings.prefix,
          feed: [],
        });
        await newSever.save().catch(e => console.log(e));
      }

      if (s.feed.includes(channel)) return msg.edit("I am already configured to post updates here!");
      if (s.feed.length > 1) return msg.edit("You can only have a feed in one channel.");
      s.feed.push(channel);
      await s.save().catch(e => console.log(e));
      const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.guild.name}`, message.guild.iconURL())
        .setColor(colors.main)
        .setDescription(`I will now post coronavirus updates to ${args[0]} every hour.`)
        .setFooter(`Tip: You can disable the feed by running the command: ear feed ${args[0]}`);
      msg.edit("", embed);
      sendFeed(channel);
    });
  },
};