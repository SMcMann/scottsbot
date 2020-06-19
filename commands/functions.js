const Team = require('../modules/team.js')
const Athlete = require('../modules/athletes.js')
const Draft = require('../modules/draft.js')
const Stats = require('../modules/stats.js')
const { token } = require('../config.json');

const athletes = require('../modules/dataFiles/athleteData.json')
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./client_secret.json')
const doc = new GoogleSpreadsheet('13ePO8VTEsMuXOj8f3gwV6D4DEPSEHyCo9xogWcc3U3Q');     

module.exports = {
    name: 'funtions',
    description: 'does function stuff',
    guildOnly: true,
    args: true,
    usage: '<target>',
    protoValidateTarget(item) {
        if (
            item == "frv" || item === "the french revolution" || item === "france" || item === "<@&"+FRV.roleID+">"
        )
            return FRV;
        else if (
            item === "osu" || item === "osaka" || item === "the osaka underground" || item === "<@&"+OSU.roleID+">"
        )
            return OSU;
        else if (item === "bju"  || item === "beijing" || item === "beijing united" || item === "<@&"+BJU.roleID+">")
            return BJU;
        else if (item === "mm" || item === "mumbai" || item === "the mumbai moguls" || item === "<@&"+MM.roleID+">")
            return MM;
        // Update these with offical names and abbreviations for all factions
    },  
    protoValidateResource(resource){ //does not throw errors
        if (resource === "zillions" || resource === "zillion" || resource === "z") {
            return "zillions";
        }
        else if (resource === "kudos" || resource === "kudo") {
            return "kudos";
        }
    },
    jobCheck(User){ //does not throw errors
        if (User.roles.cache.some((r) => r.name === "Supercomputer")) return "Supercomputer";
        else if (User.roles.cache.some((r) => r.name === "GM")) return "GM";
        else if (User.roles.cache.some((r) => r.name === "Saber")) return "Saber";
        else if (User.roles.cache.some((r) => r.name === "VP")) return "VP";
        else if (User.roles.cache.some((r) => r.name === "Owner")) return "Owner";
        else throw "You don't have a role!"
    },
    searchID(User) {//returns the class of the discord tag of the person doing an action
        if (User.roles.cache.some((r) => r.name === FRV.fName)) return FRV;
        else if (User.roles.cache.some((r) => r.name === BJU.fName)) return BJU;
        else if (User.roles.cache.some((r) => r.name === MM.fName)) return MM;
        else if (User.roles.cache.some((r) => r.name === OSU.fName)) return OSU;
        else throw "```CSS\nYou have no team!\n```"
    },
    searchIDProto(User) {//returns the class of the discord tag of the person doing an action WHY DO I HAVEA DUPLICATE THIS ISN'T SUPPOSED TO RETURN ANYTHING???
        if (User.roles.cache.some((r) => r.name === FRV.fName)) return FRV;
        else if (User.roles.cache.some((r) => r.name === BJU.fName)) return BJU;
        else if (User.roles.cache.some((r) => r.name === MM.fName)) return MM;
        else if (User.roles.cache.some((r) => r.name === OSU.fName)) return OSU;
        else throw "```CSS\nHaving trouble finding your target, maybe try using their role name instead?\n```"
    },
    statFinder(stat) {//
        for (var i = 0; i < statArray.length; i++){
            if (statArray[i].statName === stat)
                return statArray[i];
        }
    },//statFinder
    newEmbed(targetClass) {//creates a new embed specifically for the Banks of all teams
        const exampleEmbed = new Discord.MessageEmbed()
        .setTitle('Bank')
        //.setURL('https://discord.js.org/')
        //.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
        .setDescription(targetClass.fName + "'s assets")
        //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
        .addFields(
            { name: 'Zillions', value: targetClass.zillions },
            //{ name: '\u200B', value: '\u200B' }, //LINE FEED
            { name: 'Kudos Banked: ', value: targetClass.kudosBanked, inline: true },
            { name: 'Kudos Recieved: ', value: targetClass.acquiredKudos, inline: true },
        )
        //.addField('Inline field title', 'Some value here', true)
        //.setImage('https://i.imgur.com/wSTFkRM.png')
        .setTimestamp()
        .setFooter('Updated: ');

        return exampleEmbed;
    },//newEmbed  
    async updateCashSpreadsheet(sender, receiver, cash) {

        await doc.useServiceAccountAuth({
          client_email: creds.client_email,
          private_key: creds.private_key,
        });
      
        await doc.loadInfo(); // loads document properties and worksheets
        //console.log(doc.title);
      
        const sheet = doc.sheetsByIndex[5]; // get's the "Cash" page of the sheets
      
        await (sheet.loadCells('I2:I17'));
        //console.log(sheet.cellStats); // total cells, loaded, how many non-empty
        const senderCell = sheet.getCellByA1(`I${sender.cashCoordinates}`); // or A1 style notation
        const receiverCell = sheet.getCellByA1(`I${receiver.cashCoordinates}`); // or A1 style notation
        //console.log(cell.value)
        senderCell.value = senderCell.value - cash;
        receiverCell.value = receiverCell.value + cash;

        await sheet.saveUpdatedCells();

        const rows = await sheet.getRows(); // can pass in { limit, offset }
        rows[googleLogRow].Sender = sender.fName; //
        rows[googleLogRow].Receiver = receiver.fName
        rows[googleLogRow].Amount = cash


        let date_ob = new Date();
        let date = this.IntTwoChars(date_ob.getDate());
        let month = this.IntTwoChars(date_ob.getMonth() + 1);
        let year = date_ob.getFullYear();
        let hours = this.IntTwoChars(date_ob.getHours());
        let minutes = this.IntTwoChars(date_ob.getMinutes());
        let seconds = this.IntTwoChars(date_ob.getSeconds());
        let dateDisplay = `${hours}:${minutes}:${seconds} ${month}/${date}/${year}`;


        rows[googleLogRow].Timestamp = dateDisplay

        await rows[googleLogRow].save();
        googleLogRow ++;
        console.log("Cash spreadsheet has been updated")
    },//updateCashSpreadsheet
    async updateKudosSpreadsheet(sender, receiver, kudos) {

        await doc.useServiceAccountAuth({
          client_email: creds.client_email,
          private_key: creds.private_key,
        });
      
        await doc.loadInfo(); // loads document properties and worksheets
        //console.log(doc.title);
      
        const sheet = doc.sheetsByIndex[4]; // get's the "kudos" page of the sheets
      
        await (sheet.loadCells('K2:L17'));
        //console.log(sheet.cellStats); // total cells, loaded, how many non-empty
        const senderCell = sheet.getCellByA1(`K${sender.cashCoordinates}`); // or A1 style notation
        const receiverCell = sheet.getCellByA1(`L${receiver.cashCoordinates}`); // or A1 style notation
        //console.log(cell.value)
        senderCell.value = senderCell.value - kudos;
        receiverCell.value = receiverCell.value + kudos;

        await sheet.saveUpdatedCells();

        const rows = await sheet.getRows(); // can pass in { limit, offset }
        rows[googleLogKudos].Sender = sender.fName; //
        rows[googleLogKudos].Receiver = receiver.fName
        rows[googleLogKudos].Amount = kudos


        let date_ob = new Date();
        let date = this.IntTwoChars(date_ob.getDate());
        let month = this.IntTwoChars(date_ob.getMonth() + 1);
        let year = date_ob.getFullYear();
        let hours = this.IntTwoChars(date_ob.getHours());
        let minutes = this.IntTwoChars(date_ob.getMinutes());
        let seconds = this.IntTwoChars(date_ob.getSeconds());
        let dateDisplay = `${hours}:${minutes}:${seconds} ${month}/${date}/${year}`;


        rows[googleLogKudos].Timestamp = dateDisplay

        await rows[googleLogKudos].save();
        googleLogKudos ++;
        console.log("Kudos spreadsheet has been updated")
    },//updateCashSpreadsheet
    IntTwoChars(i) {
        return (`0${i}`).slice(-2);
    },
    async updateFromGoogle(){ //updates the local Data directly NOT JSON from "Current Cash"
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
        
          const sheet = doc.sheetsByIndex[5]; // get's the "Cash" page of the sheets
          const sheet2 = doc.sheetsByIndex[4]; // get's the "kudos" page of the sheets
        
          await (sheet.loadCells('I2:I17'));
          await (sheet2.loadCells('K2:L17'));
          //console.log(sheet.cellStats); // total cells, loaded, how many non-empty


          for (i = 0; i < allTeams.length; i++) {
            cell = sheet.getCellByA1(`I${allTeams[i].cashCoordinates}`);
            cell2 = sheet2.getCellByA1(`K${allTeams[i].cashCoordinates}`);
            cell3 = sheet2.getCellByA1(`L${allTeams[i].cashCoordinates}`);         
            allTeams[i].zillions = cell.value;
            allTeams[i].kudosBanked = cell2.value;
            allTeams[i].acquiredKudos = cell3.value;
        }//for
        console.log("Cash and Kudos have been updated from GoogleSheets 'Current Cash' and 'remaining kudos'");
    },
    async setupFromGoogle(){ //updates the local Data directly NOT JSON from "starting Cash" and "Starting Kudos"
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
        
          const sheet = doc.sheetsByIndex[5]; // get's the "Cash" page of the sheets
          //console.log(sheet.title);
          await (sheet.loadCells('H2:H17'));
          //console.log(sheet.cellStats); // total cells, loaded, how many non-empty


          for (i = 0; i < allTeams.length; i++) {
            cell = sheet.getCellByA1(`H${allTeams[i].cashCoordinates}`);
            allTeams[i].zillions = cell.value;

        }//for
        console.log("Cash Has been updated from GoogleSheets 'Starting Cash'");
        const sheet2 = doc.sheetsByIndex[4]; // get's the "Kudos" page of the sheets
        
        await (sheet2.loadCells('J2:J17'));
        //console.log(sheet.cellStats); // total cells, loaded, how many non-empty
        for (i = 0; i < allTeams.length; i++) {
            cell = sheet2.getCellByA1(`J${allTeams[i].cashCoordinates}`);
            allTeams[i].kudosBanked = cell.value;
        }//for
        console.log("Kudos Has been updated from GoogleSheets 'Starting Kudos'");

    },//setupFromGoogle
    async setupAthletes(){ //creates a locl JSON with all athletes in it as well as loads the data from the Spreadsheet into local data (athleteArray[] and Athlete Class)
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
        
          const sheet = doc.sheetsByIndex[6]; // get's the "Athlete Info" page of the sheets
        
          const rows = await sheet.getRows(); // can pass in { limit, offset }
          var athleteJSON = "{ \n"

          for (var i = 0; i < 90; i++){
            athleteJSON = athleteJSON + `"${i+1}" : `;
              var atheleData = {
                  Name: `${rows[i].Name}`,
                  League_Nom_de_Plume: `${rows[i].League_Nom_de_Plume}`,
                  FRANCHISE: `${rows[i].FRANCHISE}`,
                  Position: `${rows[i].Position}`,
                  Salary: `${rows[i].Salary}`,
                  Popularity: `${rows[i].Popularity}`,
                  Playstyles: `${rows[i].Playstyles}`,
                  Buff_NESS: `${rows[i].Buff_NESS}`,
                  Theoretical_Squat_Strength: `${rows[i].Theoretical_Squat_Strength}`,
                  Juke_Torque: `${rows[i].Juke_Torque}`,
                  Robot_Percent: `${rows[i].Robot_Percent}`,
                  Chakra: `${rows[i].Chakra}`,              
                  Doctor_Notes: `${rows[i].Doctor_Notes}`,
                  Williams_Ratio: `${rows[i].Williams_Ratio}`,
                  Last_Season_Highlight: `${rows[i].Last_Season_Highlight}`

              }//var atheleData  
          
              athleteArray[i+1] = new Athlete(atheleData);
            athleteJSON = athleteJSON + JSON.stringify(atheleData, null, 2) + ',\n';
          }//for i <90
          athleteJSON = athleteJSON.substring(0, athleteJSON.length -2);
          athleteJSON = athleteJSON + '}';
          //console.log(athleteJSON);
          fs.writeFile("./modules/dataFiles/athleteData.json", athleteJSON, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        
        }); 
            console.log("Athlete Data has been loaded from Google Speadsheets.");

          //console.log(sheet.cellStats); // total cells, loaded, how many non-empty

    },//setupAthletes
    async setupDraft(){ //creates a locl JSON with all athletes in it as well as loads the data from the Spreadsheet into local data (athleteArray[] and Athlete Class)
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
        
          const sheet = doc.sheetsByIndex[2]; // get's the "DraftPickTracker" page of the sheets
        
          const rows = await sheet.getRows(); // can pass in { limit, offset }
          //console.log(rows[0].PlayerPickedID);
          var draftJSON = "{ \n"

          for (var i = 0; i < 20; i++){
            draftJSON = draftJSON + `"${i+1}" : `;
              var draftData = {
                Round: rows[i].Round,
                Current_Team: `${rows[i].Current_Team}`,
                PlayerPickedID: `${rows[i].PlayerPickedID}`,
                PlayerPickedName: `${rows[i].PlayerPickedName}`,
                TimeActive: `${rows[i].TimeActive}`,
                TimeEnd: `${rows[i].TimeEnd}`
                
              }//var atheleData  
          
              draftArray[i+1] = new Draft(draftData);
              draftJSON = draftJSON + JSON.stringify(draftData, null, 2) + ',\n';
          }//for i <90
          draftPick = parseInt(rows[0].Current_Pick_No);
          draftJSON = draftJSON.substring(0, draftJSON.length -2);
          draftJSON = draftJSON + '}';
          //console.log(athleteJSON);
          fs.writeFile("./modules/dataFiles/draftData.json", draftJSON, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        
        }); 
            console.log("Draft Data has been loaded from Google Speadsheets.");

          //console.log(sheet.cellStats); // total cells, loaded, how many non-empty

    },//setupDraft
    loadStats(statArray){ //defunt not used. Kept for potentially useful code
   
        var aData;
        var i = 0
        fs.readFile('./modules/dataFiles/statData.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("Error reading file from disk:", err)
                return
            }
            try {
                aData = JSON.parse(jsonString)
                //console.log(aData.[1]) // => "Customer address is: Infinity Loop Drive"
                //console.log(Object.keys(aData));
                
                for (var key in aData) {
                    if (aData.hasOwnProperty(key)) {      
                      var val = aData[key];

                      //new Stats(val);
                      statArray.push(new Stats(val));    // adds a new element (Lemon) to fruits 
                      //console.log(statArray[i]);
                      i++;
                    }
                  }
                  
            } catch(err) {
                console.log('Error parsing JSON string:', err)
            }
        })
        console.log("Stats loaded from JSON")
        return statArray;
        
        
    
    },//load athleates
    async updateDraftPickNo(){
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
        
          const sheet = doc.sheetsByIndex[2]; // get's the "Draft" page of the sheets
        
          await (sheet.loadCells('I2:I3'));
          //console.log(sheet.cellStats); // total cells, loaded, how many non-empty
          var cell1 = sheet.getCellByA1(`I2`); // or A1 style notation
          //console.log(cell.value)
          cell1.value = draftPick;
          await sheet.saveUpdatedCells();

          //console.log("Google Speadhseet Draft Pick No. Updated")

    },//updateDraftPickNo
    async updateDraftPicked(athleteID, fName){
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
        
          const sheet = doc.sheetsByIndex[2]; // get's the "Draft" page of the sheets
        
          const rows = await sheet.getRows(); // can pass in { limit, offset }
          rows[draftPick - 1].PlayerPickedID = athleteID

          //update Athlete Info
          const sheet1 = doc.sheetsByIndex[6]; // get's the "Athlete Info" page of the sheets
          const rows1 = await sheet1.getRows(); // can pass in { limit, offset }
          rows1[athleteID -1].FRANCHISE = fName;

          await rows[draftPick].save();
          await rows1[athleteID - 1].save();
          //console.log("Google Speadhseet Draft Pick No. Updated")

    }//updateDraftPickNo
}//exports
