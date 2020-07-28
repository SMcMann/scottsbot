const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const Discord = require('discord.js');

module.exports = {
    name: 'update',
    cooldown: 0,
    description: 'updates all existing data with either old file or one I have chosen',
    args: false, 
    async execute(message, args) {
        /*
        if (message.author.id != '140593347520626698') { //Scott's ID so no one else can use it
            throw "YOU DO NOT HAVE PERMISSION FOR THIS COMMAND"
        }
        */
        //check if user is approved.
        var approved = false;
        let job = functions.jobCheck(message.member);
        if (job != "Supercomputer"){
            message.reply("```css\nYou are not allowed to use this command\n```")
            return;
        }

        let msg = await message.channel.send('```css\nUpdate all local data with data from the Google Spreadsheets? \nThis action cannot be undone \nConfirm with a thumb up or cancel with a thumb down.\n```');
    
        // Reacts so the user only have to click the emojis
        await msg.react("👍")
        await msg.react("👎")
        
        msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
        { max: 1, time: 10000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                    message.reply('```css\nWorking...\n```');
                    approved = true;

                }//if thumbs up
                else
                        message.reply('```cssOperation canceled.\n```');
        }).catch(() => {
                message.reply('```cssNo reaction after 10 seconds, operation canceled\n```');
        });

        if (approved){
            await functions.updateFromGoogle();
            await functions.setupDraft();
            await functions.setupAthletes();
            functions.updateKudosChannel(message);
            //AND THEN go though the athelete array and re-add them to the team Athlete[]
        
            for (i = 0; i < allTeams.length; i++) {
                channel = message.client.channels.cache.get(allTeams[i].bankID);
                channel.bulkDelete(5);
                var exampleEmbed = functions.createAssetsMessage(allTeams[i]);
                channel.send(exampleEmbed);
            }//for    
        }

    },//update
};