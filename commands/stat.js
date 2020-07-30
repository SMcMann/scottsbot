const Team = require('../modules/team.js')
const test = require('../modules/startupData.js')
const functions = require('./functions.js')

module.exports = {
    name: 'stat',
    cooldown: 0,
    guildOnly: true,
    args: true,
    argsAmount: 1,
    description: 'enables players to make stat inquires into stats in Draft Night',
    usage: '<stat name> OR <bonus> for bonus inquiries',
    async execute(message, args) {
        let content = ""
        let inquiry = ""

        let senderClass = functions.searchID(message.member);
        if (!senderClass){
            return message.reply("```css\nYou do not have a valid role\n```")
        }

        let senderJob = message.member.roles.cache.some((r) => r.name === "Saber")

        if (!senderJob){
            message.reply("```CSS\nYou must be a Saber to make stat inquiries\n```")
            return;
        } 

        if (message.channel.name != `${senderClass.tag}-terminal`){
            message.reply("```css\n You must issue commands inside your team's terminal. Please try again inside '" + senderClass.tag +"-terminal' \n```")
             return;
        }
        
        if (args[0].toLowerCase() === "bonus"){
            let tokens = await functions.getStatToken(senderClass, "BONUS")
            //check for BONUS TOKENS
            if (tokens === 0){
                message.reply("```css\nYou are out of BONUS Query Tokens\n```")
                return;
            }
            
            // `m` is a message object that will be passed through the filter function
            const filter = m => m.author.id === message.author.id

            let msg1 = await message.reply("```css\nPlease enter in chat what your bonus inquiry is.\n You will be asked for confirmation after you send\nYou have [25] Seconds```")
                
            await msg1.channel.awaitMessages(filter, { max: 1, time: 25000, errors: ['time'] })
                    .then(m => {
                        inquiry = m.first().content;
                        //console.log(inquiry);
                    })
                    .catch(collected => {
                        message.channel.send('```\nBonus inquiry aborted due to inactivity.\n```');
                    });
            

            if (inquiry){
                let msg = await message.reply("```css\nMake a bonus inquiry about:\n'" + inquiry + "'?\n```");
                await msg.react("👍")
                await msg.react("👎")
                
                msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                { max: 1, time: 15000 }).then(collected => {
                        if (collected.first().emoji.name == '👍') {
                            channel = message.guild.channels.cache.find(c => c.name === `super-chat`);
                            channel.send(`<@&${SUPER.roleID}>\n${message.member.displayName} has made an official inquiry about:\n "${inquiry}"`);

                            senderClass.bonusTokens--;
                            //UPDATE GOOGLE SHEETS W/ NEW STAT TOKEN INFO
                            functions.updateStatToken(senderClass, "BONUS", content, inquiry) 
                            message.reply("```css\nYour inquiry has been submitted to the Supercomputers. They will get back to you with an aswer soon.\n" + 
                            "In the [unlikely] event that they do not reply within the next 15 minutes, please feel free to remind them.\n```")
                        }//if thumbs up
                        else
                        message.reply('```css\nOperation canceled.\n```');
                    }).catch(() => {
                            message.reply('```css\nNo reaction after 15 seconds, operation canceled\n```');
                    });
        
            }

        }//bonus inquiry
        else{//actual stat inquires
            let tokens = await functions.getStatToken(senderClass, "STAT")

            if (tokens === 0){
                message.reply("```css\nYou are out of STAT Query Tokens\n```")
                return;
            }
            
            //finds the stat that is desired 
            var statClass;
            for (var i = 0; i < statArray.length && !statClass; i++){
                if (statArray[i].nameArray.includes(args[0].toLowerCase()))
                    statClass = statArray[i];
            }

            if (!statClass){
                message.reply("```css\nDesired stat of ''" + args[0] + "'' could not be found\n```")
                return;
            }
    
            let gos = statClass.getGOS(senderClass.tag)//get the team specific boolean value for a stat
                if(!gos){
                    content = "GENERAL";
                }
                else
                    content = "SPECIFIC";
            let msg = await message.reply('```css\nWould you like to inquire about the: \n\t\t[' + content + ']\ninformation regarding the stat:\n\t\t[' + statClass.statName.toUpperCase() + ']\n Confirm with a thumb up or cancel with a thumb down.\n```');
            await msg.react("👍")
            await msg.react("👎")
        
        // First argument is a filter function
        msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
        { max: 1, time: 15000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                    //the actual exchange of resources
                    if(!gos){
                        message.reply(statClass.general); 
                        statClass.setGOS(senderClass.tag);
                    }
                    else{
                        message.reply(statClass.specific);
                    }
                    if(!statClass.freebie){//if the stat is 'free' information
                        senderClass.statTokens--;
                        //TO DO: UPDATE GOOGLE SHEETS W/ NEW STAT TOKEN INFO                        
                        functions.updateStatToken(senderClass, "STAT", content, statClass.statName)                     
                    }
                    channel = message.guild.channels.cache.find(c => c.name === `${senderClass.tag}-assets`);
                    channel.bulkDelete(2);

                    exampleEmbed = functions.createAssetsMessage(senderClass);
                    channel.send(exampleEmbed);

                }//if thumbs up
                else
                message.reply('```css\nOperation canceled.\n```');
            }).catch(() => {
                    message.reply('```css\nNo reaction after 15 seconds, operation canceled\n```');
            });

        }//else normal inquiry




    },//execute
};
/*
TO DO LIST:
[] Make sure this still works with new stat names
[] Figure out how to resolve stats with multiple names (League_Nom_de_Plume)
*/