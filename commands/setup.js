<<<<<<< HEAD
const Team = require('../modules/team.js')
const test = require('../modules/startupData.js')
const functions = require('./functions.js')

module.exports = {
    name: 'setup',
    cooldown: 0,
    description: 'deletes messages in logs and banks and then publishes current banks to factions',
    execute(message, args) {

        if (message.author.id != '140593347520626698') { //Scott's ID so no one else can use it
        throw "```css\nYOU DO NOT HAVE PERMISSION FOR THIS COMMAND```\n"
    }
        
        //setTimeout(() => { 
            var now = new Date();
            let draftTracker = "722279997959569458"

            for (i = 0; i < allTeams.length; i++) {
                channel = message.client.channels.cache.get(allTeams[i].bankID);
                channel.bulkDelete(5);
                var bankEmbed = functions.newEmbed(allTeams[i]);
                channel.send({ embed: bankEmbed });
    
                channel = message.client.channels.cache.get(allTeams[i].logID);
                channel.bulkDelete(100);

                channel = message.client.channels.cache.get(draftTracker);
                channel.bulkDelete(100);
            }//for                          
        // }, 2000);
    },//setUp
=======
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
>>>>>>> 84613f9f109a4cc31705c27d62873802deb5d229
};