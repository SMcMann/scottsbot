const Team = require('../modules/team.js')
const test = require('../modules/startupData.js')
const functions = require('./functions.js')
const draftAnnouncement = "722279997959569458"


module.exports = {
    name: 'toggle',
    cooldown: 0,
    description: 'toggles the draft either active or disabled',
    async execute(message, args) {
        var time;
        var draftRound = 0;
        var channel;        
        if (args[0] == 4){
            time = 240000 //4 minutes
        }
        else if(args[0] == 5){
            time = 300000 //5 minutes
        }
        else if(args[0] == 1){
            time = 60000 //1 minutes
        }
        else{
            return message.reply("You need to provide either 1, 4, or 5 as an arguement to make the draft 1 minute, 4 minutes, or 5 minutes.")
        }


        let superComputer = message.member.roles.cache.some((r) => r.name === "Supercomputer")

        if (!superComputer){
            message.reply("```CSS\nYou must be an Supercomputer access this command\n```")
            return;
        }


         async function myFunction(){
            //1st load in the draft from spreadsheet
            var currentDraft = await functions.getCurrentDraft();
            draftRound = currentDraft.round;
            var draftPick = currentDraft.pick;
            var currentRound = currentDraft.currentRound;

            if (draftRound > currentRound){//if the draft we fetch belongs to the next Round of drafts, time to end this draft
                //step 1 stop the draft and clear the draft flag
                clearInterval(runningDraft);
                runningDraft = false;
                //step 2 make an announcement
                channel = message.guild.channels.cache.find(c => c.name === `draft-tracker`);
                channel.send("```CSS\n Round " + draftRound + " Complete. \n```");
                console.log("Round " + draftRound + " Complete.")
                //step 3 update the current Round to the next one               
                functions.updateDraftRound(draftRound, (draftPick - 1));
                /*step 4 Give Stat tokens to all players
                */
               for (i = 0; i < allTeams.length; i++) {
                allTeams[i].statTokens = allTeams[i].statTokens + 1;
               }
               //step 5 resolve coach bids
                return;


            }// if draftRound
            else{
                draftingTeam.push(currentDraft);
                console.log(draftingTeam);
                var x = currentDraft.team

                console.log("Draft round: "+ x)

                team = functions.protoValidateTarget(x); // get the team class so we can send them a message
                channel = message.guild.channels.cache.find(c => c.name === `${team.tag}-terminal`);

                channel.send("<@&"+team.roleID+"> ```CSS\nATTENTION  \nYOUR DRAFT PICK NO. "+ draftPick + " IS NOW ACTIVE. \n```");  
                functions.updateDraftRound(draftRound, draftPick);
            }//else

        }//myFunction

        if (!runningDraft){ //if the draft is not live restart it
            
            await myFunction(); //do the thing
            runningDraft = setInterval(myFunction, time);
            message.reply("```CSS\n Drafting is now live! \n```");
            channel = message.guild.channels.cache.find(c => c.name === `draft-tracker`);
            channel.send("```CSS\n Drafting is now [live]! \n```");
            console.log("Draft Started!!")
        }//if (!runningDraft)
        else{
            clearInterval(runningDraft);
            runningDraft = false;
            functions.updateDraftPickNo();
            channel = message.guild.channels.cache.find(c => c.name === `draft-tracker`);
            message.reply("```CSS\nDrafting has been [suspended]!\n```");
            channel.send("```CSS\nDrafting has been [suspended]!\n```");
            console.log("Draft Stopped!!")
        }

    }//execute
};//module

