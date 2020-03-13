const covidUS = require("covid19-us");

const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const countriesJSON = require("../data/countries.json");
const novelcovid = require("novelcovid")

module.exports = {
    name: "us",
    description: "Shows stats about the corona virus in a state in the US.",
    usage: "<state>",
    args: true,
    aliases: ["state", "US", "USA"],
    async execute(client, message, args) {

    },
};

let Covid19DeathsUS = require("covid19-us").Covid19DeathsUS;
let Covid19MapCasesUS = require("covid19-us").Covid19MapCasesUS;
 
let deathCases = new Covid19DeathsUS();
deathCases.getCDCDeathCasesData().then(data => {
    console.log("deaths", data);
    /*
        Sample output: 
        { 
            '1/12/2020': 0,
            '1/13/2020': 0,
            '1/14/2020': 2,
            // ...
        }
    */
});
 
let mapCases = new Covid19MapCasesUS();
mapCases.getCDCMapCasesData().then(data => {
    console.log("maps data:", data);
    /* 
        Sample output:
        [ { 
            casesReported: 0,
            stateCode: 'AL',
            stateName: 'Alabama',
            isEstimated: false 
        }
        // ...
        ]
    */
});