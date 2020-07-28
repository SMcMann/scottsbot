const Team = require('../modules/team.js')
const functions = require('./functions.js')
const test = require('../modules/startupData.js')

module.exports = {
    name: 'parrot',
    cooldown: 5,
    description: 'SQUAK',
    guildOnly: true,
    args: false,
    usage: '<@target> <amount> OR <@target> for single kudos amount',
    async execute(message, args) {

        //message.channel.send('```CSS\nWorking...\n```');
        let senderJob = message.member.roles.cache.some((r) => r.name === "Supercomputer")
        if (!senderJob){
            //message.reply("```css\nYou must be an Vice President to send Kudos\n```");
            console.log(`${message.member.displayName} just tried to use the parrot command... break their kneecaps.`)
            return;
        }

        const channel = message.mentions.channels.first()||message.guild.channels.cache.get(args[0]);
        if(!channel)
            return message.channel.send('```css\nYou did not mention/give the id of the channel you wanted to parrot into')

        let msgArgs = args.splice(1).join(" "); //useful for !stat bonus

        let squak = ("```css\n" + msgArgs + "\n```")

        let msg = message.client.channels.cache.get(channel.id).send(squak);
        //channel.send(msgArgs);


    }//execute

}

