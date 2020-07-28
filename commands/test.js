const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const athletes = require('../modules/dataFiles/athleteData.json')


module.exports = {
    name: 'test',
    cooldown: 0,
    description: 'pulls info from a google sheet',
    guildOnly: true,
    args: false,
    usage: '',
    async execute(message, args) {

        //console.log(draftArray[1]);
        functions.updateKudosChannel(message);

        //let x = allnumeric(args[0])

        //console.log(args[0]);

        //kudos = await  functions.getCellValue(senderClass, "kudos")        
        //console.log(kudos);
    }//execute

}

