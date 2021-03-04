import { Permissions, PermissionString } from "discord.js";
import { ActionUserWeb } from "../../../cache/userweb"
import { selectUser,getUsers } from "../../../cache/user"
import { getGroups } from "../../../cache/group"
import { getUser } from "../../../permissions"


export type syncObjD = {
    userinfo : {
        id: string,
        tag : string,
        username : string,
        discriminator : string,
        avatar : string,
        avatarURl : string,
    },
    guilds? : syncObjGuild[]
}

type syncObjGuild = {
    id: string,
    name : string,
    owner? : {
        id : string
    },
    me : {
        id : string,
    },
    members : {
        users? : BasicUser[]
        count : number,
    },
    groups : groups[]
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

export default async function (user: ActionUserWeb) : Promise<syncObjD> {

    const guilds : Array<syncObjGuild> = [];


    
    for(const [id,guild] of user.guilds){
       
        if(!user.guilds.get(id).permission.hasPermission('panel.guild.see')) continue;
        
        const guildm : BasicUser[] = [];
       
        const Users = getUsers(id)

        const GroupG = getGroups(id)

        const G_G : groups[] = []

        GroupG.forEach(c => {
            G_G.push({name : c.name,permission: c.permissions})
        })

        if(user.guilds.get(id).permission.hasPermission('panel.users.see')){

        for(const [id, member] of guild.Guild.members.cache){

            

            if(member.user.bot) continue;

            
            const group = Users.find(x => x.userID === id).Groups
        guildm.push({
                id : id,
                nickname : member.nickname,
                tag : member.user.tag,
                avatarUrl : member.user.avatarURL({dynamic : true,format : "webp",size : 128}),
                groups : group ? group : [] 
            })
        }}else{
            const member = guild.Guild.members.cache.get(user.getDiscord.User.id)
            const group = selectUser(guild.Guild.id,member.id).getGroups().map(x => x.name)
            guildm.push({
                id : id,
                nickname : member.nickname,
                tag : member.user.tag,
                avatarUrl : member.user.avatarURL({dynamic : true,format : "webp",size : 128}),
                groups : group ? group : [] 
            })
            
        }

        guilds.push({
            id : guild.Guild.id,
            name : guild.Guild.name,
            owner : (user.guilds.get(id).permission.hasPermission('panel.users.see') ? {
                id : guild.Guild.owner.id
             } : null ),
            me : {
                id : user.getDiscord.User.id,
            },
            members : {
                users : guildm,
                count : guild.Guild.memberCount,
            },
            groups : G_G
        })

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