const {ShardingManager } = require("discord.js");
const { discordToken } = require("./tokens.json");
try {
  require("./dataset-schedule.json");
} catch (e) {
  require("fs").appendFileSync("dataset-schedule.json", JSON.stringify({}));
}

const mongoose = require("mongoose");
const tokens = require("./tokens.json");

mongoose.connect(`mongodb://${tokens.mongoIP}:${tokens.mongoPort}/coronacord`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var baseOptions = {
  token: discordToken,
  timeout: 999999
};

/* Fallback to gateway recommended amount
if (tokens.env !== "local") {
  baseOptions.totalShards = 11;
} else {
  baseOptions.totalShards = 2;
}
*/

const manager = new ShardingManager("./coronacord.js", baseOptions);

manager.on("launch", shard => {
  console.log(`Shard [${shard.id}] launched`);
  shard.on("death", () => console.log(`Shard [${shard.id}] died`))
    .on("ready", () => console.log(`Shard [${shard.id}] ready`))
    .on("disconnect", () => console.log(`Shard [${shard.id}] disconnected`))
    .on("reconnecting", () => console.log(`Shard [${shard.id}] reconnecting`));
});

manager.spawn().catch((err) => {
  console.log(err);
});

manager.on("launch", shard => console.log(`Launched shard ${shard.id}`));
manager.on("message", msg => console.log(`Message from shard: ${msg}`));