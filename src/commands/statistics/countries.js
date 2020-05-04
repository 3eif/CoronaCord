const Discord = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class Countries extends Command {
	constructor(client) {
		super(client, {
      name: 'countries',
      description: 'Shows a list of supported countries and country names.',
		});
	}
	async run(client, message) {
    const embed = new Discord.MessageEmbed()
      .setAuthor('Supported Countries', client.settings.avatar)
      .setTitle('All supported countries and names can be found here')
      .setURL('https://www.worldometers.info/coronavirus/#countries')
      .setColor(client.colors.main);
    message.channel.send(embed);
	}
};