const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const athletes = require('../modules/dataFiles/athleteData.json')  


module.exports = {
    name: 'draft',
    cooldown: 0,
    description: 'drafts Athletes from the pool',
    guildOnly: true,
    args: true,
    argsAmount: 1,
    usage: "<Athlete's ID>",
    async execute(message, args) {
        var target;
        let drafterClass = functions.searchID(message.member);
        if (!drafterClass){
            return message.reply("```css\nYou do not have a valid role\n```")
        }

        if (message.channel.name != `${drafterClass.tag}-terminal`){
            message.reply("```css\n You must issue commands inside your team's terminal. Please try again inside '" + drafterClass.tag +"-terminal' \n```")
             return;
        }

        let superComputer = message.member.roles.cache.some((r) => r.name === "Supercomputer")
        let senderJob = message.member.roles.cache.some((r) => r.name === "GM")

        if (!senderJob){
            message.reply("```CSS\nYou must be a GM to draft!\n```")
            return;
        }  
        
        message.channel.send('```CSS\nWorking...\n```');
        await functions.setupAthletes();

        let x = parseInt(args[0]); //
        let athleteID;
        let turn = false;
        let draftPosition;


        //if (!runningDraft){
         //   throw "The draft is not running at the moment. Please try again when the draft is active."
        //}


        for (var i = 0; i < draftingTeam.length; i++){
            if (drafterClass.fName === draftingTeam[i].team || drafterClass.tag === draftingTeam[i].team.toLowerCase()){
                turn = true;
                draftPosition = i;
                break;
            }//if
        }//for
        if (!turn){
            message.reply("```CSS\nIt is not your turn to Draft yet.\n```")
            return;
        }

        //check to see if player is drafting by ID number
        if (Number.isInteger(x) && x > 0 && x < 113){
            target = athleteArray[x];
            athleteID = x;
        }
        else {
            //target = athleteArray.indexOf(args[0])
            for (var i = 1; i < athleteArray.length; i++){
                let lowerNickname = athleteArray[i].League_Nom_de_Plume.toLowerCase();

                if (lowerNickname === args[0] || args[0] === athleteArray[i].League_Nom_de_Plume){
                    target = athleteArray[i];
                    athleteID = i;
                }//if                  
            }//for
        }//else

        if (!target){
            message.reply("```CSS\nCannot find the Athlete or ID number \n```");
            return;
        }

        if (target.FRANCHISE){
            message.reply("```CSS\n" + target.Name + " has already been drafted by: " + target.FRANCHISE + "\n```")
            return;
        }

        let msg = await message.reply('```CSS\nDraft #' + athleteID + " " + target.League_Nom_de_Plume + " (" + target.Name + ", " + target.Position + ") ? \nConfirm with a thumb up or cancel with a thumb down.\n```");
        // Reacts so the user only have to click the emojis
        await msg.react("👍")
        await msg.react("👎")
    
    // First argument is a filter function
    msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
        { max: 1, time: 15000 }).then(collected => {
            if (collected.first().emoji.name == '👍') {
                //the actual exchange of resources  
                target.FRANCHISE = drafterClass.tag;
                drafterClass.athletes.push(target);
                message.reply("```CSS\nYou have successfully drafted " + target.Name + " AKA: " + target.League_Nom_de_Plume + "\n```");

                //send message to #draft-tracker
                var channel = message.guild.channels.cache.find(c => c.name === `draft-tracker`)
                
                channel.send("```CSS\nWith the #" + draftingTeam[draftPosition].pick + " pick of the 3078 Draft\n" + drafterClass.fName + " select:\n#" + athleteID + " - " + target.Name + "\n```");

                //update draft
                //draftArray[draftingTeam[draftPosition].round].PlayerPickedID = athleteID;
                try{
                functions.updateDraftPicked(athleteID, drafterClass.fName, draftingTeam[draftPosition].pick);                    
                }
                catch{
                    console.log("error with updating draft sheet")
                }


                //remove current team from the Drafting pool
                draftingTeam.splice(draftPosition, 1);

                //update player's assets
                //channel = message.client.channels.cache.get(drafterClass.bankID);
                channel = message.guild.channels.cache.find(c => c.name === `${drafterClass.tag}-assets`);
                channel.bulkDelete(5);
                var assetMessage = functions.createAssetsMessage(drafterClass);
                channel.send(assetMessage);
            }//if thumbs up
            else
                    message.reply('```CSS\nOperation canceled.\n```');
        }).catch(() => {
                message.reply('```CSS\nNo reaction after 15 seconds, operation canceled\n```');
        });
    }//execute

}