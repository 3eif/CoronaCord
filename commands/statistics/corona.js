/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const countriesJSON = require("../../data/countries.json");
const { NovelCovid } = require("novelcovid");
const fetch = require("node-fetch");

Object.defineProperty(String.prototype, "toProperCase", {
  value: function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
});

module.exports = {
  name: "corona",
  description: "Shows stats about the corona virus.",
  usage: "[country]",
  async execute (client, message, args) {
    const track = new NovelCovid();

    if (!args[0]) {
      const stats = await track.all();
      const countryStats = await track.countries();
      var todayDeaths = 0;
      var todayCases = 0;
      countryStats.forEach(country => { todayDeaths += country.todayDeaths; todayCases += country.todayCases; });
      const activeCases = stats.cases - stats.deaths - stats.recovered;

      const updatedTime = new Date(stats.updated);

      const embed = new Discord.MessageEmbed()
        .setAuthor("Coronavirus Stats", client.settings.avatar)
        .addField("Confirmed Cases", `**${stats.cases.toLocaleString()}**`, true)
        .addField("Today Cases", `+${todayCases.toLocaleString()}`, true)
        .addField("Today Deaths", `+${todayDeaths.toLocaleString()}`, true)
        .addField("Active", `${activeCases.toLocaleString()} (${((activeCases / stats.cases) * 100).toFixed(2)}%)`, true)
        .addField("Recovered", `${stats.recovered.toLocaleString()} (${((stats.recovered / stats.cases) * 100).toFixed(2)}%)`, true)
        .addField("Deaths", `${stats.deaths.toLocaleString()} (${((stats.deaths / stats.cases) * 100).toFixed(2)}%)`, true)
        .addField("Tests", `${stats.tests.toLocaleString()}`, true)
        .addField("Cases Per Mil", `${stats.casesPerOneMillion.toLocaleString()}`, true)
        .addField("Deaths Per Mil", `${stats.deathsPerOneMillion.toLocaleString()}`, true)
        .setImage("https://xtrading.io/static/layouts/qK98Z47ptC-embed.png")
        .setColor(client.colors.main)
        .setFooter(`Last Updated: ${updatedTime}`);
      message.channel.send(embed);
    } else {
      let countryInput = args.join(" ").toProperCase();
      if (countryInput.toLowerCase() == "netherlands") countryInput = "nl";

      var country = await track.countries(countryInput);
      if (!country) return message.channel.send("I couldn't find that country. That country either doesn't exist, was typed incorrectly or has no confirmed cases. For a list of supported country names please type `c.countries`");

      var wikiName;
      const wikiAliases = {
        "S. Korea": "South Korea",
        "UK": "United Kingdom",
        "USA": "United States"
      };
  
      const thePrefixedContries = ["United States", "Netherlands"];

      if (wikiAliases[country.country]) {
        wikiName = wikiAliases[country.country];
      } else {
        wikiName = country.country;
      }

      const WikiPage = await fetch(`https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${thePrefixedContries.includes(wikiName) ? "the_" : ""}${wikiName.replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_")}`).then(res => res.text());
      const ImageRegex = /<meta property="og:image" content="([^<]*)"\/>/;
      const ImageLink = ImageRegex.exec(WikiPage);
      var imageLink;
      if (ImageLink) imageLink = ImageLink[1];
      if (countryInput.toLowerCase() == "uk") imageLink = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/COVID-19_outbreak_UK_case_counts.svg/640px-COVID-19_outbreak_UK_case_counts.svg.png";
  
      const updatedTime = new Date(country.updated);

      const embed = new Discord.MessageEmbed()
        .setAuthor(country.country)
        .addField("Confirmed Cases", `**${country.cases.toLocaleString()}**`, true)
        .addField("Today Cases", `+${country.todayCases.toLocaleString()}`, true)
        .addField("Today Deaths", `+${country.todayDeaths.toLocaleString()}`, true)
        .addField("Active", `${country.active.toLocaleString()} (${((country.active / country.cases) * 100).toFixed(2)}%)`, true)
        .addField("Recovered", `${country.recovered.toLocaleString()} (${((country.recovered / country.cases) * 100).toFixed(2)}%)`, true)
        .addField("Deaths", `${country.deaths.toLocaleString()} (${((country.deaths / country.cases) * 100).toFixed(2)}%)`, true)
        .addField("Tests", `${country.tests.toLocaleString()}`, true)
        .addField("Cases Per Mil", `${country.casesPerOneMillion.toLocaleString()}`, true)
        .addField("Deaths Per Mil", `${country.deathsPerOneMillion.toLocaleString()}`, true)
        .setThumbnail(`https://www.countryflags.io/${require("../../data/countries_abbreviations.json")[country.country]}/flat/64.png`)
        .setColor(client.colors.main)
        .setFooter(`Last Updated: ${updatedTime}`);
      if (imageLink) embed.setImage(imageLink);
      message.channel.send(embed);
    }
  },
};
