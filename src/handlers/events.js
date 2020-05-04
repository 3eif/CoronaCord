const fs = require('fs');
const eventFolders = fs.readdirSync('./events/');

module.exports = (client) => {
  eventFolders.forEach(async (eventFolder) => {
    const events = fs.readdirSync(`./events/${eventFolder}`);
    const jsevents = events.filter(c => c.split('.').pop() === 'js');
    for (let i = 0; i < jsevents.length; i++) {
      if (!events.length) throw Error('No event files found!');
      if (!jsevents.length) throw Error('No javascript event files found!');
      const file = require(`../../events/${eventFolder}/${jsevents[i]}`);
      const event = new file(client, file);
      // console.log(`Event loaded: ${event.name}`);
      if (typeof event.run !== 'function') throw Error(`No run function found in ${jsevents[i]}`);
      const name = jsevents[i].split('.')[0];
      client.on(name, (...args) => event.run(...args));
    }
  });
};
