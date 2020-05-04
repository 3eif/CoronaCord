module.exports = class Command {
    constructor(client, options) {
      this.client = client;
      this.name = options.name;
      this.args = options.args || false;
      this.usage = options.usage || 'No usage provided';
      this.description = options.description || 'No description provided';
      this.aliases = options.aliases || 'N/A';
      this.cooldown = options.cooldown || 3;
      this.permission = options.permission || 'user';
    }
  };