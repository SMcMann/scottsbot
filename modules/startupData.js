const Nation = require('./nation.js')
const Market = require('../modules/market.js')
const startup = require('../modules/dataFiles/startupData.json')

    //console.log(naf)
module.exports = {
    //                 Credits Nukes Pea Ave    bankID                logID                       Full Name(fName)                     roleID

    var: NAF = new Nation(startup.naf),//(9999999999, 2, 10, 10,  "699501156845617292", "699404648649588906", "The North American Federation of States", "699081375680036894"),
    var: AR = new Nation(startup.ar),//(1000, 2, 10, 10,   "700148873091481641", "700073585049600061", "African Republic",                        "699405235319341067"),
    var: SL = new Nation(startup.sl),//(1000, 2, 10, 10,   "700074074537459933", "700074043402878987", "Space Libertarians",                       "699405615549906974"),
    var: MCR = new Nation(startup.mcr),//(1000, 2, 10, 10,  "699501222318702683", "699404875766956143", "Mars Congressional Republic",              "699081448950595686"
  //  ),
    let: allNations = [NAF, AR, SL, MCR],
    var: Mar = new Market(startup.market)
    
    //this: setUp()
}



