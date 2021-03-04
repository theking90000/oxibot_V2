import * as nodeCache from "node-cache";
import userweb, {IUsersWebDocument} from "../database/models/userweb";
import client from "../index"
import UserWeb from "../database/models/userweb";
import { Guild, GuildMember, User } from "discord.js";
import * as userCache from "./user"
import * as permission from "../permissions"

export const usersweb = new nodeCache();


export const updateCache = async () : Promise<void> => {
    
        let users_ = await userweb.getAll();
        usersweb.close();
        usersweb.set('cache', users_);

        for(const user of users_){

            usersweb.set(user.DiscordUserID, user)
            usersweb.set(user.token, user)
        }   

}

type createGroupT = {
    userID : string,
    access_token : string,
    expires : string,
    token : string,
}
export const addUserWeb = async (g_ : createGroupT) => {
    
    if(usersweb.has(g_.userID)) throw new Error("user exists")
    else{
        const user = new UserWeb({
            DiscordUserID : g_.userID,
            access_token : g_.access_token,
            expires : g_.expires,
            token : g_.token,
          })

          await user.save();

          usersweb.set(g_.userID, user);
          usersweb.set(g_.token,user);

          return user;
    }

}

export const getUser = (userID : string) : IUsersWebDocument => usersweb.has(userID) ? usersweb.get(userID) : null


export type ActionUserWeb = {
    getDiscord : {
        readonly guildid : string,
        readonly User : User,
    },
    guilds :  Map<string,GuildWebUserObj>
    
}



type GuildWebUserObj = {
    permission : permission.permissionuser,
    user : userCache.userS,
    Guild : Guild,
}

export const selectUser = (userID : string) : ActionUserWeb => {

    let user = getUser(userID)
    if(!user) throw new Error("no user with this id")

     

        let guildx = client.guilds.cache.filter(g => g.members.cache.has(user.DiscordUserID)).map(x => x)

        if(!guildx[0]) throw new Error("No user in guild")
         const u : { 
            readonly guildid : string,
            readonly User : User,
        } = {
            User : guildx[0].members.cache.get(user.DiscordUserID).user,
            guildid : guildx[0].id,
          }

          const uGuilds = new Map<string,GuildWebUserObj>()
        
          for(const guild of guildx){
              
            try{
                const selectedUP = permission.getUser({guildID: guild.id, userID :user.DiscordUserID})
                if(!selectedUP) continue

                const SelectU = userCache.selectUser(guild.id,user.DiscordUserID)
                if(!SelectU) continue
                
                uGuilds.set(guild.id, {
                    permission : selectedUP,
                    user : SelectU,
                    Guild : guild
                })

            }catch{
                continue
            }

          }

    const t : ActionUserWeb = {
        getDiscord : u,
        guilds : uGuilds
    }

    return t;

}

updateCache();

export default usersweb;