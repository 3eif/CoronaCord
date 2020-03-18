const Discord = require("discord.js"); // eslint-disable-line no-unused-vars

module.exports = {
  name: "reload",
  description: "Reloads a command",
  args: true,
  usage: "<command>",
  permissions: "dev",
  async execute (client, message, args) {
    if (!client.settings.devs.includes(message.author.id)) return;

    const commandName = args[0].toLowerCase();
    const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
      return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
    }

    delete require.cache[require.resolve(`./${commandName}.js`)];

    try {
      const newCommand = require(`./${commandName}.js`);
      message.client.commands.set(newCommand.name, newCommand);
    } catch (error) {
      console.log(error);
      return message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
    }
    message.channel.send(`Command \`${commandName}\` was reloaded!`);
  },
};