const {ShardingManager } = require("discord.js");
const { discordToken } = require("./tokens.json");
try {
  require("./dataset-schedule.json");
} catch (e) {
  require("fs").appendFileSync("dataset-schedule.json", JSON.stringify({}));
}
const DatasetSchedule = require("./dataset-schedule.json");
const DatasetModel = require("./models/datasets.js");
const fs = require("fs");
const novelcovid = require("coronacord-api-wrapper");
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

if (tokens.env !== "local") {
  baseOptions.totalShards = 10;
} else {
  baseOptions.totalShards = 2;
}

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

(async function () {
  if (!DatasetSchedule["lastImaged"]) {
    const allDatasets = await DatasetModel.find();
    if (!allDatasets[0]) {
      const countryData = await novelcovid.countries();
      const firstDocument = new DatasetModel({
        image: countryData,
        timestamp: Date.now(),
        year: new Date().getFullYear(),
        month: (new Date().getMonth() + 1),
        date: new Date().getDate()
      });
      await firstDocument.save().catch(console.log);
    } else {
      const data = {
        lastImaged: allDatasets[allDatasets.length - 1].timestamp
      };
      fs.writeFileSync("dataset-schedule.json", JSON.stringify(data));
    }
  } else {
    setTimeout(async () => {
      const countryData = await novelcovid.countries();
      const doc = new DatasetModel({
        image: countryData,
        timestamp: Date.now(),
        year: new Date().getFullYear(),
        month: (new Date().getMonth() + 1),
        date: new Date().getDate()
      });
      await doc.save().catch(console.log);
      fs.writeFileSync("dataset-schedule.json", JSON.stringify({ lastImaged: Date.now() }));

      setInterval(async () => {
        const countryData = await novelcovid.countries();
        const document = new DatasetModel({
          image: countryData,
          timestamp: Date.now(),
          year: new Date().getFullYear(),
          month: (new Date().getMonth() + 1),
          date: new Date().getDate()
        });
        await document.save().catch(console.log);
        fs.writeFileSync("dataset-schedule.json", JSON.stringify({ lastImaged: Date.now() }));
      }, 86400000);
    }, ((DatasetSchedule["lastImaged"] + 86400000) - Date.now()));
  }
}());
