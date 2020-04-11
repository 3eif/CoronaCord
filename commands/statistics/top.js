/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const { NovelCovid } = require("novelcovid");
const { post } = require("snekfetch");

module.exports = {
  name: "top",
  description: "Shows the top 10 countries with the most cases of coronavirus.",
  async execute (client, message, args) {
    const msg = await message.channel.send(`${client.emojiList.loading} Fetching top countries...`);

    const track = new NovelCovid();
    const countryStats = await track.countries(null, "cases");
    let topCountries = "";

    for (let i = 0; i < 10; i++) {
      const country = countryStats[i];
      topCountries += `${i+1}. **${country.country}**: ${country.cases} cases - ${country.deaths} deaths - ${country.recovered} recovered\n`;
    }

    const embed = new Discord.MessageEmbed()
      .setAuthor("Top 10 Countries with most cases of Coronavirus", client.settings.avatar)
      .setDescription(topCountries)
      .setColor(client.colors.main);
    msg.edit("", embed);
  },
};
