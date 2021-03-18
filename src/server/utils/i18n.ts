import { Channel } from "discord.js";
import * as LangCache from "../cache/lang"
import { defaultlocale } from "../../../config"
import { IGuildDocument } from "../database/models/guild";
import { IUsersDocument } from "../database/models/user";
import { parsePlaceHolder } from "./placeholders";

const Translations = new Map<string, Map<string, string>>();
const CustomTranslation = new Map<string, Map<string, string>>();


export type langobject = {
    t(key: string, params?: { [key: string]: string }): string,
    readonly lang: { [key: string]: string }
}

export const getLangFromMessage = async (info: {
    channel?: Channel, guild?: IGuildDocument, user?: IUsersDocument
}): Promise<langobject> => {

    const langs: any = await LangCache.GetAllServersCustomLangs(info.guild.guildID)

    var lang: { [key: string]: any }

    if (langs.length > 0) {
        if (info.channel && langs.find(x => x.forcedChannels.includes(info.channel.id))) {
            lang = langs.find(x => x.forcedChannels.includes(info.channel.id))
        }
        else if (info.user && langs.find(x => x.langcode === info.user.lang)) {
            lang = langs.find(x => x.langcode === info.user.lang)
        } else {
            lang = langs.find(x => x.default === true) || langs[0]
        }
        lang = lang._doc.translation
    } else {
        const defaultlang = LangCache.getAllLang()
        if (info.user && info.user.lang && defaultlang.find(x => x.lang === info.user.lang)) {
            lang = LangCache.GetLang(defaultlang.find(x => x.lang === info.user.lang).lang).bot
        }
        else {
            lang = LangCache.GetLang(defaultlocale).bot
        }
    }

    return {
        t: (key, params?) => {
            if (lang[key]) {
                var text = lang[key]
                const matches = text.match(/{{\w*}}/g)
                if (matches && params) {
                    for (const key2 of matches) {
                        if (params[key2.replace(/{{/, '').replace(/}}/, "")]) {
                            text = text.replace(key2, params[key2.replace(/{{/, '').replace(/}}/, "")])
                        }
                    }
                }
                text = text.replace(/<br>/g, "\n").replace(/\\n/g, "\n")
                return parsePlaceHolder({
                    text: text.replace(/{{\w*}}/, ""),
                    guildID: info.guild ? info.guild.guildID : null,
                    userID: info.user ? info.user.userID : null,
                })
            }


            return key;
        },
        lang,
    }

}