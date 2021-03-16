import * as nodeCache from "node-cache";
import * as fs from "fs"
import {defaultlocale} from "../../../config"
import i18n from "i18next"
import {join} from 'path'
import { gray } from "chalk";
import * as NodeCache from "node-cache"
import CustomLang, { CustomLangDocument, ICustomLang } from "../database/models/CustomLang";

const lang = new nodeCache();

const serverLang = new NodeCache({useClones : false});

const init = async () => {
    fs.readdir(join(__dirname , '..' , '..', '..', 'locales'),async (err, files) => {
        if(err) return;
        for(const file of files){
            if(!file.endsWith('.json')) continue

            const translate = require(join(__dirname , '..' , '..', '..', 'locales', file) )
            lang.set(file.slice(0,-5), translate)
        }

        const customLangs = await CustomLang.getAll();
        for(const lng of customLangs){
            serverLang.set(`${lng.guildID}-${lng.langcode}`, lng)
        }  
        console.log(gray(`${files.length+customLangs.length} langues chargées dans le cache`))
        
        i18nInit()
    })
}

init()

const i18nInit = () => {

}

export const CreateServerLang = async ({serverID,template,langname,langcode}) => {
    if(!LangExist(template)) return;

    if(ServerLangExist(`${serverID}-${langcode}`)) return;

    const ServerLNG  = new CustomLang({
        guildID : serverID,
        langname,langcode,
        translation : GetLang(template).bot
    })
    if(await ServerLNG.save()){
    serverLang.set(serverID,ServerLNG);
    return ServerLNG.translation;
    }
    return;
}

export const GetAllServersCustomLangs = async (serverID) : Promise<CustomLangDocument[]> => {
    const t :CustomLangDocument[]  = []
    for(const key of serverLang.keys()){
        if(key.startsWith(serverID)){
            t.push(serverLang.get(key))
        }
    }
    return t
}

export const DeleteServerLang =async ({serverID,langname,langcode}) : Promise<Boolean>=> {
    if(!ServerLangExist(`${serverID}-${langcode}`)) return false;

    const lng = GetServerLang(serverID,langcode);

    if(lng && await lng.delete()) {
        serverLang.del(`${serverID}-${langcode}`)
        return true
    }
    return false
}

export const ServerLangExist = (name : string) : boolean => serverLang.has(name)

export const GetServerLang = (guildID : string,code : string) : CustomLangDocument => serverLang.get(`${guildID}-${code}`)

export const LangExist = (name : string) : boolean => lang.has(name)

export const GetLang = (name : string) : any => lang.get(name)

export const getAllLang = () : {lang : string,langname : string}[] => lang.keys().map((value) => 
{ return{
    lang: value,
    langname : GetLang(value).name 
}})
