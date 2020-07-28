const Team = require('../modules/team.js')
const startup = require('../modules/dataFiles/backup.json')
const functions = require('./functions.js')

module.exports = {
    name: 'resync',
    cooldown: 0,
    description: 'DOES NOT deletes messages in logs and Assets BUT DOES then publishes current banks to factions',
    async execute(message, args) {

        if (message.author.id != '140593347520626698') { //Scott's ID so no one else can use it
        message.reply("```css\nYOU DO NOT HAVE PERMISSION FOR THIS COMMAND```\n")
        return;
        }//if

        message.reply("```css\nOK if you say so.```\n")

        
        await functions.setupAthletes();
        await functions.setupCoaches();   
        await functions.updateFromGoogle();
        functions.updateKudosChannel(message);

        let draftTracker = "722279997959569458"
        let vpLounge = "728370259148669040";

        for (i = 0; i < allTeams.length; i++) {
            //update all teams banks AKA Assets
            //console.log(allTeams[i].coachBid);
            channel = message.client.channels.cache.get(allTeams[i].bankID);
            channel.bulkDelete(5);

            var bankEmbed = functions.createAssetsMessage(allTeams[i]);
            channel.send(bankEmbed);
            //console.log(bankEmbed);
    
            //delete all messages in the log
            channel = message.client.channels.cache.get(allTeams[i].logID);

        }//for   
              
    },//setUp
};