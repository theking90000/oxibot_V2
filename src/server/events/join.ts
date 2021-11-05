import client from "../index";
import groups,{getGroups,createGroup}  from "../cache/group";
import users,{getUsers,addUser, selectUser}  from "../cache/user";
import * as guildsCache from "../cache/guilds"
import * as chalk from "chalk"
import { GuildMember } from "discord.js";
import { createAllModules } from "../cache/Module";

client.on('guildCreate',async (guild) => {
     
    if(!getGroups(guild.id).map(c => c.name).includes('admin')){
        createGroup({ guildID : guild.id,name : "admin",permissions : ['*'] })
        console.log(chalk.red('Création du role admin pour la guild ' + guild.name))       
    }
    let users = getUsers(guild.id);

        let members :GuildMember[] = [];

        guild.members.cache.forEach((member) => members.push(member))

        for(const member of members){
            if(!users.map(x => x.userID).includes(member.id) && !member.user.bot){
                await addUser({guildID : guild.id, userID : member.id,Groups : []})
                console.log(chalk.green('Création de l\'utilisateur pour la guild ' + guild.name))
            }
        } 
    
        try{ 
            let u =selectUser(guild.id,guild.ownerId);
             u.addGroup('admin');
            }
        catch {
            
        }
        
        if(!guildsCache.hasGuild(guild.id)){
            guildsCache.CreateGuild(guildsCache.DefaultGuild(guild.id));
        }

        createAllModules(guild.id);

        
})