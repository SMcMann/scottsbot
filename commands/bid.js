const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const athletes = require('../modules/dataFiles/athleteData.json')  


module.exports = {
    name: 'bid',
    cooldown: 0,
    description: 'allows players to bid on coaches',
    guildOnly: true,
    args: true,
    argsAmount: 2,
    usage: "<Coaches' Last Name> <Bid Amount>",
    async execute(message, args) {
        let senderClass = functions.searchID(message.member);
        if (!senderClass){
            return message.reply("```css\nYou do not have a valid role\n```")
        }        

        if (message.channel.name != `${senderClass.tag}-terminal`){
            message.reply("```css\n You must issue commands inside your team's terminal. Please try again inside '" + senderClass.tag +"-terminal' \n```")
             return;
        }

        message.channel.send('```CSS\nWorking...\n```');        
        //await functions.setupCoaches();

        let senderJob = message.member.roles.cache.some((r) => r.name === "GM")

        if (!senderJob){
            message.reply("```CSS\nYou must be an GM to bid on Coaches\n```")
            return;
        }

        if (!senderJob){
            message.reply("```CSS\nYou must be an GM to bid on Coaches\n```")
            return;
        }

        //Step 1) Validate Dynamically args so we know a) Who the bid is for and b) how much it is
        //seacrh for coaches name or ID
        var coach;
        let arg0 = args[0].toLowerCase();
        let args1 = args[1].toLowerCase();

        for (i =1; i < coachArray.length; i++){
            if (coachArray[i].Name.toLowerCase() === arg0 || coachArray[i].Last_Name.toLowerCase() === arg0)
                coach = coachArray[i];
            else if (coachArray[i].Name.toLowerCase() === args1 || coachArray[i].Last_Name.toLowerCase() === args1)
                coach = coachArray[i];
        }
        if (!coach){
            message.reply("```CSS\nUnable to find your coach\n```")
            return;
        }
        //get the player's bid
        var bidAmount
        if (Number.isInteger(parseInt(args[0])))
            bidAmount = parseInt(args[0]);
        else if (Number.isInteger(parseInt(args[1])))
            bidAmount = parseInt(args[1]);
        if (!bidAmount){
            message.reply("```css\nYou did not provide a valid bid amount\n```")
            return; 
        }    
        if (bidAmount <= 0){
            message.reply("```css\nPlease bid more than 0.\n```")
            return;
        }
        if (coach.FRANCHISE === senderClass.fName){
            message.reply("```css\nYou cannot bid on your own coach.\n```")
            return;
        }
        //Step 2) Check team's current bid, as teams can only have one bid active


        let msg = await message.channel.send('```CSS\nBid ' + bidAmount + ' on Coach ' + coach.Name + " " + coach.Last_Name + '?\n[Any previous bids placed this round will be replaced by this one.]\nConfirm with a thumb up or cancel with a thumb down.\n```');
        // Reacts so the user only have to click the emojis
        await msg.react("👍")
        await msg.react("👎")
    
        // First argument is a filter function
        msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
            { max: 1, time: 15000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                    //add bid to teeam Class
                    let obj = {
                        fName: coach.Name,
                        lName: coach.Last_Name,
                        bid: bidAmount,
                        bidder: senderClass.fName
                    }
                    senderClass.coachBid = obj;
                    //console.log(senderClass.coachBid);
                    //update coach bid log
                    try{
                        functions.updateCoachLog(obj, senderClass);
                    }
                    catch{
                        console.log("error with bid function call")
                    }
                    message.reply("```CSS\nYou Bid has been placed\n```");

                    //resend asset message
                    channel = message.guild.channels.cache.find(c => c.name === `${senderClass.tag}-assets`);
                    channel.bulkDelete(2);

                    exampleEmbed = functions.createAssetsMessage(senderClass);
                    channel.send(exampleEmbed);

                }//if thumbs up
                else
                        message.reply('```CSS\nOperation canceled.\n```');
            }).catch(() => {
                    message.reply('```CSS\nNo reaction after 15 seconds, operation canceled\n```');
            });
        }//execute

}