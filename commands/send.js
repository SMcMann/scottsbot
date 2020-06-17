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
    execute(message, args) {

        let senderClass = functions.searchID(message.member);
        let senderJob = functions.jobCheck(message.member)

        if (senderJob != "Owner"){
            throw "You must be an Owner to manage your team's finances"
        }

        const user = message.member.displayName        
        var recieverClass;

        //grabs the first mention in a command, otherwise should be undefined
        let x = message.mentions.members.first();
        if (x)
            recieverClass = functions.searchIDProto(x)

        //checks each arguement provided, and if there is a valid target accepts it. Otherwise break off throwing error
        if (!recieverClass){
            recieverClass = functions.protoValidateTarget(args[0]);
        }
        if (!recieverClass){
            recieverClass = functions.protoValidateTarget(args[1]);
        }
        if (!recieverClass){
            throw "No vailid target found"
        }

        //stops user from trying to send themselves their own resources
        if (recieverClass === senderClass)
            throw "You cannot send resources to yourself!"

        //checks all arguements to see if there is a valid int provided, then saves it in "amount"
        var amount;
        if (Number.isInteger(parseInt(args[0])))
            amount = args[0];
        else if (Number.isInteger(parseInt(args[1])))
            amount = args[1];
        if (!amount)    
            throw "You did not provide a valid amount"

        //no negative or 0 amounts allowed (no robbery)
        if (amount <= 0)
            throw "Must enter amount greater than 0"

        //lastly checks to see if sender has the correct amount of resources
        let valid = senderClass.checkAmount(amount, "zillions");
        if (!valid)
            throw ("You do not have enough cash to send");

        

        message.reply('Send ' + amount + " zillion to " + recieverClass.fName +'? \nConfirm with a thumb up or cancel with a thumb down.');
    
        // Reacts so the user only have to click the emojis
        message.react('👍').then(r => {
                message.react('👎');
        });
        
        // First argument is a filter function
        message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                { max: 1, time: 10000 }).then(collected => {
                        if (collected.first().emoji.name == '👍') {
                             //the actual exchange of resources  

                            senderClass.outgoing(parseInt(amount), "zillions"); 
                            recieverClass.incoming(parseInt(amount), "zillions");

                            //reply to sender confirmation
                            message.reply("Sent " + amount + " zillion to " + recieverClass.fName);

                            //update whoever recieved the resource in their log channel 
                            var channel = message.client.channels.cache.get(recieverClass.logID);
                            channel.send(
                                user + ` sent you: ` + amount + " zillion" 
                            );
                            //UPDATE BANK INFO FOR RECIEVER
                            channel = message.client.channels.cache.get(recieverClass.bankID);
                            channel.bulkDelete(2);

                            var exampleEmbed = functions.newEmbed(recieverClass);

                            //Update sender bank
                            channel.send({ embed: exampleEmbed });
                            
                            channel = message.client.channels.cache.get(senderClass.bankID);
                            channel.bulkDelete(2);

                            exampleEmbed = functions.newEmbed(senderClass);

                            channel.send({ embed: exampleEmbed });

                            channel = message.client.channels.cache.get(senderClass.logID);
                            channel.send(user + " sent " + recieverClass.fName + " " + amount + " zillion ");

                            //update google spreadsheets
                            try{
                             functions.updateCashSpreadsheet(senderClass, recieverClass, parseInt(amount));                               
                            }
                            catch {
                                console.log("error with sheets")
                            }

                            
                        }//if thumbs up
                        else
                                message.reply('Operation canceled.');
                }).catch(() => {
                        message.reply('No reaction after 10 seconds, operation canceled');
                });
    
    }//execute

}

