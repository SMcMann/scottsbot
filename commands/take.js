const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')

module.exports = {
    name: 'take',
    cooldown: 5,
    description: 'Send resources to other factions',
    guildOnly: true,
    args: false,
    async execute(message, args) {

        message.reply('```CSS\nWorking...\n```');      

        setTimeout(() => {  message.reply("Wait...."); }, 2000);

        setTimeout(() => {  message.reply("You can't do that...."); }, 2000);

        setTimeout(() => {  message.reply("That's illegal!!!"); }, 2000);

        setTimeout(() => {  message.reply(`HEY @everyone! ${message.member.displayName} is trying to commit a crime!!!` ); }, 2000);
    }//execute

}

