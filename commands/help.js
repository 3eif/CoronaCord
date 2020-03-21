const Discord = require ("discord.js");  // eslint-disable-line no-unused-vars
const { typing } = require("../data/emojis.json");

module.exports = {
  name: "help",
  description: "Sends you a dm of detailed list of Coronacord's commands.",
  aliases: ["commands", "list"],
  cooldown: "30",
  usage: "[command name]",
  async execute (client, message, args) {
      
    const msg = await message.channel.send(`${typing} Sending a list of my commands...`);

    const user = message.member;    
    const { commands } = message.client;
    const data = [];

    // Useless without the useless loop with is also useless: const helpCommands = [];

    if (!args.length) {      
      // Useless loop cause nothing below has an actual purpose: for (let i = 1; i < commandsFile.length; i++) {
      // Serves no purpose without line below which also servers no purpose: const c = commandsFile[i].split(".")[0];
      // Servers no purpose: const comInfo = commands.get(c);
      //if(comInfo.permission != "dev") helpCommands.push(`**${c}** - ${comInfo.description.toLowerCase()}`);
      // }

      const helpStr = 
`
**List of available commands**
Type \`${client.settings.prefix}<command>\` to use a command. 
To get more info on a specific command do \`${client.settings.prefix}help <command>\`

**corona** - sends statistics about the corona virus.
**corona [country]** - sends statistics about the corona virus in said country.
**countries** - shows a list of supported countries and country names.
**graph <country>** - displays a graph of the latest cases in a country.
**help** - sends you a dm of detailed list of coronacord's commands.
**invite** - sends the invite link for the bot.
**ping** - bot's latency.
**stats** - displays the bot's stats
**support** - sends the support server for the bot.

Need more help? Join the support server: ${client.settings.server}
`;

      try {
        await user.send(helpStr);
        msg.edit(`Sent you a dm with my commands <@${message.author.id}>!`);
      } catch (e) {
        return msg.edit(`Your dms are disabled  <@${message.author.id}>, here are my commands:
${helpStr}
          `);
      }
    } else {

      if (!commands.has(args[0])) {
        return message.reply("That's not a valid command!");
      }
      const command = commands.get(args[0]);

      data.push(`**Name:** ${command.name}`);

      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
      if (command.usage) data.push(`**Usage:** \`${client.settings.prefix}${command.name} ${command.usage}\``);

      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

      msg.delete();
      message.channel.send(data, { split: true });
    }
  },
};