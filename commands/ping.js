module.exports = {
    name: 'ping',
    cooldown: 5,
    description: 'Ping!',
    execute(message, args) {
        message.reply('Confirm with a thumb up or deny with a thumb down.');

// Reacts so the user only have to click the emojis
message.react('👍').then(r => {
        message.react('👎');
});

// First argument is a filter function
message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
        { max: 1, time: 10000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                        message.reply('Shutting down...');
                }
                else
                        message.reply('Operation canceled.');
        }).catch(() => {
                message.reply('No reaction after 10 seconds, operation canceled');
        });

    },//execute
};