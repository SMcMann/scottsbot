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
        const time = 60000 //amount of time to collect for in milliseconds
        let yes = 0;
        let no = 0;

        await message.channel.send("A vote has been called! click on one of the reactions to vote 'Yes' or 'No'")
        .then(async function (message) {
            await message.react('✅')
            await message.react('❌')
            const filter = (reaction, user) => {
                return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌')
            };

            message.awaitReactions(filter, { time: 4000, errors: ['time'] })
            .then(collected => console.log(collected))
            .catch(collected => {
                let votes = collected.array();
                console.log(votes[0].count)
                console.log(votes[0].name)
                //message.channel.send(`After 30 seconds, I recieved ${votes}`)
            });

/*





            const collector = message.createReactionCollector(filter, { time: time });

            collector.on('collect', (reaction, reactionCollector) => {
                if (reaction.emoji.name === '✅'){
                    yes++;
                } 
                if (reaction.emoji.name === '❌'){
                    no++;
                } 
            });

        */      });     

            //console.log(yes);
            //console.log(no);        
        
    }
}


