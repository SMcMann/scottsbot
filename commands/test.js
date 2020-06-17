const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const athletes = require('../modules/dataFiles/athleteData.json')

//const athleteJson = require('../modules/dataFiles/athleteData.json')

const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { promisify } = require('util');
const fs = require('fs')

const creds = require('./client_secret.json')
const doc = new GoogleSpreadsheet('1bwNZDylRvbWbIwk4GvvNOK4qugV7QzDVgw9ZyjRR6ZM');        


module.exports = {
    name: 'test',
    cooldown: 0,
    description: 'pulls info from a google sheet',
    guildOnly: true,
    args: false,
    usage: '',
    execute(message, args) {
 


    }//execute

}