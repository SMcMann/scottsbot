const Team = require('../modules/team.js')
const Athlete = require('../modules/athletes.js')
const Draft = require('../modules/draft.js')
const Stats = require('../modules/stats.js')
const Coach = require('../modules/coach.js')
const { token } = require('../config.json');

const athletes = require('../modules/dataFiles/athleteData.json')
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./client_secret.json')
const doc = new GoogleSpreadsheet('13ePO8VTEsMuXOj8f3gwV6D4DEPSEHyCo9xogWcc3U3Q');  //link is to "Copy of Draft Night_Discord Integration"   

module.exports = {
    name: 'funtions',
    description: 'does function stuff',
    guildOnly: true,
    args: true,
    usage: '<target>',
    protoValidateTarget(item) {
        if (item === "bju"  || item === "BJU" || item === "beijing" || item === "beijing united" || item === "Beijing United" || item === "<@&"+BJU.roleID+">")
            return BJU; 
        else if (
            item == "jtm" || item === "JTM" || item === "the jakarta tobacco monopoly" || item === "The Jakarta Tobacco Monopoly" || item === "The Jakarta Tobacco Monoploy" || item === "The Jakarta Tobacco Monoply" || item === "jakarta" || item === "<@&"+JTM.roleID+">" 
        )
            return JTM;       
        else if (
            item == "frv" || item === "FRV" || item === "the french revolution" || item === "The French Revolution" || item === "france" || item === "<@&"+FRV.roleID+">" 
        )
            return FRV;
        else if (
            item === "osu" || item === "OSU" || item === "osaka" || item === "the osaka underground" || item === "The Osaka Underground" || item === "<@&"+OSU.roleID+">"
        )
            return OSU;
        else if (item === "mm" || item === "MM" || item === "mumbai" || item === "the mumbai moguls" || item === "The Mumbai Moguls" || item === "<@&"+MM.roleID+">")
            return MM;
        else if (
            item === "hkr" || item === "HKR" || item === "hong" || item === "kong" || item === "riot" || item === "the hong kong riot" || item === "The Hong Kong Riot" || item === "<@&"+HKR.roleID+">"
        )
            return HKR;
        else if (
            item === "lel" || item === "LEL" || item === "london" || item === "elite" || item === "the london elite" || item === "The London Elite" || item === "<@&"+LEL.roleID+">"
        )
            return LEL;
        // Update these with offical names and abbreviations for all factions
    },  
    searchID(User) {//returns the class of the discord tag of the person doing an action
        if (User.roles.cache.some((r) => r.name === BJU.fName)) return BJU;
        else if (User.roles.cache.some((r) => r.name === JTM.fName)) return JTM;
        else if (User.roles.cache.some((r) => r.name === MM.fName)) return MM;
        else if (User.roles.cache.some((r) => r.name === OSU.fName)) return OSU;
        else if (User.roles.cache.some((r) => r.name === FRV.fName)) return FRV;
        else if (User.roles.cache.some((r) => r.name === HKR.fName)) return HKR;
        else if (User.roles.cache.some((r) => r.name === LEL.fName)) return LEL;
    },
    createAssetsMessage(targetClass) {//creates a new message specifically for the Assets of all teams
        var message = "```CSS\n" + targetClass.fName + "'s Assets:\n------------------------------\nZillions: " + targetClass.zillions + "\n";
        message = message + "STAT Query Tokens: " + targetClass.statTokens + "\nBONUS Query Tokens: " + targetClass.bonusTokens + "\n\nCurrently Drafted Athletes:\n"

        for (var i = 0; i < targetClass.athletes.length; i++){
           message = message + "#" + targetClass.athletes[i].athleteID + " " + targetClass.athletes[i].Name + " AKA '" + targetClass.athletes[i].League_Nom_de_Plume + "' (" + targetClass.athletes[i].Position + ")\n"
        } 
        if (targetClass.athletes.length === 0)
            message = message + "[No Athletes Signed]\n"
        
        message = message + "\nCurrent Coach: \n";
        if (!targetClass.coach){
            message = message + "[No Coaches Hired]\n"
        }
        else{
         message = message + targetClass.coach.Name + " " + targetClass.coach.Last_Name + "\nSalary: " + targetClass.coach.Salary + "\n";  
         message = message + "Performance: " + targetClass.coach.Performance_Range + "\nKnown For: ." + targetClass.coach.Known_for + "\n[Bonus Strategy]: [" + targetClass.coach.Bonus_Strategy + "]\n";
        }

        message = message + "\nCurrent Coach Bid:\n"
        if (!targetClass.coachBid.fName){
            message = message + "[No Active Bids]\n"
        }
        else{
            message = message + targetClass.coachBid.fName + " " + targetClass.coachBid.lName 
            + "\nBid Amount: " + targetClass.coachBid.bid + "\n";
        }
         
        let date_ob = new Date();
        let date = this.IntTwoChars(date_ob.getUTCDate());
        let month = this.IntTwoChars(date_ob.getUTCMonth() + 1);
        let year = date_ob.getUTCFullYear();
        let hours = this.IntTwoChars(date_ob.getUTCHours());
        let minutes = this.IntTwoChars(date_ob.getUTCMinutes());
        let seconds = this.IntTwoChars(date_ob.getUTCSeconds());
        let dateDisplay = `${hours}:${minutes}:${seconds} UTC ${month}/${date}/${year}`;
        message = message + "------------------------------\n``````fix\nUpdated: " +  dateDisplay + "\n```";
        
        return message;
    },//createAssetsMessage 
    async updateKudosChannel(message) {//updates the kudos channel with the current information from the spreadsheets
        let kudosData = await this.getAllKudos();
        channel = message.client.channels.cache.get("734173772017565757")
        channel.bulkDelete(50);        

        var msg = "```CSS\n Current Kudos:\n---------------------------------------------" + 
        "\n\tTeams   | Starting | [Remaining] | .Acquired. |" //+  
        //"------------------------------------------------------------------------------------------------------------------\n";
        msg = msg + "\n```"

        await channel.send(msg);      
        msg = "```CSS\n"        
        for (i=0; i < kudosData.length; i++){
           
            msg = msg + `|\t${kudosData[i].Team}   |    ${kudosData[i].Starting}     |\t [${kudosData[i].Remaining}]\t |\t_.${kudosData[i].Acquired}._   |\n`;
            msg = msg + "---------------------------------------------------\n";
     
        }
            msg = msg + "\n```"
            channel.send(msg);   



    },//updateKudosChannel 
    IntTwoChars(i) {
        return (`0${i}`).slice(-2);
    },       
//////////////////////////CASH FUNCTIONS//////////////////////////
    async updateCashSpreadsheet(sender, receiver, cash) {

        await doc.useServiceAccountAuth({
          client_email: creds.client_email,
          private_key: creds.private_key,
        });
      
        await doc.loadInfo(); // loads document properties and worksheets
        //console.log(doc.title);
      
        const sheet = doc.sheetsByIndex[5]; // get's the "Cash" page of the sheets
      
        await (sheet.loadCells('I2:I21'));

        const logCell2 = sheet.getCellByA1(`I19`); // or A1 style notation
        googleLogRow = logCell2.value;

        const senderCell = sheet.getCellByA1(`I${sender.cashCoordinates}`); // or A1 style notation
        const receiverCell = sheet.getCellByA1(`I${receiver.cashCoordinates}`); // or A1 style notation
        //console.log(cell.value)
        senderCell.value = senderCell.value - cash;
        receiverCell.value = receiverCell.value + cash;
        logCell2.value = googleLogRow + 1;

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
        console.log("Cash spreadsheet has been updated")
    },//updateCashSpreadsheet
    async getCellValue(target) {//get cash of current player

        await doc.useServiceAccountAuth({
          client_email: creds.client_email,
          private_key: creds.private_key,
        });
      
        await doc.loadInfo(); // loads document properties and worksheet
        let sheet = doc.sheetsByIndex[5]; // get's the "Cash" page of the sheets
        await (sheet.loadCells('I2:I17'));

        const cell = sheet.getCellByA1(`I${target.cashCoordinates}`); // or A1 style notation

        return cell.value;
    },//getCellValue    

//////////////////////////KUDOS FUNCTIONS//////////////////////////
    async updateKudosSpreadsheet(sender, receiver, kudos) {

        await doc.useServiceAccountAuth({
          client_email: creds.client_email,
          private_key: creds.private_key,
        });
      
        await doc.loadInfo(); // loads document properties and worksheets
        //console.log(doc.title);
      
        const sheet = doc.sheetsByIndex[4]; // get's the "kudos" page of the sheets
      
        await (sheet.loadCells('K2:L20'));
        //console.log(sheet.cellStats); // total cells, loaded, how many non-empty
        const senderCell = sheet.getCellByA1(`K${sender.cashCoordinates}`); // or A1 style notation
        const receiverCell = sheet.getCellByA1(`L${receiver.cashCoordinates}`); // or A1 style notation
        const logCell = sheet.getCellByA1(`K19`); // or A1 style notation
        googleLogKudos = logCell.value;

        //console.log(cell.value)
        senderCell.value = senderCell.value - kudos;
        receiverCell.value = receiverCell.value + kudos;
        logCell.value = googleLogKudos + 1;
        await sheet.saveUpdatedCells();

        const rows = await sheet.getRows(); // update the log
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
        console.log("Kudos spreadsheet has been updated")
    },//updateCashSpreadsheet
    async getKudosValue(target) {

        await doc.useServiceAccountAuth({
          client_email: creds.client_email,
          private_key: creds.private_key,
        });
      
        await doc.loadInfo(); // loads document properties and worksheet
        let sheet = doc.sheetsByIndex[4]; // get's the "Cash" page of the sheets
        await (sheet.loadCells('K2:K17'));

        const cell = sheet.getCellByA1(`K${target.cashCoordinates}`); // or A1 style notation

        return cell.value;
    },//getKudosValue
    async getAllKudos() {

        await doc.useServiceAccountAuth({
          client_email: creds.client_email,
          private_key: creds.private_key,
        });
      
        await doc.loadInfo(); // loads document properties and worksheet
        let sheet = doc.sheetsByIndex[4]; // get's the "Cash" page of the sheets
        const rows = await sheet.getRows(); // can pass in { limit, offset }

        let kudosData = [];

        for (i = 0; i < 16; i++){
            let obj = {
                Team: rows[i].Team,            
                Nickname: rows[i].Discord_Nickname,
                Focus: `${rows[i].Focus}`,
                Starting: rows[i].Starting_Kudos,
                Remaining: rows[i].Remaining_Kudos,
                Acquired: rows[i].Acquired_Kudos,
            }

            kudosData.push(obj);
        }//for

        return kudosData
    },//getKudosValue  
    async updateFromGoogle(){ //updates the local Data directly NOT JSON from "Current Cash" and "Kudos"
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
        
          const sheet = doc.sheetsByIndex[5]; // get's the "Cash" page of the sheets
          const sheet2 = doc.sheetsByIndex[4]; // get's the "kudos" page of the sheets
          const sheet3 = doc.sheetsByIndex[7]; // get's the "STAT Tokens/log" page of the sheets
        
          await (sheet.loadCells('H2:I19'));
          await (sheet2.loadCells('K2:L19'));
          await (sheet3.loadCells('H2:I19'));
          //console.log(sheet.cellStats); // total cells, loaded, how many non-empty

          for (i = 0; i < allTeams.length; i++) {
            cell = sheet.getCellByA1(`I${allTeams[i].cashCoordinates}`);
            cell2 = sheet2.getCellByA1(`K${allTeams[i].cashCoordinates}`);
            cell3 = sheet2.getCellByA1(`L${allTeams[i].cashCoordinates}`);   
            let STATcell = sheet3.getCellByA1(`H${allTeams[i].cashCoordinates}`);   
            let BONUScell = sheet3.getCellByA1(`I${allTeams[i].cashCoordinates}`);   
            
            allTeams[i].zillions = cell.value;
            allTeams[i].kudosBanked = cell2.value;
            allTeams[i].acquiredKudos = cell3.value;
            allTeams[i].statTokens = STATcell.value;
            allTeams[i].bonusTokens = BONUScell.value;
        }//for
        //console.log("Cash and Kudos have been updated from GoogleSheets 'Current Cash' and 'remaining kudos'");
    },
//////////////////////////DRAFT FUNCTIONS//////////////////////////    
    async setupDraft(){ //creates a local JSON with all athletes in it as well as loads the data from the Spreadsheet into local data (athleteArray[] and Athlete Class)
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
        
          const sheet = doc.sheetsByIndex[2]; // get's the "DraftPickTracker" page of the sheets
        
          const rows = await sheet.getRows(); // can pass in { limit, offset }
          currentRound = parseInt(rows[3].Current_Pick_No);
          var draftJSON = "{ \n"

          for (var i = 0; i < 35; i++){
            draftJSON = draftJSON + `"${i+1}" : `;
              var draftData = {
                  Pick: rows[i].Pick_No,
                Round: rows[i].Round,
                Current_Team: `${rows[i].Current_Team}`,
                PlayerPickedID: `${rows[i].PlayerPickedID}`,
                PlayerPickedName: `${rows[i].PlayerPickedName}`
                //TimeActive: `${rows[i].TimeActive}`,
                //TimeEnd: `${rows[i].TimeEnd}`
                
              }//var draftJSON  
          
              draftArray[i+1] = new Draft(draftData);
              draftJSON = draftJSON + JSON.stringify(draftData, null, 2) + ',\n';
          }//for i <90

          draftPick = parseInt(rows[0].Current_Pick_No);
          if (!draftPick)
            draftPick = 0;

          draftJSON = draftJSON.substring(0, draftJSON.length -2);
          draftJSON = draftJSON + '}';
          //console.log(athleteJSON);
          fs.writeFile("./modules/dataFiles/draftData.json", draftJSON, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }        
        }); 

        //reset all the past/current drafts into draftingTeam
        for (var i = 1; i < (draftPick + 1); i++){
            if (!draftArray[i].PlayerPickedID || draftArray[i].PlayerPickedID === "undefined"){
                let obj = {
                    pick: draftArray[i].Pick,            
                    round: draftArray[i].Round,
                    team: draftArray[i].Current_Team,
                    currentRound: currentRound
                } 
                draftingTeam.push(obj);
            }             
          }//for i <90


            console.log("Draft Data has been loaded from Google Speadsheets.");
            console.log("currently active/past drafts\n" + draftingTeam.length)

          //console.log(sheet.cellStats); // total cells, loaded, how many non-empty

    },//setupDraft    
    async updateDraftPickNo(){//updates cell I2 on DraftPickTracker AKA "Current_Pick_No" so that if the bot goes offline, the bot will resume with the right pick when it comes back
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
          cell1.value = cell1.value - 1;
          await sheet.saveUpdatedCells();

          //console.log("Google Speadhseet Draft Pick No. Updated")

    },//updateDraftPickNo
    async updateDraftPicked(athleteID, fName, pickNum){//
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
        
          const sheet = doc.sheetsByIndex[2]; // get's the "DraftPickTracker" page of the sheets 
          const rows = await sheet.getRows(); //
          rows[pickNum - 1].PlayerPickedID = athleteID

          //update Athlete Info
          const sheet1 = doc.sheetsByIndex[6]; // get's the "Athlete Info" page of the sheets
          const rows1 = await sheet1.getRows(); // can pass in { limit, offset }
          rows1[athleteID -1].FRANCHISE = fName;

          await rows[pickNum- 1].save(); //save the row of the pcik that was made
          await rows1[athleteID - 1].save(); //save the row of the athlete in "Athlete Info"
          //console.log("Google Speadhseet Draft Pick No. Updated")
          //console.log(draftPick)
          //console.log(athleteID)

    },//updateDraftPickNo
    async getCurrentDraft(){ //
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
        await doc.loadInfo(); // loads document properties and worksheets
        //console.log(doc.title);
    
        const sheet = doc.sheetsByIndex[2]; // get's the "Athlete Info" page of the sheets
        const rows = await sheet.getRows(); // can pass in { limit, offset }

        currentPick = (parseInt(rows[0].Current_Pick_No));
        currentRound = parseInt(rows[3].Current_Pick_No);

        let obj = {
            pick: rows[currentPick].Pick_No,            
            round: parseInt(rows[currentPick].Round),
            team: `${rows[currentPick].Current_Team}`,
            currentRound: currentRound
        }
        return obj;
    },//getCurrentDraft()
    async getDraft(pick){ //
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
        await doc.loadInfo(); // loads document properties and worksheets
        //console.log(doc.title);
    
        const sheet = doc.sheetsByIndex[2]; // get's the "Athlete Info" page of the sheets
        const rows = await sheet.getRows(); // can pass in { limit, offset }

        currentPick =  (parseInt(pick) -1)
        currentRound = parseInt(rows[3].Current_Pick_No);

        let obj = {
            pick: rows[currentPick].Pick_No,            
            round: parseInt(rows[currentPick].Round),
            team: `${rows[currentPick].Current_Team}`,
            currentRound: currentRound
        }
        return obj;
    },//getDraft()
    async updateDraftRound(draftRound, draftPick){ 
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
        await doc.loadInfo(); // loads document properties and worksheets
        //console.log(doc.title);
    
        const sheet = doc.sheetsByIndex[2]; // get's the "Athlete Info" page of the sheets
        const rows = await sheet.getRows(); // can pass in { limit, offset }

        rows[0].Current_Pick_No = draftPick;
        rows[3].Current_Pick_No = draftRound;

        await rows[0].save();
        await rows[3].save();

    },//getCurrentDraft()   
