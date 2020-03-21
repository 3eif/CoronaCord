/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const statesJson = require("../../data/states.json");
const novelcovid = require("coronacord-api-wrapper");
const fetch = require("node-fetch");

module.exports = {
  name: "state",
  description: "Shows stats about the corona virus in a US state.",
  usage: "<state>",
  args: true,
  async execute (client, message, args) {

    const stateInput = args.join(" ").toProperCase();
    var states = await novelcovid.states();
    const objStates = {};
    states.forEach(s => objStates[s.state] = s);
    states = objStates;
    var name;
    if (statesJson[args[0].toUpperCase().trim()]) {
      name = statesJson[args[0].toUpperCase().trim()];
    } else {
      name = stateInput;
    }
    if (!states[name]) return message.channel.send("I couldn't find that state. That state either doesn't exist or was typed incorrectly.");
    const state = states[name];

    var wikiName;
    wikiName = state.state;

    const WikiPage = await fetch(`https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${wikiName.replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_")}`).then(res => res.text());
    const ImageRegex = /<meta property="og:image" content="([^<]*)"\/>/;
    const ImageLink = ImageRegex.exec(WikiPage);
    var imageLink;
    if (ImageLink) imageLink = ImageLink[1];

    let flagURL = "";
    for (let i = 0; i < statesJson.length; i++) {
      if (state.state == statesJson[i].state) flagURL = statesJson[i].state_flag_url;
    }

    var embed = new Discord.MessageEmbed()
      .setAuthor(state.state)
      .addField("Confirmed Cases", `**${state.cases.toLocaleString()}**`, true)
      .addField("Today Cases", `${state.todayCases.toLocaleString()}`, true)
      .addField("Today Deaths", `${state.todayDeaths.toLocaleString()}`, true)
      .addField("Active", `${state.active.toLocaleString()} (${((state.active / state.cases) * 100).toFixed(2)}%)`, true)
      .addField("Recovered", `${state.recovered.toLocaleString()} (${((state.recovered / state.cases) * 100).toFixed(2)}%)`, true)
      .addField("Deaths", `${state.deaths.toLocaleString()} (${((state.deaths / state.cases) * 100).toFixed(2)}%)`, true)
      .setThumbnail(flagURL)
      .setColor(client.colors.main)
      .setTimestamp();
    if (imageLink) embed.setImage(imageLink);
    message.channel.send(embed);
  },
};
