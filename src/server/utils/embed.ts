import { MessageEmbed } from "discord.js"
import { embed_default_color } from "../../../config"

type embed_ = {
    fields? : {
        val1 : string,
        val2? : string,
        inline? : boolean
    }[],
    color? : string,
    name? : string,
}

type emreturn = {
    getEmbed(): MessageEmbed,
    addFields(fields : {
        val1 : string,
        val2? : string,
        inline? : boolean
    }[]) : embed_,
}

export default function embed(e : embed_) : emreturn{

    let m = new MessageEmbed();
    
    if(e.fields)
    e.fields.forEach(c => {
        m.addField(c.val1, c.val2 ? c.val2 : " ",c.inline )
    })

    m.setColor(e.color ? e.color : embed_default_color)

    if(e.name) m.title = e.name

    let x  : emreturn= {
        getEmbed : () => m,
        addFields : (fields) => {
            fields.forEach(c => {
                m.addField(c.val1, c.val2 ? c.val2 : `\u200B`,c.inline );
            })
            return this;
        }
    }

    return x;
}