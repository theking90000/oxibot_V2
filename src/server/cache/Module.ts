import { gray } from "chalk";
import { string } from "joi";
import * as nodeCache from "node-cache";
import NodeCache = require("node-cache");
import client from "..";
import Module,{ IModuleDataDocument, IModuleDocument, ModuleData } from "../database/models/Module";
import * as ModuleManager from "../modules/ModuleManager"
import validtext from "../utils/validtext";
import { getCommandData } from "./guilds";

export const Modules = new nodeCache({useClones : false});
export const ModulesData = new NodeCache({useClones : false})

export const updateCache = async () : Promise<void> => {
    let p = 0;
    for(const c of (await Module.getAll())){
        if(!Modules.has(c.guildID))
        Modules.set(c.guildID, new Map<string,IModuleDocument>());

        const guild = getGuild(c.guildID)
        guild.set(c.name,c);

        p++
    }       
    console.log(gray(`${p} modules chargés dans le cache`))

    p = 0;
    for(const d of (await ModuleData.getAll())){
        if(!ModulesData.has(d.guildID))
        ModulesData.set(d.guildID, new Map<string,IModuleDocument>());

        const g = getModuleDataGuild(d.guildID);

        if(!g.has(d.userID))
            g.set(d.userID, new Map<string,IModuleDataDocument>());

        const m = getModuleDatas(d.guildID,d.userID);

        m.set(d.name, d); 

        p++;
    }

    console.log(gray(`${p} données de modules chargés dans le cache`))

    MigrateModuleData()
}

export const MigrateModuleData = async () => {

    for(const g_ of Modules.keys()){
        const guild = getGuild(g_);
        for(const m of guild.values()){
            const mod = ModuleManager.Modules.find(x => x.getName() === m.name)
            if(!mod || JSON.stringify(m.data) === JSON.stringify(mod.getDefaultSettings())) continue;
            m.data = {
                ...mod.getDefaultSettings(),
                ...m.data
            }
            m.markModified("data")
            await m.save()
            
        }
    }

}

export const createModule = async (guildID,name) => {
    const mod = ModuleManager.Modules.find(x => x.getName() === name)
    if(!mod) return
    const m = new Module({
        guildID,
        toggled : false,
        data : mod.getDefaultSettings(),
        name : mod.getName()
    })
    if(await m.save()){
        if(!Modules.has(guildID))
            Modules.set(guildID, new Map<string,IModuleDocument>())
        

        const guild = getGuild(guildID)

        guild.set(m.name,m);
    }
}

export const createAllModules = async (guildID) => {
    if(!Modules.has(guildID))
            Modules.set(guildID, new Map<string,IModuleDocument>())
    const guild = getGuild(guildID)
    for(const m of ModuleManager.Modules){
        if(!guild.has(m.getName())){
            createModule(guildID, m.getName())
        }
    }
}

export const getGuild = (guildID : string) : Map<string,IModuleDocument> => Modules.get(guildID);
export const getModuleDataGuild = (guildID : string) : Map<string,Map<string,IModuleDataDocument>> => ModulesData.get(guildID)
export const getModuleDatas = (guildID : string,userID : string) : Map<string, IModuleDataDocument>=> {
    const g = getModuleDataGuild(guildID)
    if(!g || !g.has(userID)) return;

    return g.get(userID);
}

export const getModuleData = (guildID : string,userID : string,name :string) :  IModuleDataDocument=> {
    const g = getModuleDataGuild(guildID)

    if(!g || !g.has(userID)) return;

    const u = g.get(userID);

    if(!u || !u.has(name)) return

    return u.get(name)
}

export const EnableDisableModule = async(payload : {module : string, guildID : string, value : boolean}) => {

    const g = getGuild(payload.guildID)
    if(!g) return;
    const module = g.get(payload.module)
    if(!module) return;
    if(module.toggled === !payload.value){
        module.toggled = !module.toggled
        if(await module.save()){
            return true;
        }
    }
    return;

}

export const setData = async (guildID: string,name : string,value : any,path : string,type:string) => {
    const g = getGuild(guildID)
    if(!g) return;
    const module :any = g.get(name)
    if(!module) return;
    if(module._doc.data && module._doc.data[path] && module._doc.data[path].type === type){
        switch(type){
            case "string" : {
                    module._doc.data[path].value = validtext(value);
                
                break;
            }
            case "boolean" : {
                    module._doc.data[path].value = Boolean(value); 
                break;
            }
            case "number" : {
                 if( !isNaN(parseInt(value))){
                    module._doc.data[path].value = parseInt(value);
                    break;
                 }
               
            }
            case "choice" : {

                if(value.selected && module._doc.data[path].value.availables &&
                    module._doc.data[path].value.availables.includes(value.selected)){
                        module._doc.data[path].value.selected = validtext(value.selected)
                        break;
                }
            }
            case "role" :{
                if(!Array.isArray(value)) return;
                const data = module._doc.data[path]
                if(data.meta && data.meta.min && data.meta.min > value.length)
                    return;
                if(data.meta && data.meta.max && data.meta.max < value.length)
                    return;

                for(const v of value){
                    const r =client.guilds.cache.get(guildID).roles.cache.get(v)
                    if(!r) return;
                }
                module._doc.data[path].value = value;
                break;
            }
            default :{
                return;
            }
        }
        module.markModified("data")
        if(await module.save()){
            return module;
        }
    }
}

export async function setModuleData(payload:  {guildID : string, userID : string,module : string,data : any }){

    var module : any= getModuleData(payload.guildID,payload.userID,payload.module)

    if(!module) {
        const moduleguild = getGuild(payload.guildID);
        if(!moduleguild || !moduleguild.has(payload.module)) return
        
        if(!ModulesData.has(payload.guildID))
        ModulesData.set(payload.guildID, new Map<string,IModuleDocument>());

        const g = getModuleDataGuild(payload.guildID);
        const mods = new Map<string,IModuleDataDocument>()
        

        module = new ModuleData({
            guildID : payload.guildID,
            userID : payload.userID,
            name : payload.module,
            data : payload.data,
        })

        mods.set(payload.module,module)
        if(!g.has(payload.userID))
            g.set(payload.userID, mods);
    }

    module._doc.data = payload.data;
    module.markModified("data")
    if(await module.save()){
        return module._doc.data;
    }



}

updateCache()