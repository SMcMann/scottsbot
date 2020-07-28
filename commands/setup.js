const Team = require('../modules/team.js')
const test = require('../modules/startupData.js')
const functions = require('./functions.js')

module.exports = {
    name: 'setup',
    cooldown: 0,
    description: 'deletes messages in logs and banks and then publishes current banks to factions',
    async execute(message, args) {

        if (message.author.id != '140593347520626698') { //Scott's ID so no one else can use it
        message.reply("```css\nYOU DO NOT HAVE PERMISSION FOR THIS COMMAND```\n")
        return;
        }//if
    
        //await functions.setupAthletes();

        let draftTracker = "722279997959569458"
        let vpLounge = "728370259148669040";
        //re-add athlete's to their teams athlete[]



        for (i = 0; i < allTeams.length; i++) {
            //update all teams banks AKA Assets
            channel = message.client.channels.cache.get(allTeams[i].bankID);
            channel.bulkDelete(5);

            var bankEmbed = functions.createAssetsMessage(allTeams[i]);
            channel.send(bankEmbed);
            //console.log(bankEmbed);
    
            //delete all messages in the log
            channel = message.client.channels.cache.get(allTeams[i].logID);
            channel.bulkDelete(100);
        }//for   
            //clear out the draft tracker
            channel = message.client.channels.cache.get(draftTracker);
            channel.bulkDelete(100);

            //clear out the vp lounge
            channel = message.client.channels.cache.get(vpLounge);
            channel.bulkDelete(100);
            
            functions.updateKudosChannel(message);
                   
        // }, 2000);
    },//setUp
};