const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const athletes = require('../modules/dataFiles/athleteData.json')


module.exports = {
    name: 'crunch',
    cooldown: 0,
    description: 'processes all coach bids',
    guildOnly: true,
    args: false,
    usage: '',
    async execute(message, args) {

        if (message.author.id != '140593347520626698') { //Scott's ID so no one else can use it
        message.reply("```css\nYOU DO NOT HAVE PERMISSION FOR THIS COMMAND```\n")
        return;
        }//if

        message.reply("Om-nom-nom");
        functions.endRoundCoaches(message);
        
    }//execute

}

