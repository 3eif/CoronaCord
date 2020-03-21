const Discord = require("discord.js");
const countriesJSON = require("../../data/countries.json");
const novelcovid = require("coronacord-api-wrapper");
const fetch = require("node-fetch");

module.exports = {
  name: "country",
  description: "Shows stats about the corona virus in a specific country.",
  usage: "<country>",
  args: true,
  async execute (client, message, args) {
    const countryInput = args.join(" ").toProperCase();
    var countries = await novelcovid.countries();
    const objCountries = {};
    countries.forEach(c => objCountries[c.country] = c);
    countries = objCountries;
    var name;
    if (countriesJSON[args[0].toUpperCase().trim()]) {
      name = countriesJSON[args[0].toUpperCase().trim()];
    } else {
      name = countryInput;
    }
    if (!countries[name]) return message.channel.send("I couldn't find that country. That country either doesn't exist or was typed incorrectly. For a list of supported country names please type `c.countries`");
    const country = countries[name];
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
  
    var embed = new Discord.MessageEmbed()
      .setAuthor(country.country)
      .setDescription(`**${country.cases.toLocaleString()} Confirmed Cases**`)
      .addField("Today Cases", `${country.todayCases.toLocaleString()} Cases`, true)
      .addField("Today Deaths", `${country.todayDeaths.toLocaleString()} Deaths`, true)
      .addField("Recovered", `${country.recovered.toLocaleString()} (${((country.recovered / country.cases) * 100).toFixed(2)}%) Recovered`)
      .addField("Deaths", `${country.deaths.toLocaleString()} (${((country.deaths / country.cases) * 100).toFixed(2)}%) Deaths`, true)
      .setThumbnail(`https://www.countryflags.io/${require("../../data/countries_abbreviations.json")[country.country]}/flat/64.png`)
      .setColor(client.colors.main)
      .setFooter("View the graph of cases for this country by typing `c.graph`.")
      .setTimestamp();
    if (imageLink) embed.setImage(imageLink);
    message.channel.send(embed);
  },
};
