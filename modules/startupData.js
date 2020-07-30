const Team = require('./team.js')
const Athlete = require('./athletes.js')
const startup = require('../modules/dataFiles/teamData.json')
const athletes = require('../modules/dataFiles/athleteData.json')
const functions = require('../commands/functions.js')

const fs = require('fs')

module.exports = {  
    var: SUPER = new Team(startup.super),
    var: BJU = new Team(startup.bju),  
    var: JTM = new Team(startup.jtm), 
    var: MM = new Team(startup.mm),    
    var: OSU = new Team(startup.osu),    
    var: FRV = new Team(startup.frv),  
    var: HKR = new Team(startup.hkr),
    var: LEL = new Team(startup.lel),
    var: MCV = new Team(startup.mcv),
    var: AVC = new Team(startup.avc),
    var: MXC = new Team(startup.mxc),
    var: CMC = new Team(startup.cmc),
    var: TU = new Team(startup.tu),
    var: JGL = new Team(startup.jgl),
    var: RYE = new Team(startup.rye),
    var: POL = new Team(startup.pol),
    var: SPI = new Team(startup.spi),

    let: allTeams = [SUPER, BJU, JTM, FRV, OSU, MM, HKR, LEL, MCV, AVC, MXC, CMC, TU, JGL, RYE, POL, SPI], //  
    //var: googleLogRow = 0,
    var: googleLogKudos = 0,
    var: draftPick = 1,
    var: draftRound = 1,   
    var: runningDraft = false,
    var: draftingTeam = [],
    let: athleteArray = [],
    let: draftArray = [],
    let: statArray = [],
    let: coachArray = [],
    let: athleteArray[0] = {
        "Name": "Scott McMann",
        "League_Nom_de_Plume": "Bob the Ninja Man",
        "FRANCHISE": "",
        "Position": "Programmer",
        "Salary": "10,000,000",
        "Popularity": "Super-Duper-star",
        "Playstyles": "MyOwnRules, LooseCanon",
        "Buff_NESS": "MY GOD HE'S SO SWOLE",
        "Theoretical_Squat_Strength": "999999999",
        "Juke_Torque": "99999999",
        "Robot_Percent": "0",
        "Chakra": "Yes",
        "Doctor_Notes": "We use this man to calibrate our equiptment so it knows what a healthy person looks like",
        "Williams_Ratio": "Who is Williams and why is is he rating everyone?",
        "Last_Season_Highlight": "Last time Scott took the field the whole enemy team forfietted on the spot. Then everyone clapped."
    },


    call: functions.setupAthletes(), //set up Athlete Array (Local Data) from the Athelet spreadsheet
    call: functions.updateFromGoogle(),
    call: functions.setupDraft(),
    call: functions.setupCoaches(),
    call: functions.loadStats(statArray),
    call: setInterval(autoBackup, 30000) 
}


 async function autoBackup(){

        var statContent = "{" 
        for (var i = 0; i < statArray.length; i++){
            let jsonObj = statArray[i];
    
            // stringify JSON Object
            statContent = statContent + "\"" + statArray[i].statName + "\": "+ JSON.stringify(jsonObj) + ",\n";
        }//for
        statContent = statContent.substring(0, statContent.length -2);

        statContent = statContent + "}";

        fs.writeFile("./modules/dataFiles/statDataBackup.json", statContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        
        }); 
            console.log("Backed Up!");


 }


