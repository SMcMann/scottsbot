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
};