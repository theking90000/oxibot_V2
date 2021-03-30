import { Request, Response } from "express"
import { getGuild } from "../../../cache/guilds"
import { GetAllServersCustomLangs } from "../../../cache/lang"


export default async (req: Request, res: Response) => {
    if (req.query.type === "ALL") {
    const guilds = []
    for (const [id, guild] of req.user.guilds) {
        const guild_b = getGuild(id)
        if (guild_b && req.user.guilds.get(guild_b.guildID).permission.hasPermission('panel.command.see')) {
            var cmds = guild_b.commands.map(x => ({
                enabled : x.enabled,
                name : x.name,
                settings : x.settings,
            }))
        }
        guilds.push({cmds, id : guild_b.guildID})
    }
        return res.status(200).json({success : true, data : guilds})

}else if(req.query.type){
    if (!req.user.guilds.has(req.query.type as string)) return res.status(400).json({ success: false })
    const guild_b = getGuild(req.query.type as string)
        if (guild_b && req.user.guilds.get(guild_b.guildID).permission.hasPermission('panel.command.see')) {
            if (req.query.command) {
                const x  = guild_b.commands.find(c => c.name === req.query.command)
                if (!x)
                    return res.status(200).json({ success: false })
       
                return res.status(200).json({
                    success: true,
                    data: {
                        cmd: {
                            enabled: x.enabled,
                            name: x.name,
                            settings: x.settings,
                        }
                    }
                    })
            }

            return res.status(200).json({
                success: true,
                data: {
                    cmds : guild_b.commands.map(x => ({
                        enabled: x.enabled,
                        name: x.name,
                        settings: x.settings,
                    }))
                }
            })
        }
        return res.status(401).json({success : false})

}else{ 
    return res.status(400).json({success : false})
}
}