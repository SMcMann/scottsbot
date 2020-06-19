const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const athletes = require('../modules/dataFiles/athleteData.json')  


module.exports = {
    name: 'draft',
    cooldown: 0,
    description: 'pulls info from a google sheet',
    guildOnly: true,
    args: true,
    usage: "<Athlete's ID>",
    execute(message, args) {
        var target;
        let drafterClass = functions.searchID(message.member);
        let senderJob = functions.jobCheck(message.member)
        let athleteID = parseInt(args[0]);

        if (senderJob != "GM"){
            throw "```CSS\nYou must be an GM to draft Athletes\n```"
        }

        if (drafterClass.fName != draftingTeam){
            throw ("```CSS\nIt is not your turn to Draft yet.\n The current Draft is: " + draftingTeam + "'s Pick number " + draftPick + "\n```")
        }

        //check to see if player is drafting by ID number
        if (Number.isInteger(athleteID) && athleteID > 0 && athleteID < 91){
            target = athleteArray[athleteID];
        }
        else {
            //target = athleteArray.indexOf(args[0])
            throw "```CSS\nPlease enter a valid ID number\n``` ";
        }

        if (!target){
            throw ("```CSS\nCannot find the Athlete at ID number " + athleteID + "\n```")
        }

        if (target.FRANCHISE){
            throw ("```CSS\n" + target.Name + " has already been drafted by: " + target.FRANCHISE + "\n```")
        }
            message.reply('```CSS\nDraft ' + target.Name + " ? \nConfirm with a thumb up or cancel with a thumb down.\n```");
        // Reacts so the user only have to click the emojis
        message.react('👍').then(r => {
            message.react('👎');
    });
    
    // First argument is a filter function
    message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
            { max: 1, time: 10000 }).then(collected => {
                    if (collected.first().emoji.name == '👍') {
                         //the actual exchange of resources  
                         target.FRANCHISE = drafterClass.fName;

                         message.reply("```CSS\nYou have successfully drafted " + target.Name + " AKA: " + target.League_Nom_de_Plume + "\n```");
                         //send message to #draft-tracker
                         var channel = message.client.channels.cache.get("722279997959569458");
                         channel.send("```CSS\nWith the #" + draftPick + " pick of the 3077 Draft\n" + drafterClass.fName + " select:\n#" + athleteID + " - " + target.Name + "\n```");

                         //update draft
                         draftArray[draftPick].PlayerPickedID = athleteID;
                         functions.updateDraftPicked(athleteID, drafterClass.fName);

                    }//if thumbs up
                    else
                            message.reply('Operation canceled.');
            }).catch(() => {
                    message.reply('```CSS\nNo reaction after 10 seconds, operation canceled\n```');
            });
    }//execute

}