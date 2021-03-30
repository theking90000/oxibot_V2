import * as nodeCache from "node-cache";
import Guild, {commandBaseSettings, IGuildDocument} from "../database/models/guild";
import { embed_default_color } from "../../../config"
import {prefix} from "../../../config"
import commandsList from "../commands";
import commands from "../commands";
import { gray } from "chalk";



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
        await AddNewFields(guild.guildID)
    }   
    console.log(gray(`${guilds_.length} guildes chargée dans le cache`))
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
    },
    commands : commandBaseSettings[]
    saves : {
        backups_cat : {
            name : string,
            id? : string,
        },
    }
} 

export const AddNewFields = async (guildID : string)  => {
    const guild = getGuild(guildID)
    if(!guild) return;
    const commands = guild.commands;
    const settings =getServerCommandsSettings()
    guild.commands = settings.map(x => {
        const cmd = commands.find(b => x.name === b.name) || x

        return{
            ...x,
            settings : {
                ...x.settings,
                settings : {
                    ...x.settings.settings,
                    ...cmd.settings.settings,
                    data : {
                        ...x.settings.settings.data,
                        ...cmd.settings.settings.data,
                    }
                }
            }
        }})
        
   if(await guild.save()){
       setValue(guild.id,guild)
       return;
   }
}

const getServerCommandsSettings = () : commandBaseSettings[]=> {
    const r : commandBaseSettings[]= []
    for(const [command,value] of commandsList){
        if(value.settings){
            r.push({ enabled : true,name : command,settings : {name  :value.name, settings : value.settings} });
        }
    }
    return r;
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
    },
    commands : getServerCommandsSettings(),
    saves : {
        backups_cat : {
            name : `Backups`
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

export const SetCommandEnabled = async (info : {name : string,value : boolean,id : string}) : Promise<boolean> => {
    const guild = getGuild(info.id)
    if(!guild) return false;

    if(!guild.commands || !guild.commands.find(c => c.name === info.name)) return false;

    if(!guild.commands.find(c => c.name === info.name).settings.settings.canBeDisabled) return false;

    guild.commands.find(c => c.name === info.name).enabled = info.value
    if(await guild.save()){
        setValue(guild.id,guild)
        return true;
    }
    return false;
}

export const getCommandData = async (guildid : string, commandname : string) => {
    const guild = getGuild(guildid)
    if(!guild) return;

    if(!guild.commands || !guild.commands.find(c => c.name === commandname)) return ;

    return guild.commands.find(c => c.name === commandname)
}

export const getCommandsWithAliases = (guildid : string,cmd : string) : string => {
    const guild = getGuild(guildid)
    if(!guild) return; 

    if(guild.commands.find(x => x.settings.settings.Aliases && x.settings.settings.Aliases.find(b => b === cmd))){
        return guild.commands.find(x => x.settings.settings.Aliases && x.settings.settings.Aliases.find(b => b === cmd)).name
    }
    return;
}

export const setCommandData = async (info : {name : string,setting : string,value : boolean,id : string}) : Promise<boolean> => {
    const guild = getGuild(info.id)
    if(!guild) return false;

    if(!guild.commands || !guild.commands.find(c => c.name === info.name)) return false;
    
    const setting = guild.commands.find(c => c.name === info.name).settings.settings.data
 
    if(setting && setting[info.setting] && (setting[info.setting].type.toLowerCase() === (typeof info.value).toLowerCase())) {
        setting[info.setting].value = info.value
    }else return false;

    guild.markModified('commands')

    if(await guild.save()){
        setValue(guild.guildID,guild)
        return true;
    }
    

    return false
}

export const AddRemoveCommandAliases =async (payload : { 
    type : "ADD" | "REMOVE", 
    id: string,
    name : string,
    data : string | string[]
})=>{
    const guild = getGuild(payload.id)
    if(!guild) return false;
    if(!guild.commands || !guild.commands.find(c => c.name === payload.name)) return false;
    const cmd = guild.commands.find(c => c.name === payload.name)
    if(!cmd.settings.settings.canHasAliases) return false;
    var v = false
    if(payload.type === "ADD"){
        if(Array.isArray(payload.data)) cmd.settings.settings.Aliases = [...cmd.settings.settings.Aliases,...payload.data]
        else if (!cmd.settings.settings.Aliases.find(x => x === payload.data)) 
        cmd.settings.settings.Aliases.push(payload.data)
        v = true;
    }
    if(payload.type === "REMOVE"){
        
        cmd.settings.settings.Aliases = cmd.settings.settings.Aliases.filter(x => x !== payload.data);
        
        v = true
    }

    if(v){
    guild.markModified('commands')
    if( await guild.save()){
        return v;
    }
    
}
return false;
}

export const setGuild = async (id : string,callback : (obj : IGuildDocument) => IGuildDocument) => {

    const guild_ = getGuild(id);
    if(!guild_) return;

    const guild_2 = callback(guild_)

    if(guild_2 && await guild_2.save()){
        setValue(id, guild_2);
    }

}

updateCache()

export default guilds;