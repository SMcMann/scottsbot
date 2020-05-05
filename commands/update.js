const Nation = require('../modules/nation.js')
const Market = require('../modules/market.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const backup = require('../backup.json')
const manual = require('../manualUpdate.json')

module.exports = {
    name: 'update',
    cooldown: 0,
    description: 'updates all existing data with either old file or one I have chosen',
    args: true,
    usage: '<file desired>', 
    execute(message, args) {
        if (message.author.id != '140593347520626698') { //Scott's ID so no one else can use it
            throw "YOU DO NOT HAVE PERMISSION FOR THIS COMMAND"
        }

        if (args[0] === "manual"){//will update from the 'manualUpdate.json' file allwoing for direct manipulation of any data
            NAF.updateNation(manual.naf)
            AR.updateNation(manual.ar)
            SL.updateNation(manual.sl)
            MCR.updateNation(manual.mcr)
            Mar.updateMarket(manual.market)
            console.log("updated using the manual")  

        }
        else{
            NAF.updateNation(backup.naf)
            AR.updateNation(backup.ar)
            SL.updateNation(backup.sl)
            MCR.updateNation(backup.mcr)
            Mar.updateMarket(backup.market)
            console.log("updated using the backup")  
        }

        for (i = 0; i < allNations.length; i++) {
            channel = message.client.channels.cache.get(allNations[i].bankID);
            channel.bulkDelete(5);
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
          
        

        
    },//update
};