const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const athletes = require('../modules/dataFiles/athleteData.json')  


module.exports = {
    name: 'drop',
    cooldown: 0,
    description: 'Drops your current Bid',
    guildOnly: true,
    args: false,
    argsAmount: 0,
    //usage: "<Athlete's ID>",
    async execute(message, args) {

        let dropperClass = functions.searchID(message.member);
        if (!dropperClass){
            return message.reply("```css\nYou do not have a valid role\n```")
        }

        if (message.channel.name != `${dropperClass.tag}-terminal`){
            message.reply("```css\n You must issue commands inside your team's terminal. Please try again inside '" + dropperClass.tag +"-terminal' \n```")
             return;
        }

        message.channel.send('```CSS\nWorking...\n```');

        let superComputer = message.member.roles.cache.some((r) => r.name === "Supercomputer")
        let senderJob = message.member.roles.cache.some((r) => r.name === "GM")

        if (!senderJob){
            message.reply("```CSS\nYou must be a GM to drop a bid!\n```")
            return;
        }  

        if (!dropperClass.coachBid.fName){
            return message.reply("```css\nYou do not have a current bid placed\n```")
        }

        let msg = await message.reply('```CSS\n' + `Drop your current bid on Coach ${dropperClass.coachBid.fName} ${dropperClass.coachBid.lName} for ${dropperClass.coachBid.bid}? \nConfirm with a thumb up or cancel with a thumb down.` + '\n```');
        // Reacts so the user only have to click the emojis
        await msg.react("👍")
        await msg.react("👎")
    
    // First argument is a filter function
    msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
        { max: 1, time: 15000 }).then(collected => {
            if (collected.first().emoji.name == '👍') {
                //the actual exchange of resources  
                let obj = {
                    fName: "",
                    lName: "",
                    bid: 0,
                    bidder: dropperClass.fName
                }
                dropperClass.coachBid = obj;

                try{
                    functions.updateCoachLog(obj, dropperClass);
                }
                catch{
                    console.log("error with drop function call")
                }

                message.reply("```CSS\nYou Bid has been dropped\n```");

                //resend asset message
                
                channel = message.guild.channels.cache.find(c => c.name === `${dropperClass.tag}-assets`)
                channel.bulkDelete(2);

                exampleEmbed = functions.createAssetsMessage(dropperClass);
                channel.send(exampleEmbed);

            }//if thumbs up
            else
                    message.reply('```CSS\nOperation canceled.\n```');
        }).catch(() => {
                message.reply('```CSS\nNo reaction after 15 seconds, operation canceled\n```');
        });
    }//execute

}