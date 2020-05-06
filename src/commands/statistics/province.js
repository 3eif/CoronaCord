/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const statesJson = require('../../../assets/json/states.json');
const covid = require('covidtracker');
const fetch = require('node-fetch');
const Command = require('../../structures/Command');

module.exports = class State extends Command {
  constructor(client) {
    super(client, {
      name: 'province',
      description: 'Shows stats about the corona virus in a region/province/state.',
      usage: '<country> <province>',
      args: true,
    });
  }
  async run(client, message, args) {
    if(!args[0] || !args[1]) return message.channel.send('You must provide a country name and province name.\nUsage example: `c.province <country> <province>`');

    const country = args[0].toProperCase();
    const province = args[1].toProperCase();

    const prov = await covid.getJHU({ country, province });
    const obj = prov[0];

    if (!obj) return message.channel.send('I couldn\'t find that province. That province either doesn\'t exist or was typed incorrectly.\nUsage example: `c.province <country> <province>`');

    const embed = new Discord.MessageEmbed()
      .setAuthor(`${obj.province}, ${obj.country}`)
      .addField('Confirmed Cases', `**${obj.stats.confirmed.toLocaleString()}**`, true)
      .addField('Deaths', `${obj.stats.deaths.toLocaleString()} (${((obj.stats.deaths / obj.stats.confirmed) * 100).toFixed(2)}%)`, true)
      .addField('Recovered', `${obj.stats.recovered.toLocaleString()} (${((obj.stats.recovered / obj.stats.confirmed) * 100).toFixed(2)}%)`, true)
      .setColor(client.colors.main)
      .setFooter(`Last Updated: ${obj.updatedAt}`);
    message.channel.send(embed);
  }
};