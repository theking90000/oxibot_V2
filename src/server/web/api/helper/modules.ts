import { Request, Response } from "express"
import { getGuild } from "../../../cache/Module"

export default async (req : Request,res : Response) => {
    if(req.query.type && req.query.module){
        const guild = getGuild((req.query.type as string));
        if(!guild || !guild.has(req.query.module as string)) return res.status(400).json({success : false})
        const cmd = guild.get(req.query.module as string)
        return res.status(200).json({
            success : true,
            data : {
            name : cmd.name,
            toggled : cmd.toggled,
            data : cmd.data,
            }
        })
    }
    return res.status(400).json({success : false})
}