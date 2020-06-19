const Team = require('../modules/team.js')
const test = require('../modules/startupData.js')
const functions = require('./functions.js')

module.exports = {
    name: 'stat',
    cooldown: 0,
    guildOnly: true,
    args: true,
    description: 'enables players to make stat inquires into stats in Draft Night',
    usage: '<stat>',
    execute(message, args) {

        let senderClass = functions.searchID(message.member);
        let senderJob = functions.jobCheck(message.member);

        if (senderJob != "GM"){
            throw "```css\nYou must be an GM to inquire about stats\n```"
        }
        else if (senderClass.statTokens === 0){
            throw "```css\nYou are out of Stat Tokens\n```"
        }

        let statClass = functions.statFinder(args[0])
        if (!statClass){
            throw ("```css\nDesired stat of ''" + args[0] + "'' could not be found\n```")
        }
        //if it's one of the basic stats that doesn't require a stat give the generic statement

        let content = ""
        let gos = statClass.getGOS(senderClass.tag)//get the team specific boolean value for a stat
            if(!gos){
                content = "GENERAL";
            }
            else
                content = "SPECIFIC";
        message.reply('```css\nWould you like to inquire about the: \n\t\t[' + content + ']\ninformation regarding the stat:\n\t\t[' + statClass.statName.toUpperCase() + ']\n Confirm with a thumb up or cancel with a thumb down.\n```');
        message.react('👍').then(r => {
            message.react('👎');
    });



    // First argument is a filter function
    message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
    { max: 1, time: 10000 }).then(collected => {
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
                }
                
             }//if thumbs up
             else
             message.reply('```css\nOperation canceled.\n```');
        }).catch(() => {
                message.reply('```css\nNo reaction after 10 seconds, operation canceled\n```');
        });

    },//execute
};
/*
TO DO LIST:
[] Make sure this still works with new stat names
[] Figure out how to resolve stats with multiple names (League_Nom_de_Plume)
*/