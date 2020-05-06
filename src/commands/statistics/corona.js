/* eslint-disable quotes */
const Discord = require('discord.js');
const covid = require('covidtracker');
const fetch = require('node-fetch');

Object.defineProperty(String.prototype, 'toProperCase', {
  value: function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  },
});

const Command = require('../../structures/Command');

module.exports = class Corona extends Command {
  constructor(client) {
    super(client, {
      name: 'corona',
      description: 'Shows stats about the corona virus.',
      usage: '[country]',
    });
  }
  async run(client, message, args) {
    if (!args[0]) {
      const totalStats = await covid.getAll();

      const updatedTime = new Date(totalStats.updated);

      const embed = new Discord.MessageEmbed()
        .setAuthor('Coronavirus Stats', client.settings.avatar)
        .addField('Confirmed Cases', `**${totalStats.cases.toLocaleString()}**`, true)
        .addField('Today Cases', `+${totalStats.todayCases.toLocaleString()}`, true)
        .addField('Today Deaths', `+${totalStats.todayDeaths.toLocaleString()}`, true)
        .addField('Active', `${totalStats.active.toLocaleString()} (${((totalStats.active / totalStats.cases) * 100).toFixed(2)}%)`, true)
        .addField('Recovered', `${totalStats.recovered.toLocaleString()} (${((totalStats.recovered / totalStats.cases) * 100).toFixed(2)}%)`, true)
        .addField('Deaths', `${totalStats.deaths.toLocaleString()} (${((totalStats.deaths / totalStats.cases) * 100).toFixed(2)}%)`, true)
        .addField('Tests', `${totalStats.tests.toLocaleString()}`, true)
        .addField('Cases Per Mil', `${totalStats.casesPerOneMillion.toLocaleString()}`, true)
        .addField('Deaths Per Mil', `${totalStats.deathsPerOneMillion.toLocaleString()}`, true)
        .setImage(`https://xtrading.io/static/layouts/qK98Z47ptC-embed.png?newest=${Date.now()}`)
        .setColor(client.colors.main)
        .setFooter(`Last Updated: ${updatedTime}`);
      message.channel.send(embed);
    }
    else {
      let countryInput = args.join(' ').toProperCase();
      if (countryInput.toLowerCase() == 'netherlands') countryInput = 'nl';
      if (countryInput.toLowerCase() == 'laos') countryInput = 'Lao People\'s Democratic Republic';
      const country = await covid.getCountry({ country: countryInput });
      if (!country) return message.channel.send('I couldn\'t find that country. That country either doesn\'t exist, was typed incorrectly or has no confirmed cases. For a list of supported country names please type `c.countries`');

      let wikiName;
      const wikiAliases = {
        'S. Korea': 'South Korea',
        'UK': 'United Kingdom',
        'USA': 'United States',
      };

      const thePrefixedContries = ['United States', 'Netherlands'];

      if (wikiAliases[country.country]) {
        wikiName = wikiAliases[country.country];
      }
      else {
        wikiName = country.country;
      }

      let wikiImage = '';
      if (country.country == 'USA') {
        wikiImage = `https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/COVID-19_Outbreak_Cases_in_the_United_States_%28Density%29.svg/640px-COVID-19_Outbreak_Cases_in_the_United_States_%28Density%29.svg.png?1588686006705?newest=${Date.now()}`;
      }
      else {
        const WikiPage = await fetch(`https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${thePrefixedContries.includes(wikiName) ? "the_" : ""}${wikiName.replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_")}`).then(res => res.text());
        const ImageRegex = /<meta property="og:image" content="([^<]*)"\/>/;
        const ImageLink = ImageRegex.exec(WikiPage);
        let imageLink;
        if (ImageLink) imageLink = ImageLink[1];
        if (imageLink) imageLink += `?newest=${Date.now()}`;
        wikiImage = imageLink;
      }

      const updatedTime = new Date(country.updated);

      const embed = new Discord.MessageEmbed()
        .setAuthor(country.country)
        .addField('Confirmed Cases', `**${country.cases.toLocaleString()}**`, true)
        .addField('Today Cases', `+${country.todayCases.toLocaleString()}`, true)
        .addField('Today Deaths', `+${country.todayDeaths.toLocaleString()}`, true)
        .addField('Active', `${country.active.toLocaleString()} (${((country.active / country.cases) * 100).toFixed(2)}%)`, true)
        .addField('Recovered', `${country.recovered.toLocaleString()} (${((country.recovered / country.cases) * 100).toFixed(2)}%)`, true)
        .addField('Deaths', `${country.deaths.toLocaleString()} (${((country.deaths / country.cases) * 100).toFixed(2)}%)`, true)
        .addField('Tests', `${country.tests.toLocaleString()}`, true)
        .addField('Cases Per Mil', `${country.casesPerOneMillion.toLocaleString()}`, true)
        .addField('Deaths Per Mil', `${country.deathsPerOneMillion.toLocaleString()}`, true)
        .setThumbnail(`https://www.countryflags.io/${require('../../../assets/json/countries_abbreviations.json')[country.country]}/flat/64.png`)
        .setColor(client.colors.main)
        .setFooter(`Last Updated: ${updatedTime}`);
      if (wikiImage) embed.setImage(wikiImage);
      message.channel.send(embed);
    }
  }
};
