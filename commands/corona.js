const Discord = require("discord.js");
const colors = require("../data/colors.json");
const countriesJSON = require("../data/countries.json");
const novelcovid = require("novelcovid")

Object.defineProperty(String.prototype, "toProperCase", {
    value: function () {
        return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
});

module.exports = {
    name: "corona",
    description: "Shows stats about the corona virus.",
    usage: "[country]",
    async execute(client, message, args) {
        if (!args[0]) {
            const stats = await novelcovid.all();
            const countryStats = await novelcovid.countries();
            var todayDeaths = 0;
            var todayCases = 0;
            countryStats.forEach(country => { todayDeaths += country.todayDeaths; todayCases += country.todayCases });
            const embed = new Discord.MessageEmbed()
                .setAuthor("Coronavirus Stats", client.settings.avatar)
                .addField("Confirmed Cases", `${stats.cases.toLocaleString()} Cases`, true)
                .addField("Deaths", `${stats.deaths.toLocaleString()} Deaths`, true)
                .addField("Perecent Dead", `${((stats.deaths / stats.cases) * 100).toFixed(2)}%`, true)
                .addField("Perecent Recovered", `${((stats.recovered / stats.cases) * 100).toFixed(2)}%`, true)
                .addField("Today Cases", `${todayCases.toLocaleString()} Cases`, true)
                .addField("Today Deaths", `${todayDeaths.toLocaleString()} Deaths`, true)
                .setThumbnail("https://cdn.discordapp.com/attachments/685198558969856027/688073259870060552/iu.png")
                .setColor(colors.main)
                .setTimestamp();
            message.channel.send(embed);
        } else {
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
            const country = countries[name];
            const embed = new Discord.MessageEmbed()
                .setAuthor(country.country)
                .setDescription(`**${country.cases.toLocaleString()} Confirmed Cases**`)
                .addField("Today Cases", `${country.todayCases.toLocaleString()} Cases`, true)
                .addField("Today Deaths", `${country.todayDeaths.toLocaleString()} Deaths`, true)
                .addField("Recovered", `${country.recovered.toLocaleString()} (${((country.recovered / country.cases) * 100).toFixed(2)}%) Recovered`)
                .addField("Deaths", `${country.deaths.toLocaleString()} (${((country.deaths / country.cases) * 100).toFixed(2)}%) Deaths`, true)
                .setThumbnail(`https://www.countryflags.io/${require("../data/countries_abbreviations.json")[country.country]}/flat/64.png`)
                .setColor(colors.main)
                .setTimestamp();
            message.channel.send(embed);
        }
    },
};