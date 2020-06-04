/* eslint-disable no-unused-vars */
const Discord = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Symptoms extends Command {
  constructor(client) {
    super(client, {
      name: 'symptoms',
      description: 'Displays symptoms of the coronavirus.',
    });
  }
  async run(client, message) {
    const embed = new Discord.MessageEmbed()
      .setAuthor('Coronavirus Symptoms', client.settings.avatar)
      .attachFiles(['./assets/images/symptoms.PNG'])
      .setImage('attachment://symptoms.PNG')
      .setDescription(`
    - Symptoms: fever, cough, shortness of breath.
    - Complications: pneumonia, Acute respiratory distress syndrome (ARDS), kidney failure.
    - Risk Factors: age, serious underlying medical conditions (e.g. heart disease, diabetes, lung disease, etc).`)
      .setFooter('More information can be found on the CDC website: https://www.cdc.gov/coronavirus/2019-ncov/index.html')
      .setColor(client.colors.main);
    message.channel.send(embed);
  }
};