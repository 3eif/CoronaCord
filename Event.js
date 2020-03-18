class Event {

  constructor (client, file, options = {}) {
    this.client = client;
    this.name = options.name || file.name;
    this.file = file;
  }
  
  async _run (...args) {
    try {
      await this.run(...args);
    } catch (err) {
      console.error(err);
    }
  }
  
  reload () {
    const path = `../events/${this.name}.js`;
    delete require.cache[path];
    require(`../events/${this.name}.js`);
  }
}
  
module.exports = Event;