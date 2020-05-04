const Discord = require('discord.js');
const { NovelCovid } = require('novelcovid');
const fetch = require('node-fetch');
const Command = require('../../structures/Command');

module.exports = class Country extends Command {
  constructor(client) {
    super(client, {
      name: 'country',
      description: 'Shows stats about the corona virus in a specific country.',
      usage: '<country>',
      args: true,
    });
  }
  async run(client, message, args) {
    const track = new NovelCovid();
    let countryInput = args.join(' ').toProperCase();
    if (countryInput.toLowerCase() == 'netherlands') countryInput = 'nl';
    if (countryInput.toLowerCase() == 'laos') countryInput = 'Lao People\'s Democratic Republic';
    const country = await track.countries(countryInput);
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

    const WikiPage = await fetch(`https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${thePrefixedContries.includes(wikiName) ? 'the_' : ''}${wikiName.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_')}`).then(res => res.text());
    const ImageRegex = /<meta property="og:image" content="([^<]*)"\/>/;
    const ImageLink = ImageRegex.exec(WikiPage);
    let imageLink;
    if (ImageLink) imageLink = ImageLink[1];
    if (countryInput.toLowerCase() == 'uk') imageLink = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/COVID-19_outbreak_UK_case_counts.svg/640px-COVID-19_outbreak_UK_case_counts.svg.png';
    if (imageLink) imageLink += `?newest=${Date.now()}`;

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
    if (imageLink) embed.setImage(imageLink);
    message.channel.send(embed);
  }
};