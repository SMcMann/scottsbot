const Team = require('../modules/team.js')
const test = require('../modules/startupData.js')
const functions = require('./functions.js')
const draftAnnouncement = "722279997959569458"


module.exports = {
    name: 'toggle',
    cooldown: 0,
    description: 'toggles the draft either active or disabled',
    execute(message, args) {

        let senderJob = functions.jobCheck(message.member)
        if (senderJob != "Supercomputer"){
            throw "```CSS\n ACCESS DENIED TO MEATSACKS \n```"
        }

        var channel;
        function myFunction(){
            draftPick++;
            var currentRound = parseInt(draftArray[draftPick].Round);
            if (draftRound < currentRound){
                
                clearInterval(runningDraft);
                runningDraft = false;
                channel = message.client.channels.cache.get(draftAnnouncement);
                channel.send("```CSS\n Round " + draftRound + " Complete. \n```");
                console.log("Round " + draftRound + " Complete.")
                draftRound++;
                draftPick--;
                return;
            }// if draftRound
            else{
                draftingTeam = draftArray[draftPick].Current_Team
                var x = draftingTeam.toLowerCase();

                console.log("Draft round: "+ x)

                team = functions.protoValidateTarget(x);
                var channel = message.client.channels.cache.get(team.logID);
                //"<@&"+FRV.roleID+">"
                channel.send("<@&"+team.roleID+"> ```CSS\nATTENTION  \nDRAFT PICK NO. "+ draftPick + " IS NOW ACTIVE. \n```");  
                functions.updateDraftPickNo();
            }//else

        }//myFunction

        if (!runningDraft){
            const tenMinutes = 600000;
            const min = 60000
            const thirtySec = 30000;
            
            myFunction();
            runningDraft = setInterval(myFunction, thirtySec);
            message.reply("```CSS\n Drafting is now live! \n```");
            channel = message.client.channels.cache.get(draftAnnouncement);
            channel.send("```CSS\n Drafting is now [live!] \n```");
            console.log("Draft Started!!")
        }//if (!runningDraft)
        else{
            clearInterval(runningDraft);
            runningDraft = false;
            draftPick--;
            functions.updateDraftPickNo();
            channel = message.client.channels.cache.get(draftAnnouncement);
            message.reply("```CSS\nDrafting has been [suspended!]\n```");
            channel.send("```CSS\nDrafting has been [suspended!]\n```");
            console.log("Draft Stopped!!")
        }

    }//execute
};//module

