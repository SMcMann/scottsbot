const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    cooldown: 0,
    description: '',
    args: false, 
    execute(message, args) {

        let superComputer = message.member.roles.cache.some((r) => r.name === "Supercomputer")
        let owner = message.member.roles.cache.some((r) => r.name === "Owner")
        let gm = message.member.roles.cache.some((r) => r.name === "GM")
        let vp = message.member.roles.cache.some((r) => r.name === "VP")
        let saber = message.member.roles.cache.some((r) => r.name === "Saber")


        if (owner){
            message.reply('```css\n[Owner Commands]\n\n!send\n================================================\n' +
            'Description: Send Zillions to other franchise owners!\n\n' +
            'Usage: !send <target> <amount> OR !send <amount> <target>\n\n' +
            'Examples:\n!send osu 6 \n!send @The Mumbai Moguls 1\n!send 4 @PoL GM (Scotty)*\n\n' +
            '*Note: All Zillions are sent to franchises, not individual players. Find other ways to bribe players!\n**Note: You can mention a team or person with the "@" sign\n```');
        }

        if (gm){
            message.reply('```css\n[GM Commands]\n\n!draft\n===================================================\n' +
            'Description: Draft an athlete when it is your draft pick!\n\n' +
            'Usage: !draft <Athlete ID#> \n\n' +
            'Examples:\n!draft 45 ==========> Draft athlete "Billy Mays"\n!draft 84 ==========> Draft athlete "Gu Hao-Qui"\n\n' +
            "\n!bid\n===================================================\n" +
            'Description: Make a secret bid on a coach!\n\n' +
            "Usage: !bid <Coaches' First or Last Name> <Amount> OR !bid <Amount> <Coaches' First or Last Name>\n\n" +
            'Examples:\n!bid prince 5 ==========> Bid 5 zillion on Coach Prince P. Hone\n!bid 8 Penni ==========> Bid 5 zillion on Coach Penni Krum"\n\n' +
            "\n!drop\n===================================================\n" +
            'Description: Drop your current bid on a coach\n\n' +
            "Usage: !drop \n\n" +
            'Examples:\n!drop ==========> Drop your current bid after confirmation\n\n' +
            '\n```');
        }

        if (vp){
            message.reply('```css\n[VP Commands]\n\n!kudos\n===================================================\n' +
            'Description: Send kudos to other VPs!\n\n' +
            'Usage: !kudos <target> (for only 1 kudos sent) OR !kudos <target> <amount>\n\n' +
            'Examples:\n!kudos frv =======================> Send 1 kudos to the VP of The French Revolution\n!kudos @Bejing United 3 ==========> Send 3 kudos to the VP of Bejing United\n' +
            '!kudos 2  @MM VP (Peter)==========> Send 2 kudos to the VP of The Mubai Moguls\n\n*Note: Once gifted, kudos cannot be resent to anyone. Choose wisely!\n```');
        }

        if (saber){
            message.reply('```css\n[Saber Commands]\n\n!stat\n===================================================\n' +
            'Description: Inquire about a specific statistic and how it affects the games of the season!\n\n' +
            'Usage: !stat <name of statistic> OR !stat bonus for BONUS inquiry\n\n' +
            'Examples:\n!stat salary \n!stat ABS\n!stat BONUS\n\n' +
            '*Notes: >Some statistics do not affect anything important, and thus will not consume a [Inquiry Credit] when you inquire about them\n'+
            '        >You still need to access the [GENERAL] level of info before accessing the [SPECIFIC] level of info of a statistic\n\n ' + '\n```');
        }     
        
        if (superComputer){
            message.reply('```css\n[SuperComputer Commands]\n\n!Coming soonish\n```');
        }    
    

    },//execute
};