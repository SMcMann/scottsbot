const Team = require('../modules/team.js')
const Market = require('../modules/market.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')

module.exports = {
    name: 'buy',
    cooldown: 5,
    description: 'Buys resource from the market',
    guildOnly: true,
    args: true,
    usage: '<amount> <resource type>', 
    execute(message, args) {

        const user = message.member.displayName

        let buyerClass = functions.serachID(message.member);
        var resource = functions.validateResource(args[1]);   

        var mAmount = Mar.getAmount(resource);

        if (mAmount === 0)
            throw ("The market is out of " + resource );        
        var mPrice = Mar.getPrice(resource);
        var total = args[0] * mPrice;

        if (buyerClass.credits < total)
            throw "Insufficient funds";


        if (args[0] <= 0)
            throw "must enter amount greater than 0"

        message.reply('Attempt to purchase ' + args[0] + ' ' + resource + ' for a total of ' + total + ' credits? \nConfirm with a thumb up or cancel with a thumb down.');
    
        // Reacts so the user only have to click the emojis
        message.react('👍').then(r => {
                message.react('👎');
        });
        
         //First argument is a filter function
        message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                { max: 1, time: 10000 }).then(collected => {
                        if (collected.first().emoji.name == '👍') {
                            var j = 0;
                            mAmount = Mar.getAmount(resource);
                            for(var i = 0; i < parseInt(args[0]); i++){
                                if (mAmount === 0)
                                    break;

                                buyerClass.outgoing(mPrice, "credits");
                                buyerClass.incoming(1, resource);         
                                Mar.buy(1, resource);
                                mAmount--
                                j++;
                            }
                            //update price
                            Mar.updatePrice(j, resource, true);

                            message.reply("Market action completed, check you faction log for details.");
                            //update buyer log
                            var channel = message.client.channels.cache.get(buyerClass.logID);
                            channel.send(
                                user + ` successfully bought: ` + j + " out of " + args[0] + " " + resource + " from the market for a total of: " + (mPrice * j) 
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