//////////////////////////ATHLETE FUNCTIONS//////////////////////////    
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
                  Last_Season_Highlight: `${rows[i].Last_Season_Highlight}`,
                  athleteID: (i+1)
              }//var atheleData  
          
              athleteArray[i+1] = new Athlete(atheleData);
            athleteJSON = athleteJSON + JSON.stringify(atheleData, null, 2) + ',\n';

          }//for i <90
          athleteJSON = athleteJSON.substring(0, athleteJSON.length -2);
          athleteJSON = athleteJSON + '}';
          //blaze it
          fs.writeFile("./modules/dataFiles/athleteData.json", athleteJSON, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        
        }); 

        for (var i = 0; i < athleteArray.length; i++){
            if (athleteArray[i].FRANCHISE){
                //console.log(athleteArray[i])
                let exist = false;
                let team = this.protoValidateTarget(athleteArray[i].FRANCHISE);
                for (j=0; j < team.athletes.length; j++){
                    if (team.athletes[j].Name === athleteArray[i].Name){
                        exist = true;
                    }
                }//for
                if(!exist)
                   team.athletes.push(athleteArray[i])                    
            }//if
        }//for

        //console.log("Athlete Data has been loaded from Google Speadsheets.");
    },//setupAthletes
//////////////////////////STATS FUNCTIONS////////////////////////// 
async getStatToken(target, type) {//get cash of current player

    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });
  
    await doc.loadInfo(); // loads document properties and worksheet
    let sheet = doc.sheetsByIndex[7]; // get's the "Cash" page of the sheets

    var cell;

    if (type === "STAT"){
        await (sheet.loadCells('H2:H17'));
        cell = sheet.getCellByA1(`H${target.cashCoordinates}`); // or A1 style notation        
    }
    else{
        await (sheet.loadCells('I2:I17'));
        cell = sheet.getCellByA1(`I${target.cashCoordinates}`); // or A1 style notation 
    }

    return cell.value;
},//getStatToken    
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
async updateStatToken(target, type, GOS) {

    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });
  
    await doc.loadInfo(); // loads document properties and worksheets
    //console.log(doc.title);
  
    const sheet = doc.sheetsByIndex[7]; // get's the "Stat Token" page of the sheets
  
    await (sheet.loadCells('H2:I21'));

    const logCell2 = sheet.getCellByA1(`I19`); // or A1 style notation
    googleLogRow = logCell2.value;
    let targetCell;

    if (type === "STAT"){
        targetCell = sheet.getCellByA1(`H${target.cashCoordinates}`); // or A1 style notation        
    }
    else{
        targetCell = sheet.getCellByA1(`I${target.cashCoordinates}`); // or A1 style notation          
    }


    //console.log(cell.value)
    targetCell.value = targetCell.value - 1;

    logCell2.value = googleLogRow + 1;

    await sheet.saveUpdatedCells();

    const rows = await sheet.getRows(); // can pass in { limit, offset }
    rows[googleLogRow].Inquierer = target.fName; //
    rows[googleLogRow].Inquiry_Type = type;
    rows[googleLogRow].GoS = GOS;


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
    console.log("stat token updated")
},//updateCashSpreadsheet
//////////////////////////COACHES FUNCTIONS//////////////////////////    
    async setupCoaches(){ //
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
        
          const sheet = doc.sheetsByIndex[3]; // get's the "Coaches" page of the sheets
        
          const rows = await sheet.getRows(); // can pass in { limit, offset }
          var coachJSON = "{ \n"

          for (var i = 0; i < 16; i++){
            coachJSON = coachJSON + `"${i+1}" : `;
            var coachData = {
                coachID: i+1,
                FRANCHISE: `${rows[i].CURRENT_FRANCHISE}`,
                Name: `${rows[i].Name}`,
                Last_Name: `${rows[i].Last_Name}`,
                Known_for: `${rows[i].Known_for}`,
                Bonus_Strategy: `${rows[i].Bonus_Strategy}`,
                Reputation: `${rows[i].Reputation}`,
                Salary: `${rows[i].Salary}`,
                Performance_Range: `${rows[i].Performance_Range}`,
                Min_Performance: `${rows[i].Min_Performance}`,
                Max_Performance: `${rows[i].Max_Performance}`,
                changedFranchise: false,
                bids: []
            }//var coachData  
          
            coachArray[i+1] = new Coach(coachData);
              coachJSON = coachJSON + JSON.stringify(coachData, null, 2) + ',\n';
          }//for i <90
          coachJSON = coachJSON.substring(0, coachJSON.length -2);
          coachJSON = coachJSON + '}';
          //console.log(coachJSON);
          fs.writeFile("./modules/dataFiles/coachData.json", coachJSON, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        
        });
        
        //load any bids from the bid section thing of the spreadsheet god I am tired
        for (i=0; i < allTeams.length; i++){

            let obj = {
                fName: rows[allTeams[i].cashCoordinates -2].fName,
                lName: rows[allTeams[i].cashCoordinates -2].lName,
                bid: rows[allTeams[i].cashCoordinates -2].bid,
                bidder: allTeams[i].fName
            }
            allTeams[i].coachBid = obj;
        }//for

        //re-add coaches to their teams
        for (var i = 1; i < coachArray.length; i++){
            if (coachArray[i].FRANCHISE){
                //console.log(athleteArray[i])
                let team = this.protoValidateTarget(coachArray[i].FRANCHISE);
                team.coach = coachArray[i]
            }//if
        }//for

        //console.log("Coach Data has been loaded from Google Speadsheets.");
    },//setupCoaches
    async updateCoachLog(offer, team){ //
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
          });
        
          await doc.loadInfo(); // loads document properties and worksheets
          //console.log(doc.title);
          
          let date_ob = new Date();
          let date = this.IntTwoChars(date_ob.getUTCDate());
          let month = this.IntTwoChars(date_ob.getUTCMonth() + 1);
          let year = date_ob.getUTCFullYear();
          let hours = this.IntTwoChars(date_ob.getUTCHours());
          let minutes = this.IntTwoChars(date_ob.getUTCMinutes());
          let seconds = this.IntTwoChars(date_ob.getUTCSeconds());
          let dateDisplay = `${hours}:${minutes}:${seconds} UTC ${month}/${date}/${year}`;
        
          const sheet = doc.sheetsByIndex[3]; // get's the "Coaches" page of the sheets     
          const rows = await sheet.getRows(); // can pass in { limit, offset }

          if (offer.bid > 0){//if this is a incoming bid
            let logRow = parseInt(rows[18].CURRENT_FRANCHISE);
            //console.log(logRow);

            rows[logRow].Team = team.fName;
            rows[logRow].Bid = offer.bid;       
            rows[logRow].Coach = offer.lName; 
            rows[logRow].Time = dateDisplay

            rows[18].CURRENT_FRANCHISE = (logRow + 1);
            await rows[logRow].save();      
            await rows[18].save();                                
          }


          //update the bid area
          rows[team.cashCoordinates-2].fName = offer.fName;
          rows[team.cashCoordinates-2].lName = offer.lName;
          rows[team.cashCoordinates-2].bid = offer.bid;



          await rows[team.cashCoordinates-2].save();

        //console.log("Coach Data has been loaded from Google Speadsheets.");
    },//updateCoachLog
    async updateCoach(coach, team){ //
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
        });
        
        await doc.loadInfo(); // loads document properties and worksheets
        //console.log(doc.title);
                
        const sheet = doc.sheetsByIndex[3]; // get's the "Coaches" page of the sheets     
        const rows = await sheet.getRows(); // can pass in { limit, offset }

        let rowNum = (coach.coachID -1)

        rows[rowNum].CURRENT_FRANCHISE = team.fName;
        rows[rowNum].Salary = coach.Salary;                            

        await rows[rowNum].save();
    },//updateCoach
    async removeCoachOldTeam(coach){ //
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
        });
        
        await doc.loadInfo(); // loads document properties and worksheets
        //console.log(doc.title);
                
        const sheet = doc.sheetsByIndex[3]; // get's the "Coaches" page of the sheets     
        const rows = await sheet.getRows(); // can pass in { limit, offset }

        let rowNum = (coach.coachID -1)

        rows[rowNum].CURRENT_FRANCHISE = "";                        

        await rows[rowNum].save();
    },//updateCoach
    async endRoundCoaches(message){
        await this.setupCoaches();
        for (i = 0; i < allTeams.length; i++) {
            let BID = allTeams[i].coachBid
            var coach;
            if (BID.bid > 0){//if there is a valid bid for this round

                for (j =1; j < coachArray.length && !coach; j++){//get the coach the team is bidding on
                    if (BID.fName === coachArray[j].Name){
                        coach = coachArray[j];
                    }//if bid
                }//for coachArray
                if (BID.bidder === coach.FRANCHISE){
                    channel = message.client.channels.cache.get(allTeams[i].logID)
                    channel.send("```css\nYou somehow managed to bid on your own coach, despite my best efforts. I am not mad, I am just very disappointed in you.\n[DISSAPPOINTMENT NODE ENGAGED]\n```")
                    console.log(`Hey ${allTeams[i].fName} managed to bid on their own Coach, please investigate`);
                }
                else if (BID.bid > coach.Salary){ //check if the bid was successful
                    coach.changedFranchise = true;

                    //Hail Stan//
                    coach.bids.push(BID)
                }//if BID > SALARY
                else {//inform team their bid was unsuccessful
                    channel = message.client.channels.cache.get(allTeams[i].logID)
                    channel.send("```css\nYour bid on Coach [" + BID.fName + " " + BID.lName + "] for " + BID.bid + "z was unsuccessful.\n```")

                }//else

                allTeams[i].coachBid = { //finally remove this team's bid
                    fName: "",
                    lName: "",
                    bid: 0
                }  
                this.updateCoachLog(allTeams[i].coachBid, allTeams[i])
            }//if BID

            
        }//for allTeams
        for (var i = 1; i < coachArray.length; i++){
            if (coachArray[i].changedFranchise){
                let coach = coachArray[i];
                //1) get the highest bid on the coach
                let bidArray = coachArray[i].bids;
                let highetsBid = 0;
                let winner;
                let tie = false;
                let tieHolder = [];
            
                for (j = 0; j < bidArray.length; j++){
                    if (highetsBid < bidArray[j].bid){
                        highetsBid = bidArray[j].bid
                        winner = bidArray[j];
                        tie = false
                        tieHolder.splice(0, tieHolder.length);
                    }//if
                    else if (highetsBid === bidArray[j].bid){
                        tie = true;
                        tieHolder.push(bidArray[j])
                    }
                }//for
                //2) check to see if there are ties                
                if (tieHolder.length > 0){
                    for (k=0; k<tieHolder.length; k++){
                        let unluckyChap = this.protoValidateTarget(tieHolder.bidder);
                        channel = message.client.channels.cache.get(unluckyChap.logID)   
                        channel.send("```css\nYou tied another player for your bid on Coach: " + coachArray[k].lName +"!\nNeither team was successful at hiring this coach\n```");                          
                        
                    }
                    console.log("Some GMs tied for a Coach Bid, please adjudicate.\nBid Amount: " + highetsBid + "\nCoach: " + coachArray[i].lName)
                }//if there was a tie for highest bidder
                else{
                    if (coach.FRANCHISE){//if the coach already belonged to a francise
                        //update the outbid that they have lost their coach
                        let outbid = this.protoValidateTarget(coach.FRANCHISE);
                        channel = message.client.channels.cache.get(outbid.logID)
                        channel.send("```css\nYour coach has been poached by " + winner.bidder +"!\n```");
                        delete outbid.coach;

                    }//
                    //increase coaches salary
                    coach.Salary = highetsBid;

                    //award them the coach
                    let winnerClass = this.protoValidateTarget(winner.bidder);
                    let previousCoach = winnerClass.coach;

                    if(previousCoach){//if the winner had an old coach
                        this.removeCoachOldTeam(previousCoach);
                    }
                    winnerClass.coach = coach;

                    channel = message.client.channels.cache.get(winnerClass.logID)
                    let msg = ("```css\nYour bid was successful!\nCoach " + coach.Name + " " + 
                        coach.Last_Name +" has been recruited for " + highetsBid +" Zillion\n```");
                    channel.send(msg);

                    channel = message.client.channels.cache.get(winnerClass.bankID)
                    channel.bulkDelete(2);
                    msg = this.createAssetsMessage(winnerClass);
                    channel.send(msg);

                    //finally update the spreadsheet
                    this.updateCoach(coach, winnerClass)
                }//else

                coachArray[i].changedFranchise = false;
            }//if coachArray[i].changedFranchise is true


        }//for coach array

    }
}//exports
