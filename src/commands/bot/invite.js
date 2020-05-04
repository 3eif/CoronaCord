const Command = require('../../structures/Command');

module.exports = class Invite extends Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      description: 'Sends the invite link for the bot.',
    });
  }
  async run(client, message) {
    return message.channel.send('Here is my invite link: https://discordapp.com/oauth2/authorize?client_id=644977600057573389&scope=bot&permissions=289800');
  }
};