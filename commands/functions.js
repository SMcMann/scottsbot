const Team = require('../modules/team.js')
const Market = require('../modules/market.js')
const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const sheets = google.sheets('v4');

module.exports = {
    name: 'funtions',
    description: 'does function stuff',
    guildOnly: true,
    args: true,
    usage: '<target>',
    protoValidateTarget(item) {
        if (
            item == "frv" || item === "the french revolution" || item === "france" || item === "<@&699081375680036894>"
        )
            return FRV;
        else if (
            item === "osu" || item === "osaka" || item === "osaka underground" || item === "<@&699081448950595686>"
        )
            return OSU;
        else if (item === "bju"  || item === "beijing" || item === "beijing united" || item === "<@&"+BJU.roleID+">")
            return BJU;
        else if (item === "mm" || item === "mumbai" || item === "mumbai moguls" || item === "<@&699405615549906974>")
            return MM;
        // Update these with offical names and abbreviations for all factions
    },  
    protoValidateResource(resource){ //does not throw errors
        if (resource === "zillions" || resource === "zillion" || resource === "z") {
            return "zillions";
        }
        else if (resource === "kudos" || resource === "kudo") {
            return "kudos";
        }
    },
    jobCheck(User){ //does not throw errors
        if (User.roles.cache.some((r) => r.name === "Owner")) return "Owner";
        else if (User.roles.cache.some((r) => r.name === "GM")) return "GM";
        else if (User.roles.cache.some((r) => r.name === "Saber")) return "Saber";
        else if (User.roles.cache.some((r) => r.name === "VP")) return "VP";
        else throw "You don't have a role!"
    },
    searchID(User) {
        if (User.roles.cache.some((r) => r.name === FRV.fName)) return FRV;
        else if (User.roles.cache.some((r) => r.name === BJU.fName)) return BJU;
        else if (User.roles.cache.some((r) => r.name === MM.fName)) return MM;
        else if (User.roles.cache.some((r) => r.name === OSU.fName)) return OSU;
        else throw "You have no team!"
    },
    searchIDProto(User) {
        if (User.roles.cache.some((r) => r.name === FRV.fName)) return FRV;
        else if (User.roles.cache.some((r) => r.name === BJU.fName)) return BJU;
        else if (User.roles.cache.some((r) => r.name === MM.fName)) return MM;
        else if (User.roles.cache.some((r) => r.name === OSU.fName)) return OSU;
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
            { name: 'Zillions', value: targetClass.zillions },
            //{ name: '\u200B', value: '\u200B' }, //LINE FEED
            { name: 'Kudos: ', value: targetClass.kudos, inline: true },
        )
        //.addField('Inline field title', 'Some value here', true)
        //.setImage('https://i.imgur.com/wSTFkRM.png')
        .setTimestamp()
        .setFooter('Updated: ');

        return exampleEmbed;
    },//newEmbed  
    getSpreadCash(user){
        var cash;
        const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        const TOKEN_PATH = 'token.json';

        // Load client secrets from a local file.
        fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), listMajors);
        return cash;         
        });

        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */
        function authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
        }

        /**
         * Get and store new token after prompting for user authorization, and then
         * execute the given callback with the authorized OAuth2 client.
         * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
         * @param {getEventsCallback} callback The callback for the authorized client.
         */

	        function getNewToken(oAuth2Client, callback) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            console.log('Authorize this app by visiting this url:', authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error while trying to retrieve access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
                });
            });
        }
        function listMajors(auth) {
            const sheets = google.sheets({version: 'v4', auth});
            sheets.spreadsheets.values.get({
                spreadsheetId: '1bwNZDylRvbWbIwk4GvvNOK4qugV7QzDVgw9ZyjRR6ZM',
                range: 'Cash!I3:I17',
                majorDimension: 'COLUMNS'
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                if (rows.length) {
                //console.log('Stat\ID, Name:');
                // Print columns A and Y, which correspond to indices 1 to 91.
                    rows.map((row) => {         
                        cash = `${row[3]}`
                        //console.log(cash);

                    })//rows.map                    
                }
            });
        }


    }//getCash
}