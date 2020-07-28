const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')

module.exports = {
    name: 'kudos',
    cooldown: 5,
    description: 'Send resources to other factions',
    guildOnly: true,
    args: false,
    usage: '<@target> <amount> OR <@target> for single kudos amount',
    async execute(message, args) {
        const vpChannel = "728370259148669040";

        let senderClass = functions.searchID(message.member);
        if (!senderClass){
            return message.reply("```css\nYou do not have a valid role\n```")
        }

        let senderJob = message.member.roles.cache.some((r) => r.name === "VP")

        if (!senderJob){
            message.reply("```css\nYou must be an Vice President to use this command\n```");
            return;
        }

        if (message.channel != vpChannel){
            message.author.send("```css\n It appears you have attempted to use the !kudos command outside the VP lounge. This is a breach of your contract of secrecy." +
             "\nPlease do not attempt this again.\n[THIS INTERACTION HAS BEEN LOGGED]\n```")
             let msgID = message.id;
            message.delete();
             return;
        }
            
        message.reply('```CSS\nWorking...\n```');

        const user = message.member.displayName        
        var recieverClass;
        var amount;
        resource = "kudos";

        if (args.length === 2){//if the user has 2 arguements, meaning they are sending more than 1 kudos
            //*grabs the first mention in a command, otherwise should be undefined
            let x = message.mentions.members.first();
            if (x){
                recieverClass = functions.searchIDProto(x)
            }
        
            //checks each arguement provided, and if there is a valid target accepts it. Otherwise break off throwing error
            if (!recieverClass){
                recieverClass = functions.protoValidateTarget(args[0]);
            }
            if (!recieverClass){
                recieverClass = functions.protoValidateTarget(args[1]);
            }
            if (!recieverClass){
                message.reply("```css\nNo vailid target found\n```")
                return;
            }

            //stops user from trying to send themselves their own resources
            if (recieverClass === senderClass){
                message.reply("```css\nYou cannot send resources to yourself!\n```")
                return; 
            }

            //checks all arguements to see if there is a valid int provided, then saves it in "amount"
            if (Number.isInteger(args[0]))
                amount = parseInt(args[0]);
            else if (Number.isInteger(args[1]))
                amount = parseInt(args[1]);
            if (!amount){
                message.reply("```css\nYou did not provide a valid amount\n```")
                return; 
            }    

            //no negative or 0 amounts allowed (no robbery)
            if (amount <= 0){
                message.reply("```css\nMust enter amount greater than 0\n```")
                return;
            }
            }//(args.length === 2)
        else if (args.length === 1){
                //*grabs the first mention in a command, otherwise should be undefined
                let x = message.mentions.members.first();
                if (x){
                    recieverClass = functions.searchIDProto(x);
                }
                
                //checks each arguement provided, and if there is a valid target accepts it. Otherwise break off throwing error
                if (!recieverClass){
                    recieverClass = functions.protoValidateTarget(args[0]);
                }
                if (!recieverClass){
                    message.reply("```css\nNo vailid target found\n```")
                    return;
                }

                 //stops user from trying to send themselves their own resources
                 if (recieverClass === senderClass){
                    message.reply("```css\nYou cannot send resources to yourself!\n```")
                    return; 
                }               
                amount = 1;

        }//else if (args.length === 1)
        else if (args.length > 2){
            message.reply("```CSS\nYou have too many arguemnts. \n Proper usade of !kudos is: \n <@target> <amount> OR <@target> for single kudos amount \n```")
            return;
        }

        //lastly checks to see if sender has the correct amount of resources
        let kudosBanked = await functions.getKudosValue(senderClass, resource);
        if (kudosBanked < amount){
            message.reply("```CSS\nYou do not have enough kudos to send```\n")
            return;                
        }

        let msg = await message.channel.send('```CSS\nSend ' + amount + " kudos to " + recieverClass.fName +'? \nConfirm with a thumb up or cancel with a thumb down.```\n');
    
        // Reacts so the user only have to click the emojis
        await msg.react("👍")
        await msg.react("👎")
        
        // First argument is a filter function
        msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                { max: 1, time: 15000 }).then(async collected => {
                        if (collected.first().emoji.name == '👍') {
                             //update local data for sake of keeping players in loop
                             senderClass.outgoing(parseInt(amount), resource); 
                             recieverClass.incoming(parseInt(amount), resource); 
                            //update google spreadsheets
                            //UPDATE VP Lounge
                            channel = message.client.channels.cache.get(vpChannel);
                            channel.send("```CSS\n["+ user + "] sent " + recieverClass.fName + " " + amount + " kudos ```\n");   

                            try{
                              await functions.updateKudosSpreadsheet(senderClass, recieverClass, parseInt(amount));                                                   
                            }
                            catch {
                                console.log("error with sheets updating kudos\nPlayer: " + senderClass.fName + "\nKudos sent: " + 
                                amount + "\nTarget: " + recieverClass.fName)
                            } 

                            //reply to sender confirmation
                            //message.reply("```CSS\nOperation complete```\n");
 

                            functions.updateKudosChannel(message);  
                            
                        }//if thumbs up
                        else
                                message.reply('```css\nOperation canceled.```\n');
                }).catch(() => {
                        message.reply('```css\nNo reaction after 15 seconds, operation canceled```\n');
                });
    
    }//execute

}

