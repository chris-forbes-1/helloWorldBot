const Discord = require('discord.js');
const express = require('express');
const app = new express();
const port = 8080;
const bodyParser     = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port,()=>{
    const client = new Discord.Client();
    console.log('listening on port ' + port);
    app.get('/',(req,res)=>{
        res.send('hello ' + client.user );
    });
    
    app.post('/message', (req, res) =>{
        console.log('message received');
        console.log(req.body);
        let guildId = req.body['guildid'];
        let channelid = req.body['channelid'];
        let message = req.body['message'];
        if(guildId === undefined || guildId === null || guildId === '') {
            res.send('nope');
            return;
        } 
        if(channelid === undefined || channelid === null || channelid === '') {
            res.send('no');
            return;
        }
        if(message === undefined || message === null || message === '') {
            res.send('nada');
            return;
        }
        let guild = client.guilds.get(guildId);
        if (guild === undefined || guild == null)
        {
            res.send('no idea what youre talking about');
            return;
        }
        else 
        {
            let channel = guild.channels.get(channelid);
            if(channel === undefined || channel === null) 
            {
                res.send('no idea what youre talking about');
                return;
            }
            else
            {
                channel.send(message);
            }
        }

        res.send('ok');
    });
    /*
    * Static function declarations
    */
    const sendMessageToChannel = (msg) => {
        let contents = getMessageContent(msg);
        let guild = client.guilds.get(contents[1]);
        if(guild === null || guild === '' || guild === undefined) {
            msg.channel.send('no guild of id: ' + contents[1] + ' found');
        } 
        else  {
            let channel = guild.channels.get(contents[2]);
            if (channel === null || channel === '' || channel === undefined) {
                msg.channel.send("Could not find channel : " + contents[2] + " on guild " + contents[1]);
            } else {
                channel.send('this is a test of message from the client of this channel!');
            }
        }
    }
    const getMessageContent = (msg) => {
        return msg.content.split(' ');
    };
    
    const adminMessageReceived = (msg) =>{
        
            if(msg.content === 'ping'){
                msg.channel.send(client.ping  + ' ms');
            }
            if(msg.content === 'connected_guild_debug') {
                msg.channel.send('Member of guilds:');
               client.guilds.forEach((k,v) => {           
                   if (v != '') {
                        msg.channel.send(v + ' -> ' + k.name);
                   }
               });
            }
            if(msg.content.startsWith('guild_debug'))
            {
                let contents = getMessageContent(msg);
                let guild = client.guilds.get(contents[1]);
                if(guild === null || guild === '' || guild === undefined) { 
                    msg.channel.send('No guild of id: ' + contents[1] + ' found');
                } else {
                    msg.channel.send('Channels available in guild: ' + guild.name);
                    guild.channels.forEach((k,v)=>{
                        if(v != '') {
                            msg.channel.send(v + " -> " + k.name);
                        }
                    });
                }
            }
            if(msg.content.startsWith('permissions')) {
                let contents = getMessageContent(msg);
                let guildMember = msg.member;
                if(guildMember === undefined) {
                    msg.channel.send('Unknown guild member:' + msg.author);
                } else {
                    let member = guildMember.permissionsFor(guildMember);
                    console.log(msg);
                }
            }
        }


    client.on('ready',()=>{
        console.log('Logged in');
        
    });
    
    
    
    client.on('message', msg=>{
        if(msg.author.id === '169166156043649035')
        {
         adminMessageReceived(msg);   
        }   
    });
    client.login(process.env.DiscordAFKBotApiKey);
    
});



