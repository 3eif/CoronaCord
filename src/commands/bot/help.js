const Discord = require('discord.js');
const fs = require('fs');
const categories = fs.readdirSync('./commands/');
const Command = require('../../structures/Command');

module.exports = class Countries extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      description: 'Sends you a dm of detailed list of Coronacord\'s commands.',
      aliases: ['commands', 'list'],
      cooldown: '30',
      usage: '[command name]',
    });
  }
  async run(client, message, args) {
    const msg = await message.channel.send(`${client.emojiList.typing} Sending a list of my commands...`);

    const { commands } = message.client;
    const data = [];

    const embed = new Discord.MessageEmbed()
      .setAuthor('Commands', client.settings.avatar)
      .setDescription(`Join the [support server](${client.settings.server}) for more help`)
      .setFooter(`For more information: ${client.settings.prefix}help <command>`)
      .setColor(client.colors.main);

    if (!args.length) {

      categories.forEach(async (category) => {
        if (category == 'dev') return;

        const helpCommands = [];
        let categoryCommands = '';
        const commandsFile = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));

        for (let i = 0; i < commandsFile.length; i++) {
          const commandName = commandsFile[i].split('.')[0];
          helpCommands.push(`\`${commandName}\`,  `);
        }

        for (let i = 0; i < helpCommands.length; i++) categoryCommands += helpCommands[i];
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        embed.addField(`${categoryName} (${commandsFile.length})`, categoryCommands);
      });

      await msg.edit('', embed);

    }
    else {

      if (!commands.has(args[0])) {
        return message.reply('That\'s not a valid command!');
      }
      const command = commands.get(args[0]);

      data.push(`**Name:** ${command.name}`);

      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
      if (command.usage) data.push(`**Usage:** \`${client.settings.prefix}${command.name} ${command.usage}\``);

      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

      msg.delete();
      message.channel.send(data, { split: true });
    }
  }
};