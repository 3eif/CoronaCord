/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const colors = require("../data/colors.json");
const novelcovid = require("coronacord-api-wrapper");
const { post } = require("snekfetch");

module.exports = {
  name: "countries",
  description: "Shows a list of supported countries and country names.",
  async execute (client, message, args) {
    const countryStats = await novelcovid.countries();
    let countries = "";
    countryStats.forEach(country => { countries += `${country.country}\n`; });

    const { body } = await post("https://www.hastebin.com/documents").send(countries);
    const embed = new Discord.MessageEmbed()
      .setAuthor("Supported Countries", client.settings.avatar)
      .setTitle("All supported countries and names can be found here")
      .setURL(`https://www.hastebin.com/${body.key}.js`)
      .setColor(colors.main);
    message.channel.send(embed);
  },
};
