/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const statesJson = require('../../../assets/json/states.json');
const covid = require('covidtracker');
const fetch = require('node-fetch');
const Command = require('../../structures/Command');

module.exports = class State extends Command {
  constructor(client) {
    super(client, {
      name: 'state',
      description: 'Shows stats about the corona virus in a US state.',
      usage: '<state>',
      args: true,
    });
  }
  async run(client, message, args) {
    const stateInput = args.join(' ').toProperCase();

    const state = await covid.getState({ state: stateInput });
    if (!state) return message.channel.send('I couldn\'t find that state. That state either doesn\'t exist or was typed incorrectly.');

    const wikiName = state.state;

    const WikiPage = await fetch(`https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${wikiName.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_')}`).then(res => res.text());
    const ImageRegex = /<meta property="og:image" content="([^<]*)"\/>/;
    const ImageLink = ImageRegex.exec(WikiPage);
    let imageLink;
    if (ImageLink) imageLink = ImageLink[1];

    let flagURL = '';
    for (let i = 0; i < statesJson.length; i++) {
      if (state.state == statesJson[i].state) flagURL = statesJson[i].state_flag_url;
    }

    const embed = new Discord.MessageEmbed()
      .setAuthor(state.state)
      .addField('Confirmed Cases', `**${state.cases.toLocaleString()}**`, true)
      .addField('Today Cases', `+${state.todayCases.toLocaleString()}`, true)
      .addField('Today Deaths', `+${state.todayDeaths.toLocaleString()}`, true)
      .addField('Active', `${state.active.toLocaleString()} (${((state.active / state.cases) * 100).toFixed(2)}%)`, true)
      .addField('Deaths', `${state.deaths.toLocaleString()} (${((state.deaths / state.cases) * 100).toFixed(2)}%)`, true)
      .addField('Tests', `${state.tests.toLocaleString()}`, true)
      .setThumbnail(flagURL)
      .setColor(client.colors.main);
    if (imageLink) embed.setImage(imageLink);
    message.channel.send(embed);
  }
};