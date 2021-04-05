import { Request, Response } from "express"


export default async (req : Request,res : Response) => {
try{
    if(req.query.type && typeof(req.query.type) === "string") {
        switch(req.query.type.toLowerCase()){
            case "all" : {
                const roles = []
               for(const [id_,guild] of req.user.guilds){
                   if(guild.permission.hasPermission("roles.see")){
                       const x = []
                    for(const [id,role] of (await guild.Guild.roles.fetch()).cache.sort((r1,r2) => r2.position - r1.position)){
                        x.push({
                            id,
                            name : role.name,
                            color : role.hexColor,
                            position : role.position,
                        })
                    }
                   roles.push({guild : id_ , data : x});
                   }
               }
               if(roles[0])
               return res.status(200).json({success: true, data : roles});
            }
            default : {
                if(req.user.guilds.get(req.query.type)){
                    const guild = req.user.guilds.get(req.query.type);
                    if(guild.permission.hasPermission("roles.see")){
                    const roles = [];
                    for(const [id,role] of (await guild.Guild.roles.fetch()).cache.sort((r1,r2) => r2.position - r1.position)){
                        roles.push({
                            id,
                            name : role.name,
                            color : role.hexColor,
                            position : role.position,
                        })
                    }
                    return res.status(200).json({success: true, data : roles});
                }
                }
                return res.status(400).json({success : false})
            }
        }
    }
}catch{
    return res.status(500).json({success : false});
}
}