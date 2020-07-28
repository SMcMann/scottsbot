const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const functions = require('./commands/functions');
//const test = require('./modules/startupData.js')

const client = new Discord.Client();
client.commands = new Discord.Collection();
module.export = { client };
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {

  console.log('Ready!');
  client.user.setActivity("Halo 27: Master Chief's Big Wedding", { type: 'PLAYING' });
 });


client.on('message', message => {
  if (!message.content.startsWith(prefix) ) return;//|| message.author.bot

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  if (command.args && !args.length) { //whenever you set args to true in one of your command files, it'll perform this check and supply feedback if necessary
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }//if args

  //code that controls any cooldowns for commands
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  //You check if the cooldowns Collection has the command set in it yet. If not, then add it in. Next, 3 variables are created:

  const now = Date.now();                                 //A variable with the current timestamp.
  const timestamps = cooldowns.get(command.name);         //A variable that .get()s the Collection for the triggered command.
  const cooldownAmount = (command.cooldown || 3) * 1000;  //A variable that gets the necessary cooldown amount. If you don't supply it in your command file, it'll default to 3


  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }

  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(error);
  }

});

client.on("error", function(error){
  console.error(`client's WebSocket encountered a connection error: ${error}`);
});

client.on("guildMemberAdd", (member) => {
  console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
  member.guild.channels.cache.find(c => c.name === "welcome").send(`"${member.user.username}" has joined this server! --DESPAIR AND RUIN HAS COME TO THIS SERVER-- Hooray!`);
});

client.login(token);
