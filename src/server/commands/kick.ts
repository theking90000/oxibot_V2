import { GuildMember } from "discord.js";
import { selectUser } from "../cache/user";
import { commandType } from "../commands";
import { getUser } from "../permissions";
import embed from "../utils/embed";

const command :commandType = {
    name : "kick",
    settings : {
        canBeDisabled : true,
        data : {
            DefaultTempKick : {
                type : 'boolean',
                value : false
            },
            TempKickTime : {
                type : 'string',
                value : "1d"
            },
            DefaultReasonKick : {
                type : 'string',
                value : "You where kicked !"
            },
            DmMembers : {
                type : 'boolean',
                value : true,
            }
        }
    },
    execute : async (message) => {
        

        if(!message.args[0] && message.userPerm.hasPermission('command.kick')){
            await message.channel.send(embed({
                name : "Exclure une personne",
                guildid : message.guild.id,
                    fields : [
                    {
                        val1 : `${message.prefix}kick @user @user <reason>`,
                        val2 : "Exclu une personne du serveur\n(permission : command.kick.user)",
                    },
                ]
            }).getEmbed())
        }

       if(message.args[0] && message.userPerm.hasPermission('command.kick.user') ){
            const mentions = message.mentions.members.array();

            const users :GuildMember[] = mentions
            let raison = "", nodm=message.data.DmMembers;
            

            for(var i=0;i < message.args.length;i++){
                const arg = message.args[i]

                if(arg.startsWith('<@') && arg.endsWith('>')){
                    let mention = arg.slice(2,-1);
                    if (mention.startsWith('!')) mention = mention.slice(1);
                    const user = message.guild.members.cache.get(mention);
                    if(user && !users.includes(user)) users.push(user);
                  }
      
                  else if(arg.match(/[0-9]{18}/)){
                        const user = message.guild.members.cache.get(arg);
                      if(user && !users.includes(user)) users.push(user);
                  }
      
                  else if(arg.match(/^((.{1,32})#\d{4})/)) {
                        const user = message.guild.members.cache.find(u => u.user.tag === arg);
                      if(user && !users.includes(user)) users.push(user);
                  }
                  else if(arg === "--nodm"){
                      nodm = true;
                  }
                  else {
                      raison += arg + " ";
                  }
            }

            if(users.length < 1){
                await message.channel.send(embed({
                    name : "Erreur",
                    guildid : message.guild.id,
                    fields : [{
                        val1 : "Une erreur est survenue !",
                        val2 : "Veuillez mentionner au moins une personne"
                    }]
                }).getEmbed())
                return;
            }

            const ResumeEmbed = embed({guildid : message.guild.id,name : "Résumé de la commande"});

            let errmsg = {val1 : "Ces personnes n'ont pas pu être kick", val2 : ""};
            for(const user of users){
                if(!user.kickable 
                    || getUser({guildID : message.guild.id,userID : user.id})
                    .hasPermission("kick.bypass")) {
                    errmsg = {
                        ...errmsg,
                        val2 : errmsg.val2 + `<@${user.id}>\n` 
                    }
                }

            }

            if(errmsg.val2 !== ""){
                ResumeEmbed.addFields([errmsg]);
            }

            message.channel.send(ResumeEmbed.getEmbed())
            return; 

       }
    }
}

export default command