const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const athletes = require('../modules/dataFiles/athleteData.json')


module.exports = {
    name: 'test',
    cooldown: 0,
    description: 'pulls info from a google sheet',
    guildOnly: true,
    args: false,
    usage: '',
    async execute(message, args) {
        
        channel = message.client.channels.cache.get(BJU.bankID);
        const msg = await channel.messages.fetch("737720959909363762")

        exampleEmbed = functions.createAssetsMessage(BJU);

        msg.edit(exampleEmbed);
    }//execute

}

