import * as nodeCache from "node-cache";
import * as fs from "fs"
import {defaultlocale} from "../../../config"
import * as i18n from "../utils/i18n"
import {join} from 'path'
import { gray } from "chalk";
import * as NodeCache from "node-cache"
import CustomLang, { CustomLangDocument, ICustomLang } from "../database/models/CustomLang";
import client from "..";

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
        MigrateServerLang()

    })
}

init()


export const CreateServerLang = async ({serverID,template,langname,langcode}) => {
    if(!LangExist(template)) return;

    if(ServerLangExist(`${serverID}-${langcode}`)) return;

    const ServerLNG  = new CustomLang({
        guildID : serverID,
        langname,langcode,
        translation: GetLang(template).bot,
        forcedChannels: []
    })
    if(await ServerLNG.save()){
        serverLang.set(`${serverID}-${langcode}`, ServerLNG);
    return ServerLNG.translation;
    }
    return;
}

export const MigrateServerLang = async () => {
    var processed = 0;
    for (const server of serverLang.keys()) {
        const l: any = serverLang.get(server)
        if (JSON.stringify(Object.keys(l._doc.translation)) === JSON.stringify(Object.keys(GetLang(defaultlocale).bot))) continue
        l._doc.translation = {
            ...GetLang(defaultlocale).bot,
            ...l._doc.translation,
        }
        l.markModified("translation")
        if (await l.save())
            processed++
    }
    if (processed > 0) console.log(gray(`${processed} Langues customs migrées !`))
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

export const DeleteServerLang = async ({ serverID, langcode }): Promise<Boolean> => {
    if(!ServerLangExist(`${serverID}-${langcode}`)) return false;

    const lng = GetServerLang(serverID, langcode);
    if(lng && await lng.delete()) {
      serverLang.del(`${serverID}-${langcode}`) 
        return true
    }
    return false
}

export const SetKeyServerLang = async ({ serverID, langcode, key, value }): Promise<Boolean> => {
    if (!ServerLangExist(`${serverID}-${langcode}`)) return false;

    const lng: any = GetServerLang(serverID, langcode);
    if (lng && lng._doc.translation[key]) {
        lng._doc.translation[key] = value;
        lng.markModified("translation")
        if (await lng.save())
            return true
    }

    return false;
}

export const AddForcedTranslationChannel = async ({ serverID, langcode, channel }): Promise<Boolean> => {
    if (!ServerLangExist(`${serverID}-${langcode}`)) return false

    const lng = GetServerLang(serverID, langcode);
    if (lng && !lng.forcedChannels.find(c => c === (channel))) {
        if (client.guilds.cache.get(serverID).channels.cache.has(channel)) {
            lng.forcedChannels = [...lng.forcedChannels, channel]
            if (await lng.save()) {
                return true
            }
        }
    }
    return false

}

export const RemoveForcedTranslationChannel = async ({ serverID, langcode, channel }): Promise<Boolean> => {
    if (!ServerLangExist(`${serverID}-${langcode}`)) return false

    const lng = GetServerLang(serverID, langcode);
    if (lng) {
        lng.forcedChannels = lng.forcedChannels.filter(x => x !== channel)
        if (await lng.save()) {
            return true
        }
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
