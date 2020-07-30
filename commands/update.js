const Team = require('../modules/team.js');
const Stats = require('../modules/stats.js');
const functions = require('./functions.js');
const test = require('../modules/startupData.js');
const athletes = require('../modules/dataFiles/athleteData.json');
const fs = require('fs');


module.exports = {
    name: 'update',
    cooldown: 0,
    description: 'updates stat GOS from backup',
    guildOnly: true,
    args: false,
    usage: '',
    async execute(message, args) {

    }//execute

}

