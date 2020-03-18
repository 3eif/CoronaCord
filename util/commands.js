const fs = require("fs");
const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

module.exports = client => {
  try {
    const init = async () => {
      for (const file of commands) {
        const command = require(`../commands/${file}`);
        client.commands.set(command.name, command);
      }
      //console.log(`Loaded a total of ${commandNum} commands`);
    };
    init();
  } catch (error) {
    console.log(error);
  }
};