import * as nodeCache from "node-cache";
import Guild, {IGuildDocument} from "../database/models/guild";
import { embed_default_color } from "../../../config"
import { IUsersDocument } from "../database/models/user";
import {prefix} from "../../../config"


const guilds = new nodeCache({useClones : false});

const setValue = (id : string,obj : IGuildDocument) => {
    guilds.set(id,obj);
}

export const updateCache = async () : Promise<void> => {
    
    let guilds_ = await Guild.getAll();
    guilds.close();
    guilds.set('cache', guilds_);

    for(const guild of guilds_){
        setValue(guild.guildID, guild);
    }   
}

export interface IguildObj {
    guildID : string,
    settings : {
        embed : {
            color : string,
            date : boolean,
            footer : string,
        },
        server : {
            prefix : string,
        }
    }
} 

export const DefaultGuild = (id : string) : IguildObj => ({
    guildID : id,
    settings : {
        embed : {
            color : embed_default_color,
            date : false,
            footer : "",
        },
        server : {
            prefix : prefix, 
        }
    }
})
export const hasGuild = (id : string) : boolean => guilds.has(id)

export const CreateGuild = async (obj : IguildObj) => {
    
    if(guilds.has(obj.guildID)) return;
    const guild = new Guild(obj);
    await guild.validate().catch(err=> console.log(err))
    .then(async () =>{
        await guild.save();

        setValue(guild.guildID, guild)
    })
    

}

export const getGuild = (id : string) : IGuildDocument => {
    if(!hasGuild(id)) return null

    return guilds.get(id)
}



export const updateSettingVal = async(obj : {cat : string,name : string,value: string | boolean,id: string}) => {
    const guild = getGuild(obj.id)
    if(!guild) return;


    if(guild.settings === undefined || guild.settings[obj.cat] === undefined || guild.settings[obj.cat][obj.name] === undefined) return;


    guild.settings[obj.cat][obj.name] = obj.value;

    if(await guild.save()){
        setValue(guild.id,guild);
        return true;
    }
}

updateCache()

export default guilds;