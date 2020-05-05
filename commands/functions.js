const Nation = require('../modules/nation.js')
const Market = require('../modules/market.js')
const Discord = require('discord.js');

module.exports = {
    name: 'funtions',
    description: 'does function stuff',
    guildOnly: true,
    args: true,
    usage: '<target>',
    validateTarget(item) {
        if (
            item == "naf" || item === "nafs" || item === "699081375680036894"
        )
            return NAF;
        else if (
            item === "mcr" || item === "mars"
        )
            return MCR;
        else if (item === "ar")
            return AR;
        else if (item === "sl") return SL;
        // Update these with offical names and abbreviations for all factions
        else throw "Recipient not found";
    },
    protoValidateTarget(item) {
        if (
            item == "naf" || item === "nafs" || item === "<@&699081375680036894>"
        )
            return NAF;
        else if (
            item === "mcr" || item === "mars" || item === "<@&699081448950595686>"
        )
            return MCR;
        else if (item === "ar" || item === "<@&699405235319341067>" || item === "africa" || item === "african republic")
            return AR;
        else if (item === "sl" || item === "<@&699405615549906974>")
            return SL;
        // Update these with offical names and abbreviations for all factions
    },
    
    validateResource(resource){
        if (resource === "nukes" || resource === "nuke") {
            return "nukes";
        }
        else if (resource === "peacovite" || resource === "pea") {
            return "peacovite";
        }
        else if (resource === "avenpite" || resource === "ave") {
            return "avenpite";   
        }
        else 
            throw "Invalid resource ^w^ "

    },
    protoValidateResource(resource){ //does not throw errors
        if (resource === "nukes" || resource === "nuke") {
            return "nukes";
        }
        else if (resource === "peacovite" || resource === "pea") {
            return "peacovite";
        }
        else if (resource === "avenpite" || resource === "ave") {
            return "avenpite";   
        }
        else if (resource === "credits" || resource === "credit" || resource === "cash" || resource === "c") {
            return "credits";   
        }
    },
    serachID(User) {
        if (User.roles.cache.some((r) => r.name === NAF.fName)) return NAF;
        else if (User.roles.cache.some((r) => r.name === MCR.fName)) return MCR;
        else if (User.roles.cache.some((r) => r.name === AR.fName)) return AR;
        else if (User.roles.cache.some((r) => r.name === SL.fName)) return SL;
        else throw "You have no role";
    },
    searchIDProto(User) {
        if (User.roles.cache.some((r) => r.name === NAF.fName)) return NAF;
        else if (User.roles.cache.some((r) => r.name === MCR.fName)) return MCR;
        else if (User.roles.cache.some((r) => r.name === AR.fName)) return AR;
        else if (User.roles.cache.some((r) => r.name === SL.fName)) return SL;
        else throw "Having trouble finding your target, maybe try using their role name instead?"
    },
    newEmbed(targetClass){
        const exampleEmbed = new Discord.MessageEmbed()
        .setTitle('Bank')
        //.setURL('https://discord.js.org/')
        //.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
        .setDescription(targetClass.fName + "'s assets")
        //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
        .addFields(
            { name: 'Credits', value: targetClass.credits },
            //{ name: '\u200B', value: '\u200B' }, //LINE FEED
            { name: 'Nukes: ', value: targetClass.nukes, inline: true },
            { name: 'Peacovite: ', value: targetClass.peacovite, inline: true },
            { name: 'Avenpite: ', value: targetClass.avenpite, inline: true },
        )
        //.addField('Inline field title', 'Some value here', true)
        //.setImage('https://i.imgur.com/wSTFkRM.png')
        .setTimestamp()
        .setFooter('Updated: ');

        return exampleEmbed;
    },//newEmbed
    marketEmbed(Mar){
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor(0xffff00)
        .setTitle('Market')
        //.setURL('https://discord.js.org/')
        //.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
        .setDescription("------------Your one stop shop for the galaxy's goods!------------")
        //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
        .addFields(
            //{ name: '\u200B', value: '\u200B' }, //LINE FEED
            { name: 'Avenpite Price: ', value: Mar.avenpitePrice, inline: true },
            { name: 'Avenpite Available: ', value: Mar.avenpiteAmount, inline: true },
        )
        .addFields(
            { name: '\u200B', value: '\u200B' }, //LINE FEED
            { name: 'Peacovite Price: ', value: Mar.peacovitePrice, inline: true },
            { name: 'Peacovite Available: ', value: Mar.peacoviteAmount, inline: true },
        )
        .addFields(
            { name: '\u200B', value: '\u200B' }, //LINE FEED
            { name: 'Nuke Price: ', value: Mar.nukePrice, inline: true },
            { name: 'Nuke Available: ', value: Mar.nukeAmount, inline: true },
        )
        //.addField('Inline field title', 'Some value here', true)
        //.setImage('https://i.imgur.com/wSTFkRM.png')
        .setTimestamp()
        .setFooter('Updated: ');

        return exampleEmbed;

    }
    
}