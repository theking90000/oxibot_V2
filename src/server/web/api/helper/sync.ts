import { ActionUserWeb } from "../../../cache/userweb"
import { selectUser,getUsers } from "../../../cache/user"
import { getGroups } from "../../../cache/group"
import { getGuild } from "../../../cache/guilds"
import { commandBaseSettings } from "../../../database/models/guild";
import { getAllLang, GetAllServersCustomLangs } from "../../../cache/lang";
import {getGuild as getGuildM } from "../../../cache/Module"

export type syncObjD = {
    userinfo : {
        id: string,
        tag : string,
        username : string,
        discriminator : string,
        avatar : string,
        avatarURl : string,
    },
    guilds? : syncObjGuild[],
    inviteGuild? : inviteGuild[]
}

type inviteGuild = {
    id : string,
    invite_url : string,
}

type syncObjGuild = {
    id: string,
    name : string,
    owner? : {
        id : string
    },
    me : BasicUser,
    members : {
        count : number,
    },
    cmds? : string[],
    groups : groups[],
    settings? : setting[],
    modules? : string[],
    availableslangs : string[],
}
export type channel = {
    name : string,
    id : string,
    type : "text" | "voice" | "category" | "news" | "store"
}

type customlangs = {
    name : string,
    code : string,
    translations : any,
}

type groups = {
    name : string,
    permission : string[]
}

type BasicUser = {
        id : string,
        nickname : string,
        tag : string,
        avatarUrl : string,
        groups : String[],
}
type setting = {
    name : string,
    values : {
        name : string,
        value : string,
    }[]
}

export default async function (user: ActionUserWeb) : Promise<syncObjD> {

    const guilds : Array<syncObjGuild> = [];

 
    
    for(const [id,guild] of user.guilds){
        const getUsr = user.guilds.get(id)
        if(!getUsr.permission.hasPermission('panel.guild.see')) continue;
        
        const settings : setting[] = []

        if(getUsr.permission.hasPermission('panel.settings.see')) {
            
           const guildsettings_t = getGuild(id)
            
           if(guildsettings_t){
            const guildsettings = guildsettings_t.toJSON()
               for(const key in guildsettings.settings){
                   const params = guildsettings.settings[key];
                   
                   settings.push({ name : key, values : params });
               }
           }

        }
        

        const guildm : BasicUser[] = [];
       
        const Users = getUsers(id)

        const GroupG = getGroups(id)

        const G_G : groups[] = []

        GroupG.forEach(c => {
            G_G.push({name : c.name,permission: c.permissions})
        })

        
        
        let cmds : string[];
        if(getUsr.permission.hasPermission('panel.commands.see')){
            const guild_b = getGuild(guild.Guild.id)
            if(guild_b)
            cmds = guild_b.commands.map(x => (x.name))
        }
        let modules : string[];
        if(getUsr.permission.hasPermission('panel.modules.see')) {
            const guild_b = getGuildM(guild.Guild.id)
            if(guild_b)
            modules = Array.from(guild_b.keys())
        }
const member_ = guild.Guild.members.cache.get(user.getDiscord.User.id);
const group_ = selectUser(guild.Guild.id, member_.id).getGroups().map((x) => x.name);
        guilds.push({
          id: guild.Guild.id,
          name: guild.Guild.name,
          owner: user.guilds.get(id).permission.hasPermission("panel.users.see")
            ? {
                id: guild.Guild.ownerId
              }
            : null,
          me: {
            id: member_.id,
            nickname: member_.nickname,
            tag: member_.user.tag,
            avatarUrl: member_.user.displayAvatarURL({
              dynamic: true,
              format: "webp",
              size: 128,
            }),
            groups: group_ ? group_ : [],
          },
          members: {
            count: guild.Guild.memberCount,
          },
          cmds,
          modules,
          groups: G_G,
          settings,
          availableslangs: getAllLang().map((x) => x.lang),
        });
    }

    return {
        userinfo : {
            id : user.getDiscord.User.id,
            tag : user.getDiscord.User.tag,
            username : user.getDiscord.User.username,
            discriminator : user.getDiscord.User.discriminator,
            avatar : user.getDiscord.User.avatar,
            avatarURl : user.getDiscord.User.avatarURL({dynamic : true,format : "webp",size : 128}),
        },
        guilds : guilds
    }


}