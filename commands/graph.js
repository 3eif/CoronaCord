const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const countriesJSON = require("../data/countries.json");
const novelcovid = require("coronacord-api-wrapper");
const Datasets = require("../models/datasets.js");
const { CanvasRenderService } = require("chartjs-node-canvas");

module.exports = {
  name: "graph",
  description: "Shows infection graph of a country.",
  usage: "<country>",
  async execute (client, message, args) { // eslint-disable-line no-unused-vars
    if (!args[0]) return message.channel.send("You need to specify a country name.");
    const countryInput = args.join(" ").toProperCase();
    var countries = await novelcovid.countries();
    const objCountries = {};
    countries.forEach(c => objCountries[c.country] = c);
    countries = objCountries;
    var name;
    if (countriesJSON[args[0].toUpperCase().trim()]) {
      name = countriesJSON[args[0].toUpperCase().trim()];
    } else {
      name = countryInput;
    }
    if (!countries[name]) return message.channel.send("Country not found.");

    const allDatasets = await Datasets.find();
    var countryRecords = allDatasets.map(dataset => ({ date: dataset.date, year: dataset.year, month:  dataset.month, data: dataset.image.filter(img => img.country === name)[0] }));
    countryRecords = countryRecords.filter(record => record.data !== undefined);
    const width = 800;
    const height = 200;

    const Canvas = new CanvasRenderService(width, height, (ChartJS) => {
      ChartJS.plugins.register({
        beforeDraw: (chart, options) => { // eslint-disable-line no-unused-vars
          chart.ctx.fillStyle = "#FFFFFF";
          chart.ctx.fillRect(0, 0, width, height);
        }
      });
    });

    const ChartBuffer = await Canvas.renderToBuffer({
      type: "line",
      data: {
        labels: countryRecords.map(record => `${record.date < 10 ? "0" : ""}${record.date}/${record.month < 10 ? "0" : ""}${record.month}`),
        datasets: [
          {
            label: "Confirmed",
            borderColor: "rgb(255,127,80)",
            backgroundColor: "rgba(255,127,80,0.2)",
            data: countryRecords.map(record => record.data.cases)
          },
          {
            label: "Dead",
            borderColor: "rgb(95,95,95)",
            backgroundColor: "rgba(95,95,95,0.2)",
            data: countryRecords.map(record => record.data.deaths)
          },
          {
            label: "Recovered",
            borderColor: "rgb(0,255,127)",
            backgroundColor: "rgba(0,255,127,0.3)",
            data: countryRecords.map(record => record.data.recovered)
          }
        ]
      }
    });

    const attachment = new Discord.MessageAttachment(ChartBuffer, "chart.png");
    message.channel.send(`Cases graph for **${countries[name].country}:**`, attachment);
  }
};