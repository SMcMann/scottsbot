const Team = require('./team.js')
const Athlete = require('./athletes.js')
const startup = require('../modules/dataFiles/startupData.json')
const athletes = require('../modules/dataFiles/athleteData.json')
const functions = require('../commands/functions.js')

const fs = require('fs')

module.exports = {  
    var: BJU = new Team(startup.bju),  
    var: FRV = new Team(startup.frv),  
    var: MM = new Team(startup.mm),        
    var: OSU = new Team(startup.osu),

    let: allTeams = [FRV, BJU, MM, OSU],
    var: googleLogRow = 0,
    var: googleLogKudos = 0,
    var: draftPick = 1,
    var: draftRound = 1,   
    var: runningDraft = false,
    var: draftingTeam = "",
    let: athleteArray = [],
    let: draftArray = [],
    let: statArray = [],
    let: athleteArray[0] = {
        "Name": "Scott McMann",
        "League_Nom_de_Plume": "Bob the Ninja Man",
        "FRANCHISE": "DEBUG",
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
    let: draftArray[0] = {
        "Round": "1",
        "Current_Team": "DEBUG",
        "PlayerPickedID": "",
        "PlayerPickedName": "",
        "TimeActive": "",
        "TimeEnd": ""
    },

    call: functions.setupAthletes(),
    call: functions.setupFromGoogle(),
    call: functions.setupDraft(),
    call: functions.loadStats(statArray)

}

 


