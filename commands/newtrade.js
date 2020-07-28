const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const athletes = require('../modules/dataFiles/athleteData.json')

//const athleteJson = require('../modules/dataFiles/athleteData.json')

const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { promisify } = require('util');
const fs = require('fs')

const creds = require('./client_secret.json')
const doc = new GoogleSpreadsheet('1bwNZDylRvbWbIwk4GvvNOK4qugV7QzDVgw9ZyjRR6ZM');    

module.exports = {
    name: 'newtrade',
    cooldown: 0,
    description: 'informs discord bot that there is a new Trade deal',
    guildOnly: true,
    args: true,
    usage: '',
    async execute(message, args) {
        var tradeOffer = []
        var tradeRequest = []
        if (args[0] === args[1]){ 
            message.reply("```CSS\nPlayer attempted trade with themself\n```")
            return;
        }        

        await functions.setupAthletes();
        //await functions.updateFromGoogle();
        //await functions.setupDraft();

        const sender = functions.protoValidateTarget(args[0]);
        const reciever = functions.protoValidateTarget(args[1]);
        let sRole = sender.roleID;
        let rRole = reciever.roleID;

        var offeredAthlete;
        var requestedAthlete;
        var offeredCash;
        var requestedCash;
        var offeredDraft;
        var requestedDraft;
        var offeredOther = "";
        var requestedOther = "";

        let sendMsg = ""
        let recieveMsg = ""

        var i = 2;
        while (args[i] != "ctQrK"){
            switch(args[i]){
                case "CTqRk2": //Offered Athletes
                    i++;
                    while (args[i] != "CTqRk3"){
                        offeredAthlete = athleteArray[parseInt(args[i])];
                        tradeOffer.push(offeredAthlete);     

                        sendMsg = sendMsg + `Offered Athlete: ${offeredAthlete.Name} \n`;
                        i++;               
                    }
                    break;
                case "CTqRk3": //Requested Athletes
                    i++;
                    while (args[i] != "CTqRk4"){
                        requestedAthlete = athleteArray[parseInt(args[i])];
                        tradeRequest.push(requestedAthlete);    
                        
                        recieveMsg = recieveMsg + `Requested Athlete: ${requestedAthlete.Name} \n`;
                        i++;               
                    }
                    break;
                case "CTqRk4": //Offered Cash
                    i++;
                    while (args[i] != "CTqRk5"){
                        offeredCash = parseInt(args[i]);
                        tradeOffer.push(offeredCash);

                        sendMsg = sendMsg + `Offered Cash: ${offeredCash} \n`;
                        i++;
                    }
                    break;
                case "CTqRk5": //Requested Cash
                    i++;
                    while (args[i] != "CTqRk6"){
                        requestedCash = parseInt(args[i]);
                        tradeRequest.push(requestedCash);

                        recieveMsg = recieveMsg + `Requested Cash: ${requestedCash} \n`;
                        i++;
                    }//while
                    break;
                case "CTqRk6": //Offered Draft Slot
                    i++;
                    while (args[i] != "CTqRk7"){
                        offeredDraft = draftArray[parseInt(args[i])];
                        tradeOffer.push(offeredDraft);

                        sendMsg = sendMsg + `Offered Draft Slot: ${offeredDraft.Pick} \n`;
                        i++;
                    }
                    break;
                case "CTqRk7": //Requested Draft Slot
                    i++;
                    while (args[i] != "CTqRk8"){
                        requestedDraft = draftArray[parseInt(args[i])];
                        tradeRequest.push(requestedDraft);

                        recieveMsg = recieveMsg + `Requested Draft Slot: ${requestedDraft.Pick} \n`;
                        i++;
                    }
                    break;
                case "CTqRk8": //Offered Other 
                    i++;
                    while (args[i] != "CTqRk9"){
                        offeredOther = offeredOther + args[i] + " ";       
                        i++;   
                    }
                    if (offeredOther){
                         tradeOffer.push(offeredOther);
                         sendMsg = sendMsg + `Offered Other: "${offeredOther}" \n`;                        
                    }

                    break;  
                case "CTqRk9": //Requested Other 
                    i++;
                    while (args[i] != "ctQrK"){
                        requestedOther = requestedOther + args[i] + " ";       
                        i++;   
                    }
                    if (requestedOther){
                           tradeRequest.push(requestedOther);     
                           recieveMsg = recieveMsg + `Offered Other: "${requestedOther}" \n`;                     
                    }

                    break;                                                     
            }//switch
        }//for

        var missingStuff = [];
        var missingMessage = "";
        for (var j =0; j< tradeOffer.length; j++){
            if (tradeOffer[j].Position){//case: Athlete
                let exists = false;
                for (var k=0; k < sender.athletes.length && !exists; k++){
                    if (sender.athletes[k].Name === tradeOffer[j].Name){
                        exists = true;
                    }
                }//for
                if(!exists){//if the sender does not own the athlete in question
                    missingStuff.push(tradeOffer[j])
                    missingMessage = missingMessage + `Missing Athlete: ${tradeOffer[j].Name}\n`
                }
            }//case: Athlete
            else if(Number.isInteger(tradeOffer[j])){//case: Cash
                if (sender.zillions < tradeOffer[j]){
                    missingStuff.push(tradeOffer[j])
                    missingMessage = missingMessage + `Missing Cash: ${tradeOffer[j]}\n`
                }
            }
            else if(tradeOffer[j].Pick){//case: Draft Pick
                let thisPick = await functions.getDraft(tradeOffer[j].Pick);
                if (thisPick.team != tradeOffer[j].Current_Team){
                    missingStuff.push(tradeOffer[j])
                    missingMessage = missingMessage + `Missing Draft Pick: ${tradeOffer[j].Pick}\n`
                }
            }

        }//for

        var channel = message.client.channels.cache.get(sender.logID);
        if (missingMessage){
            channel.send("```CSS\n[Attention!] \nYou have initiated a trade while lacking certain resouces. Resource(s) Missing:\n" + missingMessage + 
            "\nIf you feel like this message is in error, please contact you local [Supercomputer]\n```");
            return;
        }

        let msg = await channel.send(`<@&${sRole}>` + "```CSS\n[TRADE READY FOR APPROVAL!]\nYour trade offer is ready for approval. Please take a moment to look over the details for final approval\n\n" +
        `[${sender.fName}'s RESOURCES]\n` + sendMsg + `\n[[${reciever.fName}'s RESOURCES]\n` + recieveMsg + "\n```");
        await msg.react("✅")
        await msg.react("❌")
    
        let approval = false;
        let approval2 = false;

        await msg.awaitReactions((reaction, user) => user.id != "699044734966169641" && (reaction.emoji.name == '✅' || reaction.emoji.name == '❎'),
        { max: 1, time: 20000 }).then(collected => {
                if (collected.first().emoji.name == '✅') {    
                    console.log("success")                
                    approval = true;
                }//if thumbs up
                else
                msg.channel.send('```css\nOperation canceled.\n```');
        }).catch(() => {
            msg.channel.send('```CSS\nNo reaction after 20 seconds, operation canceled\n```');
        });

        if (approval){
            var channel = message.client.channels.cache.get(reciever.logID);

            let msg2 = await channel.send(`<@&${rRole}>` + "```CSS\n[INCOMING TRADE!]\nYour trade offer is ready for approval. Please take a moment to look over the details for final approval\n\n" +
            `[${sender.fName}'s RESOURCES]\n` + sendMsg + `\n[[${reciever.fName}'s RESOURCES]\n` + recieveMsg + "\n```");
            await msg2.react("✅")
            await msg2.react("❌")
            
            await msg2.awaitReactions((reaction, user) => user.id != "699044734966169641" && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
            { max: 1, time: 20000 }).then(collected => {
                    if (collected.first().emoji.name == '✅') {    
                        console.log("success 2")                
                        approval2 = true;
                    }//if thumbs up
                    else
                    msg2.channel.send('```css\nOperation canceled.\n```');
            }).catch(() => {
                msg2.channel.send('```CSS\nNo reaction after 20 seconds, operation canceled\n```');
            });

        }

        if (approval && approval2){
            var channel = message.client.channels.cache.get("730607392617660496");
           channel.send("```CSS\n[TRADE PENDING]\nTwo teams have approved this trade. Please double check that this is true, then adjuicate the trade. I'd do it myself but I am lazy.\n\n" +
           `[${sender.fName}' s RESOURCES]\n` + sendMsg + `\n[[${reciever.fName}' s RESOURCES]\n` + recieveMsg + "\n```");
        }

    //start checking if Sender has all required resouces
    /*    
    if (offeredCash){
        if (sender.zillions < offeredCash){
            
        }
    }
    if (offeredDraft){
        
    }
*/
    //check to see if reciever has all required resources

    //send trade request to send for approval

    //send trade request to reciever for approval

    //finally exchange resources

        //console.log(tradeOffer);
        //console.log(tradeRequest);
    }//execute

}