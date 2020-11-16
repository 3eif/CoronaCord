const { ShardingManager } = require('discord.js');
require('dotenv').config();

const baseOptions = {
  token: process.env.DISCORD_TOKEN,
  timeout: 999999,
};

const manager = new ShardingManager('./index/main.js', baseOptions);

manager.on('launch', shard => {
  console.log(`Shard [${shard.id}] launched`);
  shard.on('death', () => console.log(`Shard [${shard.id}] died`))
    .on('ready', () => console.log(`Shard [${shard.id}] ready`))
    .on('disconnect', () => console.log(`Shard [${shard.id}] disconnected`))
    .on('reconnecting', () => console.log(`Shard [${shard.id}] reconnecting`));
});

manager.spawn().catch((err) => {
  console.log(err);
});

manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));
manager.on('message', msg => console.log(`Message from shard: ${msg}`));
