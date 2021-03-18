import { Request, Response } from "express"
import { GetAllServersCustomLangs } from "../../../cache/lang"


export default async (req : Request,res : Response) => {
if(req.query.type === "ALL"){

}else if(req.query.type){
if(!req.user.guilds.has(req.query.type as string)) return res.status(400).json({success : false})
    const guild = req.user.guilds.get(req.query.type as string)
    if(guild.permission.hasPermission('panel.customlangs.see')){
        return res.status(200).json({success: true , data : (await GetAllServersCustomLangs(guild.Guild.id)).map(c => {
            const _c : any = c
            return {
                    code : c.langcode,
                    name : c.langname,
                    forcedChannels : c.forcedChannels,
                    translations : _c._doc.translation,
            }
         }) 
        })
    }
}else{
    return res.status(400).json({success : false})
}
}