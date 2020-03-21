/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const colors = require("../data/colors.json");
const novelcovid = require("coronacord-api-wrapper");
const { post } = require("snekfetch");

module.exports = {
  name: "top",
  description: "Shows the top 10 countries with the most cases of coronavirus.",
  async execute (client, message, args) {
    const countryStats = await novelcovid.countries();
    let topCountries = "";

    for (let i = 0; i < 10; i++) {
      const country = countryStats[i];
      topCountries += `**${i+1}.** __${country.country}__: ${country.cases} cases - ${country.deaths} deaths - ${country.recovered} recovered\n`;
    }

    const embed = new Discord.MessageEmbed()
      .setAuthor("Top 10 Countries with most cases of Coronavirus", client.settings.avatar)
      .setDescription(topCountries)
      .setColor(colors.main);
    message.channel.send(embed);
  },
};
