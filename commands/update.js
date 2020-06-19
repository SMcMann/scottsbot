<<<<<<< HEAD
const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const Discord = require('discord.js');

module.exports = {
    name: 'update',
    cooldown: 0,
    description: 'updates all existing data with either old file or one I have chosen',
    args: false, 
    execute(message, args) {
        /*
        if (message.author.id != '140593347520626698') { //Scott's ID so no one else can use it
            throw "YOU DO NOT HAVE PERMISSION FOR THIS COMMAND"
        }
        */
        //check if user is approved.
        let job = functions.jobCheck(message.member);
        if (job != "Supercomputer"){
            throw "You are not allowed to use this command"
        }

        message.reply('```css\nUpdate all local data with data from the Google Spreadsheets? \nThis action cannot be undone \nConfirm with a thumb up or cancel with a thumb down.\n```');
    
        // Reacts so the user only have to click the emojis
        message.react('👍').then(r => {
                message.react('👎');
        });
        
        message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
        { max: 1, time: 10000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                    message.reply('```css\nWorking...\n```');
            
                    try{
                        functions.updateFromGoogle();
                    }
                    catch(err){
                        console.log("there was an error trying to update from the google sheets")
                    }
                    
                    setTimeout(() => { 
                        for (i = 0; i < allTeams.length; i++) {
                            channel = message.client.channels.cache.get(allTeams[i].bankID);
                            channel.bulkDelete(5);
                            var exampleEmbed = functions.newEmbed(allTeams[i]);
                            channel.send({ embed: exampleEmbed });
                
                        }//for                          
                     }, 2000);

                }//if thumbs up
                else
                        message.reply('```cssOperation canceled.\n```');
        }).catch(() => {
                message.reply('```cssNo reaction after 10 seconds, operation canceled\n```');
        });

    },//update
=======
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
>>>>>>> 84613f9f109a4cc31705c27d62873802deb5d229
};