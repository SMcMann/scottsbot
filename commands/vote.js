const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')

module.exports = {
    name: 'vote',
    cooldown: 5,
    description: 'Call a vote',
    guildOnly: true,
    args: false,
    async execute(message, args) {

        let superComputer = message.member.roles.cache.some((r) => r.name === "Supercomputer")

        if (!superComputer){
            message.reply("```CSS\nYou must be an Supercomputer access this command\n```")
            return;
        }


        await message.channel.send("```css\nA vote has been called! click on one of the reactions to vote 'Yes' or 'No'\n```")
        
        await message.react('✅')
        await message.react('❌')
 
        
    }
}


