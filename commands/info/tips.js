/* eslint-disable no-unused-vars */
const Discord = require("discord.js");

module.exports = {
  name: "tips",
  description: "Displays tips for avoiding the coronavirus.",
  async execute (client, message, args) {
    const embed = new Discord.MessageEmbed()
      .setAuthor("Tips from the World Health Organization", client.settings.avatar)
      .setDescription(`
      - Wash your hands frequently.
      - Avoid touching your face.
      - Sneeze and cough into a tissue or your elbow.
      - Avoid crowds and standing near others.
      - Stay home if you think you might be sick.
      - If you have a fever, cough, or difficulty breathing, follow advice given by your government's health authority`)
      .setFooter("More information can be found on the CDC website: https://www.cdc.gov/coronavirus/2019-ncov/index.html")
      .setColor(client.colors.main);
    message.channel.send(embed);
  },
};
