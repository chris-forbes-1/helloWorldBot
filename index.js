const Discord = require('discord.js');
const bodyParser     = require('body-parser');

    const client = new Discord.Client();

    
    /*
    * Static function declarations
    */
    const sendMessageToChannel = (msg) => {
        let contents = getMessageContent(msg);
        let guild = client.guilds.get(contents[1]);
        if(guild === null || guild === '' || guild === undefined) {
            msg.channel.send(':arrow_right:no guild of id: ' + contents[1] + ' found');
        } 
        else  {
            let channel = guild.channels.get(contents[2]);
            if (channel === null || channel === '' || channel === undefined) {
                msg.channel.send("Could not find channel : " + contents[2] + " on guild " + contents[1]);
            } else {
                channel.send(`:arrow_right: ${contents[3]}`);
            }
        }
    }
    const getMessageContent = (msg) => {
        return msg.content.split(' ');
    };
    
    const adminMessageReceived = (msg) =>{
            if(msg.content === '.debug_guild_permissions') {
                msg.channel.send(':arrow_right:Member of guilds:');
               client.guilds.forEach((k,v) => {           
                   if (v != '') {
                        msg.channel.send(":arrow_right:"+ v + ' -> ' + k.name);
                   }
               });
               return true;
            }
            
            if(msg.content.startsWith('.admin_announce'))
            {
                sendMessageToChannel((msg));
            }

            if(msg.content.startsWith('.debug_guild'))
            {
                let contents = getMessageContent(msg);
                let guild = client.guilds.get(contents[1]);
                if(guild === null || guild === '' || guild === undefined) { 
                    msg.channel.send(':arrow_right:No guild of id: ' + contents[1] + ' found');
                } else {
                    msg.channel.send(':arrow_right:Channels available in guild: ' + guild.name);
                    guild.channels.forEach((k,v)=>{
                        if(v != '') {
                            msg.channel.send(":arrow_right: " + v + " -> " + k.name);
                        }
                    });
                }
                return true;
            }

            if(msg.content.startsWith('.debug_permissions')) {
                let contents = getMessageContent(msg);
                let guildMember = msg.member;
                if(guildMember === undefined) {
                    msg.channel.send(':arrow_right:Unknown guild member:' + msg.author);
                } else {
                    msg.channel.send(':arrow_right:permissions bit field: ' + guildMember.permissions.bitfield);
                }
                return true;
            }

            if(msg.content.startsWith('.status')) {
                let healthStatus = 'Client Status:' +  (client.status === 0 ? ':ok:'  : ':thumbsdown::skin-tone-4:')  + '\n'
                +':up: Uptime: ' + client.uptime +'\n' 
                + ':ping_pong: Current ping: ' + client.ping + 
                '\n :ideograph_advantage:client tag: ' + client.user.tag;

                msg.channel.send(healthStatus);
                return true;
            }

            if(msg.content.startsWith(".refresh_connection_status")){
                msg.channel.send("Ok reloading session context");
                client.destroy().then(()=>{
                    client.login(process.env.DiscordAFKBotApiKey);
                });
                return true;
            }
            return false;
        }
        const getUsersAvatar = (msg, user) => {
            let membersOfMessageGuild = msg.channel.guild.members;
            let found = false;
            membersOfMessageGuild.forEach(function(item, key, map){
                let userObj = item.user;

                if(item.nickname ? item.nickname.toLowerCase() === user : false || userObj.username.toLowerCase() === user)
                {
                    found = true;
                    msg.channel.send('the avatar for user ' + user + " is: " + userObj.avatarURL);
                }
            });
            if(!found){
                msg.channel.send(`no user ${user} found`);
            }
        };
        const userInfo = (msg, user) =>{
            let membersOfMessageGuild = msg.channel.guild.members;
            let found = false;
            membersOfMessageGuild.forEach(function(item, key, map){
                let userObj = item.user;

                if(item.nickname ? item.nickname.toLowerCase() === user : false || userObj.username.toLowerCase() === user)
                {
                    found = true;
                    let response = `:id: ${userObj.id}\n:globe_with_meridians:AvatarUrl:<${userObj.avatarURL}}>\n:astonished:Last Message:${userObj.lastMessage}\n`;
                    response += `:alarm_clock:Created at${userObj.createdAt}`;
                    let usersRoles = "";
                    item.roles.forEach(function(a,b,c){
                        usersRoles += a.name +",";
                    });
                    response += `\n:trolleybus: user roles: ${usersRoles}`;
                    msg.channel.send(response);
                }
            });
            if(!found){
                msg.channel.send(`no user found for ${user}`);
            }
        };
        const doNameBasedCall = (msg, func) => {
            let contents = getMessageContent(msg);
            if(contents.length >1)
            {
                let targetUser = '';
                for(var i = 1; i < contents.length; i++)
                {
                    targetUser = targetUser +" "+contents[i];
                }
                func(msg, targetUser.trim().toLowerCase());
            }
            else
            {
                msg.channel.send("command format is .<command> <users name>");
            }
        };

        const isMortalCommand = (msg) => {
            if(msg.mentions.everyone) {
                msg.channel.send('',{file:'http://i0.kym-cdn.com/photos/images/newsfeed/001/291/784/c32.jpg'});
            }
            else
            {
                let message_received = msg.content;
                if(message_received.startsWith("."))
                {
                    if(message_received.startsWith(".avatar"))
                    {
                        doNameBasedCall(msg, getUsersAvatar);
                    }
                    else if(message_received.startsWith(".userInfo"))
                    {
                        doNameBasedCall(msg, userInfo);
                    }
                }
                
            }
        };


    client.on('ready',()=>{
        console.log('Logged in');
    });
    
    
    
    client.on('message', msg=>{
        try {
            if(msg.author.id === '169166156043649035')
            {
                if(!adminMessageReceived(msg))
                {
                    isMortalCommand(msg);
                }
            }   
            else
            {
                if(msg.author.id != '357260268574867466')
                {
                    isMortalCommand(msg);
                }
                else
                {
                    console.log("Filtered my own message");
                }
            }
        } catch (error) {
            msg.channel.send('command failed');
            msg.channel.send(error.message);
        }
    });
    client.login(process.env.DiscordAFKBotApiKey);

    client.on('ready',()=>{
        console.log("setting game value");
        client.user.setPresence({game:{name:'in debug mode'}});
        client.user.setUsername("defenestrate bot");
    });
