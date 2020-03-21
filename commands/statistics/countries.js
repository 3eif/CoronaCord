/* eslint-disable no-unused-vars */
const Discord = require("discord.js");

module.exports = {
  name: "countries",
  description: "Shows a list of supported countries and country names.",
  async execute (client, message, args) {
    const embed = new Discord.MessageEmbed()
      .setAuthor("Supported Countries", client.settings.avatar)
      .setTitle("All supported countries and names can be found here")
      .setURL("https://www.worldometers.info/coronavirus/#countries")
      .setColor(client.colors.main);
    message.channel.send(embed);
  },
};
