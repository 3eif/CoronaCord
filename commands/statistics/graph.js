/* eslint-disable no-unused-vars */
const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const countriesJSON = require("../../data/countries.json");
const novelcovid = require("coronacord-api-wrapper");
const Datasets = require("../../models/datasets.js");
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

    var countryRecords = allDatasets.map(dataset => ({ date: dataset.date, year: dataset.year, month: dataset.month, data: dataset.image.filter(img => img.country === name)[0] }));
    countryRecords = countryRecords.filter(record => record.data !== undefined);
    const width = 1000;
    const height = 500;

    const Canvas = new CanvasRenderService(width, height, (ChartJS) => {
      ChartJS.plugins.register({
        beforeDraw: (chart, options) => { // eslint-disable-line no-unused-vars
          chart.ctx.fillStyle = "rgb(47,49,54)";
          chart.ctx.fillRect(0, 0, width, height);
        }
      });
    });

    const cases = countryRecords.map(record => record.data.cases);
    const deaths = countryRecords.map(record => record.data.deaths);
    const recovers = countryRecords.map(record => record.data.recovered);

    const ChartBuffer = await Canvas.renderToBuffer({
      type: "line",
      data: {
        labels: countryRecords.map(record => `${record.date < 10 ? "0" : ""}${record.date}/${record.month < 10 ? "0" : ""}${record.month}`),
        datasets: [
          {
            label: "Confirmed",
            borderColor: client.colors.confirmed,
            backgroundColor: "#540660",
            data: cases
          },
          {
            label: "Infected",
            borderColor: client.colors.infected,
            //backgroundColor: "rgba(255,127,80,0.2)",
            backgroundColor: "rgba(0,0,0,0)",
            data: cases.map((record, index) => {
              return record - deaths[index] - recovers[index];
            })
          },
          {
            label: "Deaths",
            borderColor: client.colors.deaths,
            //backgroundColor: "rgba(0,0,0,0.1)",
            backgroundColor: "rgba(0,0,0,0)",
            data: deaths
          },
          {
            label: "Recovered",
            borderColor: client.colors.recovered,
            //backgroundColor: "rgba(0,255,127,0.2)",
            backgroundColor: "rgba(0,0,0,0)",
            data: recovers
          }
        ]
      }, options: {
        title: {
          display: true,
          text: name,
          fontColor: "white",
          fontSize: 25
        },
        legend: {
          labels: {
            fontColor: "white"
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: "white"
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: "white"
            }
          }]
        }
      }
    });

    // eslint-disable-next-line no-unused-vars
    const attachment = new Discord.MessageAttachment(ChartBuffer, "chart.png");

    const embed = new Discord.MessageEmbed()
      .attachFiles([attachment])
      .setColor(client.colors.main)
      .setImage("attachment://chart.png")
      .setTimestamp();
    message.channel.send(embed);
  }
};
