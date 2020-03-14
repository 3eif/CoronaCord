const covidUS = require("covid19-us");

const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const statesJSON = require("../data/states.json");
const novelcovid = require("novelcovid")

const deathsUS = new covidUS.Covid19DeathsUS;
const casesUS = new covidUS.Covid19MapCasesUS;

module.exports = {
    name: "us",
    description: "Shows stats about the corona virus in a state in the US.",
    usage: "<state>",
    args: true,
    aliases: ["state", "US", "USA"],
    async execute(client, message, args) {
        casesUS.getCDCMapCasesData().then(stateData => {
            for (let i = 0; i < stateData.length; i++) {
                if (stateData[i]["stateName"].toLowerCase() == args.join(" ").toLowerCase()) {
                    for(let i = 0; i < statesJSON.length; i++){
                        if(statesJSON[i]["state"].toLowerCase() == stateData[i]["stateName"].toLowerCase()){
                            novelcovid.countries()
                            .then((countryData) => {
                                let p = stateData[i]["casesReported"]/countryData[7].cases;
                                const embed = new Discord.MessageEmbed()
                                .setAuthor(`${stateData[i]["stateName"]}`)
                                .setColor(colors.main)
                                .addField("Reported Cases", `${stateData[i]["casesReported"]} cases`, true)
                                .addField("Total Cases in USA", `${countryData[7].cases} cases`)
                                .addField(`Percentage in ${stateData[i]["stateName"]}`, `${p}%`)
                                return message.channel.send(embed);
                            });
                        }
                    }
                }
            }

            return message.channel.send("State is invalid.")
        })
    },
};