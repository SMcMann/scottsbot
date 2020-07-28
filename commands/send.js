const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')

module.exports = {
    name: 'send',
    cooldown: 5,
    description: 'Send resources to other factions',
    guildOnly: true,
    args: true,
    usage: '<@target> <amount>',
    async execute(message, args) {

        message.channel.send('```CSS\nWorking...\n```');
    
        let senderClass = functions.searchID(message.member);
        if (!senderClass){
            return message.reply("```css\nYou do not have a valid role\n```")
        }


        let superComputer = message.member.roles.cache.some((r) => r.name === "Supercomputer")
        let senderJob = message.member.roles.cache.some((r) => r.name === "Owner")


        if (!senderJob){
            message.reply("```CSS\nYou must be an Owner to manage your team's finances\n```")
            return;
        }
        
        var cash;
        const user1 = message.member.displayName        
        var recieverClass;

        /*grabs the first mention in a command, otherwise should be undefined NO LONGER USED
        let x = message.mentions.members.first();
        if (x)
            recieverClass = functions.searchIDProto(x)
        */

        //checks each arguement provided, and if there is a valid target accepts it. Otherwise break off throwing error
        if (!recieverClass){
            recieverClass = functions.protoValidateTarget(args[0]);
        }
        if (!recieverClass){
            recieverClass = functions.protoValidateTarget(args[1]);
        }
        if (!recieverClass){
            message.reply("```CSS\nNo vailid target found\n```");
            return;
        }

        //stops user from trying to send themselves their own resources
        if (recieverClass === senderClass){
            message.reply("```CSS\nYou cannot send resources to yourself!\n```");
            return;
        }
            

        //checks all arguements to see if there is a valid int provided, then saves it in "amount"
        var amount;
        if (Number.isInteger(parseInt(args[0])))
            amount = parseInt(args[0]);
        else if (Number.isInteger(parseInt(args[1])))
            amount = parseInt(args[1]);
        if (!amount){
            message.reply("```CSS\nYou did not provide a valid amount\n```") 
            return;   
        }    


        //no negative or 0 amounts allowed (no robbery)
        if (amount <= 0){
            message.reply("```CSS\nMust enter amount greater than 0\n```");
            return;
        }

        //lastly checks to see if sender has the correct amount of resources
        try { 
            cash = await functions.getCellValue(senderClass)            
        } catch (error) {
            console.log("Oh shit something wen wrong with a !send command)")
            message.reply("```CSS\nAn error has occurred with this command, please contact control or try again later\n```");
            return;
        }
        if (cash < amount || !cash){
            message.reply("```CSS\nYou do not have enough cash to send\n```");
            return;
        }
            
        let msg = await message.reply('```CSS\nSend ' + amount + " zillion to " + recieverClass.fName +'? \nConfirm with a thumb up or cancel with a thumb down.\n```');
        // Reacts so the user only have to click the emojis
        await msg.react("👍")
        await msg.react("👎")
        
        // First argument is a filter function
        msg.awaitReactions((reaction, user) => user.id === message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                { max: 1, time: 15000 }).then(collected => {
                        if (collected.first().emoji.name == '👍') {
                             //update local data for sake of keeping players in loop
                            senderClass.outgoing(parseInt(amount), "zillions"); 
                            recieverClass.incoming(parseInt(amount), "zillions");  

                            //update google spreadsheets
                            try{
                                functions.updateCashSpreadsheet(senderClass, recieverClass, parseInt(amount));                               
                            }
                            catch {
                                console.log("error with sheets")
                            }

                            //reply to sender confirmation
                            message.reply("```CSS\nSent " + amount + " zillion to " + recieverClass.fName + "\n```");

                            //update whoever recieved the resource in their log channel 
                            var channel = message.client.channels.cache.get(recieverClass.logID);
                            channel.send("```CSS\n[" + 
                            user1 + `] sent you: ` + amount + " zillion\n```" 
                            );
                            //UPDATE BANK INFO FOR RECIEVER
                            channel = message.client.channels.cache.get(recieverClass.bankID);
                            channel.bulkDelete(2);

                            var exampleEmbed = functions.createAssetsMessage(recieverClass);

                            //Update sender bank
                            channel.send(exampleEmbed);
                            
                            channel = message.client.channels.cache.get(senderClass.bankID);
                            channel.bulkDelete(2);

                            exampleEmbed = functions.createAssetsMessage(senderClass);

                            channel.send(exampleEmbed);

                            channel = message.client.channels.cache.get(senderClass.logID);
                            channel.send("```CSS\n[" + user1 + "] sent " + recieverClass.fName + " " + amount + " zillion \n```");
                           
                        }//if thumbs up
                        else
                                message.reply('```css\nOperation canceled.\n```');
                }).catch(() => {
                        message.reply('```CSS\nNo reaction after 15 seconds, operation canceled\n```');
                });
    
    }//execute

}

