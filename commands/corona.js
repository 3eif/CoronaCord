const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const countriesJSON = require("../data/countries.json");
const novelcovid = require("novelcovid")

module.exports = {
    name: "corona",
    description: "Shows stats about the corona virus.",
    usage: "[country]",
    async execute(client, message, args) {
        if (!args[0]) {
            novelcovid.all()
                .then((data) => {
                    const embed = new Discord.MessageEmbed()
                    .setColor(colors.main)
                    .setAuthor("Coronavirus Stats", client.settings.avatar)
                    .addField("Confirmed Cases", `${data.cases} cases`)
                    .addField("Deaths", `${data.deaths} deaths`)
                    .addField("Recovered", `${data.recovered} recovered`)
                    .setTimestamp()
                    return message.channel.send(embed);
                })
                .catch((err) => console.error(err));
        } else if(args[0]) {
            let countryStr = args.splice(" ");
            novelcovid.countries()
            .then((data) => {
                let countryInt;
                let validCountry = false;
                let validAbbreviation = false;
                let countryAbbreviation;
                for(let i = 0; i < data.length; i++){
                    if(countryStr == data[i].country) {
                        validCountry = true;
                        countryInt = i;
                    }
                }
                for(let i = 0; i < countriesJSON.length; i++){
                    if(countriesJSON[i].country === countryStr) {
                        validAbbreviation = true;
                        console.log(countriesJSON[i].abbreviation);
                        countryAbbreviation = countriesJSON[i].abbreviation.toLowerCase();
                        break;
                    }
                }
                if(!validCountry) return message.channel.send("Country not found.");
                const embed = new Discord.MessageEmbed()
                .setAuthor(`${countryStr}`)
                .setColor(colors.main)
                .addField("Confirmed Cases", `${data[countryInt].cases} cases`, true)
                .addField("Today Cases", `${data[countryInt].todayCases} cases`, true)
                .addField("Deaths", `${data[countryInt].deaths} deaths`, true)
                .addField("Today Deaths", `${data[countryInt].todayDeaths} deaths`, true)
                .addField("Critical", `${data[countryInt].critical} critical`, true)
                .addField("Recovered", `${data[countryInt].recovered} recovered`, true)
                .setTimestamp();
                if(validAbbreviation) embed.setThumbnail(`https://www.countryflags.io/${countryAbbreviation}/flat/64.png`)
                return message.channel.send(embed);
            })
            .catch((err) => console.error(err));
        }
    },
};