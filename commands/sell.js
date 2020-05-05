const Nation = require('../modules/nation.js')
const Market = require('../modules/market.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')

module.exports = {
    name: 'sell',
    cooldown: 5,
    description: 'Buys resource from the market',
    guildOnly: true,
    args: true,
    usage: '<amount> <resource type>', 
    execute(message, args) {

        const user = message.member.displayName

        let buyerClass = functions.serachID(message.member);
        var userAmount = buyerClass.resource
        var resource = functions.validateResource(args[1])
        if (userAmount === 0)
            throw ("You do not have any " + resource );        
        var mPrice = Mar.getPrice(resource)
        var total = args[0] * mPrice;

        //if (buyerClass.credits < total)
          //  throw "Insufficient funds";


        if (args[0] <= 0)
            throw "must enter amount greater than 0"

        message.reply('Sell ' + args[0] + ' ' + resource+ ' for a total of ' + total + ' credits? \nConfirm with a thumb up or cancel with a thumb down.');
    
        // Reacts so the user only have to click the emojis
        message.react('👍').then(r => {
                message.react('👎');
        });
        
         //First argument is a filter function
        message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                { max: 1, time: 10000 }).then(collected => {
                        if (collected.first().emoji.name == '👍') {
                            var j = 0;
                            var userAmount = buyerClass.resource
                            for(var i = 0; i < parseInt(args[0]); i++){
                                if (userAmount === 0)
                                    break 
                                                                   
                                buyerClass.incoming(mPrice, "credits");
                                buyerClass.outgoing(1, resource);         
                                Mar.sell(1, resource);
                                userAmount--
                                j++;

                            }
                            //update price
                            Mar.updatePrice(j, resource, false);

                            message.reply("Market action completed, check you faction log for details.");
                            //update buyer log
                            var channel = message.client.channels.cache.get(buyerClass.logID);
                            channel.send(
                                user + ` successfully sold: ` + j + " out of " + args[0] + " " + args[1] + " to the market for a total of: " + (mPrice * j) 
                            );
                            //update bank
                            channel = message.client.channels.cache.get(buyerClass.bankID);
                            channel.bulkDelete(2);

                            var exampleEmbed = functions.newEmbed(buyerClass);

                            channel.send({ embed: exampleEmbed });
                            //update the Market
                            channel = message.client.channels.cache.get(Mar.logID);
                            channel.bulkDelete(2);

                            exampleEmbed = functions.marketEmbed(Mar)
                            channel.send({ embed: exampleEmbed });
                        }//if thumbs up
                        else
                                message.reply('Operation canceled.');
                }).catch(() => {
                        message.reply('No reaction after 10 seconds, operation canceled');
                });
    
    }//execute

}

