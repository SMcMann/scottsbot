const Team = require('../modules/team.js')
const Market = require('../modules/market.js')
const test = require('../modules/startupData.js')
const fs = require('fs');

module.exports = {
    name: 'backup',
    cooldown: 0,
    description: 'backs up all current data to the backup file',
    execute(message, args) {
        // file system module to perform file operations
        if (message.author.id != '140593347520626698') { //Scott's ID so no one else can use it
        throw "YOU DO NOT HAVE PERMISSION FOR THIS COMMAND"
    }

 
        // json data
        var jsonData = '{"persons":[{"name":"John","city":"New York"},{"name":"Phil","city":"Ohio"}]}';
        var jsonContent = "{"
        // parse json
        for (i = 0; i < allNations.length; i++) {
        let jsonObj = allNations[i];
        //console.log(jsonObj);

        // stringify JSON Object
        jsonContent = jsonContent + "\"" + allNations[i].tag + "\": "+ JSON.stringify(jsonObj) + ",\n";
        //console.log(jsonContent);
        }//for 
        //jsonContent = jsonContent.substring(0, jsonContent.length -2);

        jsonContent = jsonContent + "\"market\": "+ JSON.stringify(Mar);

        jsonContent = jsonContent + "}";

        fs.writeFile("backup.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        
        }); 
            console.log("JSON file has been saved.");

    },//backup execute
};