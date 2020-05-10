const Team = require('./team.js')
const Market = require('../modules/market.js')
const startup = require('../modules/dataFiles/startupData.json')

    //console.log(naf)
module.exports = {

    var: FRV = new Team(startup.frv),  
    var: BJU = new Team(startup.bju),
    var: MM = new Team(startup.mm),        
    var: OSU = new Team(startup.osu),

    let: allTeams = [FRV, BJU, MM, OSU],
    //var: Mar = new Market(startup.market)
    
    //this: setUp()
}



