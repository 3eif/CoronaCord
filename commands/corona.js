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
            let embed = new Discord.MessageEmbed()
                .setColor(colors.main)
                .setAuthor("Coronavirus Stats", client.settings.avatar);
            await novelcovid.all()
                .then((data) => {
                    let precentDead = Math.round((data.deaths / data.cases) * 100);
                    let precentRecovered = Math.round((data.recovered / data.cases) * 100);

                    embed.addField("Confirmed Cases", `${data.cases} cases`, true)
                    embed.addField("Deaths", `${data.deaths} deaths`, true)
                    embed.addField("Recovered", `${data.recovered} recovered`, true)
                    embed.addField("Perecent Dead", `${precentDead}%`, true)
                    embed.addField("Perecent Recovered", `${precentRecovered}%`, true)
                    embed.setTimestamp()
                })
                .catch((err) => console.error(err));
            await novelcovid.countries()
                .then((data) => {

                    let totalTodayCases = 0;
                    let totalTodayDeaths = 0;
                    for (let i = 0; i < data.length; i++) {
                        console.log(data[i].todayCases)
                        totalTodayCases += data[i].todayCases;
                        totalTodayDeaths += data[i].todayDeaths;
                    }

                    embed.addField("Today Cases", `${totalTodayCases} cases`, true)
                    embed.addField("Today Deaths", `${totalTodayDeaths} deaths`, true)
                })
                .catch((err) => console.error(err));
            message.channel.send(embed);
        } else if (args[0]) {
            let str = `${args.splice(" ")}`;
            let countryStr = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            novelcovid.countries()
                .then((data) => {
                    let countryInt;
                    let validCountry = false;
                    let validAbbreviation = false;
                    let countryAbbreviation;
                    for (let i = 0; i < data.length; i++) {
                        if (str == data[i].country || countryStr == data[i].country) {
                            validCountry = true;
                            countryInt = i;
                        }
                    }
                    for (let i = 0; i < countriesJSON.length; i++) {
                        if (countriesJSON[i].country == str || countriesJSON[i].country == countryStr) {
                            validAbbreviation = true;
                            countryAbbreviation = countriesJSON[i].abbreviation.toLowerCase();
                            break;
                        }
                    }
                    if (!validCountry) return message.channel.send("Country not found.");
                    let precentDead = Math.round((data[countryInt].deaths / data[countryInt].cases) * 100);
                    let precentRecovered = Math.round((data[countryInt].recovered / data[countryInt].cases) * 100);
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`${countryStr}`)
                        .setColor(colors.main)
                        .addField("Confirmed Cases", `${data[countryInt].cases} cases`, true)
                        .addField("Today Cases", `${data[countryInt].todayCases} cases`, true)
                        .addField("Deaths", `${data[countryInt].deaths} deaths`, true)
                        .addField("Today Deaths", `${data[countryInt].todayDeaths} deaths`, true)
                        .addField("Critical", `${data[countryInt].critical} critical`, true)
                        .addField("Recovered", `${data[countryInt].recovered} recovered`, true)
                        .addField("Perecent Dead", `${precentDead}%`, true)
                        .addField("Perecent Recovered", `${precentRecovered}%`, true)
                        .setTimestamp();
                    if (validAbbreviation) embed.setThumbnail(`https://www.countryflags.io/${countryAbbreviation}/flat/64.png`)
                    return message.channel.send(embed);
                })
                .catch((err) => console.error(err));
        }
    },
};