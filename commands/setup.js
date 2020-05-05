const Nation = require('../modules/nation.js')
const Market = require('../modules/market.js')
const test = require('../modules/startupData.js')
const functions = require('./functions.js')

module.exports = {
    name: 'setup',
    cooldown: 0,
    description: 'deletes messages in logs and banks and then publishes current banks to factions',
    execute(message, args) {

        if (message.author.id != '140593347520626698') { //Scott's ID so no one else can use it
        throw "YOU DO NOT HAVE PERMISSION FOR THIS COMMAND"
    }
    
        for (i = 0; i < allNations.length; i++) {
            channel = message.client.channels.cache.get(allNations[i].bankID);
            channel.bulkDelete(20);
            var exampleEmbed = functions.newEmbed(allNations[i]);
            channel.send({ embed: exampleEmbed });

            channel = message.client.channels.cache.get(allNations[i].logID);
            channel.bulkDelete(100);

        }//for
        //update the Market
        channel = message.client.channels.cache.get(Mar.logID);
        channel.bulkDelete(20);

        exampleEmbed = functions.marketEmbed(Mar)
        channel.send({ embed: exampleEmbed });
    },//setUp
};