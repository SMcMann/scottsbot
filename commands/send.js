const Nation = require('../modules/nation.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')

module.exports = {
    name: 'send',
    cooldown: 5,
    description: 'Send resources to other factions',
    guildOnly: true,
    args: true,
    usage: '<@target> <amount> <resource type>',
    execute(message, args) {

        let senderClass = functions.serachID(message.member);
        const user = message.member.displayName        
        var recieverClass;

        let x = message.mentions.members.first();
        if (x)
            recieverClass = functions.searchIDProto(x)//grabs the first mention in a command, otherwise should be undefined

            
        var resource= functions.protoValidateResource(args[0]);   
        if (!resource){
            resource = functions.protoValidateResource(args[1])
        }
        if (!resource){
            resource = functions.protoValidateResource(args[2])
        }
        if (!resource){
            throw "No vailid resource found"
        }

        if (!recieverClass){
            recieverClass = functions.protoValidateTarget(args[0]);
        }
        if (!recieverClass){
            recieverClass = functions.protoValidateTarget(args[1]);
        }
        if (!recieverClass){
            recieverClass = functions.protoValidateTarget(args[2]);
        }
        if (!recieverClass){
            throw "No vailid target found"
        }

        if (recieverClass === senderClass)
            throw "You cannot send resources to yourself!"

        var amount;
        if (Number.isInteger(parseInt(args[0])))
            amount = args[0];
        else if (Number.isInteger(parseInt(args[1])))
            amount = args[1];
        else if (Number.isInteger(parseInt(args[2])))
            amount = args[2];  
        if (!amount)    
            throw "You did not provide a valid amount"

        if (amount <= 0)
            throw "Must enter amount greater than 0"

        let valid = senderClass.checkAmount(amount, resource);
        if (!valid)
            throw ("You do not have enough " + resource + " to send");

        

        message.reply('Send ' + amount + " " + resource + " to " + recieverClass.fName +'? \nConfirm with a thumb up or cancel with a thumb down.');
    
        // Reacts so the user only have to click the emojis
        message.react('👍').then(r => {
                message.react('👎');
        });
        
        // First argument is a filter function
        message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                { max: 1, time: 10000 }).then(collected => {
                        if (collected.first().emoji.name == '👍') {
                                
                            senderClass.outgoing(parseInt(amount), resource); // 
                            recieverClass.incoming(parseInt(amount), resource);
                            //reply to sender confirmation
                            message.reply("Sent " + amount + " " + resource + " to " + recieverClass.fName);

                            var channel = message.client.channels.cache.get(recieverClass.logID);
                            channel.send(
                                user + ` sent you: ` + amount + " " + resource
                            );
                            //UPDATE BANK INFO FOR PLAYER
                            channel = message.client.channels.cache.get(recieverClass.bankID);
                            channel.bulkDelete(2);

                            var exampleEmbed = functions.newEmbed(recieverClass);

                            channel.send({ embed: exampleEmbed });

                            channel = message.client.channels.cache.get(senderClass.bankID);
                            channel.bulkDelete(2);

                            exampleEmbed = functions.newEmbed(senderClass);

                            channel.send({ embed: exampleEmbed });

                            channel = message.client.channels.cache.get(senderClass.logID);
                            channel.send(user + " sent " + recieverClass.fName + " " + amount + " " + resource);
                            
                        }//if thumbs up
                        else
                                message.reply('Operation canceled.');
                }).catch(() => {
                        message.reply('No reaction after 10 seconds, operation canceled');
                });
    
    }//execute

}

