import * as express from "express";
import groups, { getGroups } from "../../cache/group";
import { selectUser,userS } from "../../cache/user"
import * as bodyParser from "body-parser";

declare global {
namespace Express {
    interface Request {
      guild? : string,
      user_a? : userS
    }
  }
}
const router = express.Router();


router.use(bodyParser.json())

    router.use( (req,res,next) => {
        if(req.body && req.body.guild && req.body.user){
            try {
                const user = selectUser(req.body.guild,req.body.user)
                if(user){
                    req.guild = req.body.guild
                    req.user_a = user;
                    next()
                }else
                return res.status(400).json({success : false})
            }catch {
                return res.status(400).json({success : false})
            }
        }
        
    })

    router.post('/groups', (req,res,next) => {
        if(req.body.action){
            switch(req.body.action){
                case "ADD" : {
                    if(req.body.group && req.user.guilds.get(req.guild).permission.hasPermission("panel.groups.addgroup")){
                        const groups = getGroups(req.guild)
                        const ugroups = req.user_a.getGroups()
                        if(!ugroups.find(c => c.name === req.body.group)){
                            if(groups.find(c => c.name === req.body.group)){
                                req.user_a.addGroup(req.body.group)
                                return res.status(200).json({success : true})
                            }else{
                                return res.status(400).json({success : false, message : "NO GROUP"})
                            }
                        }else{
                            return res.status(400).json({success : false, message : "HAS GROUP"})
                        }
                       
                    }
                   
                }
                case "REMOVE" : {
                    if(req.body.group && req.user.guilds.get(req.guild).permission.hasPermission("panel.groups.removegroup")){
                        const groups = getGroups(req.guild)
                        const ugroups = req.user_a.getGroups()
                        if(ugroups.find(c => c.name === req.body.group)){
                            if(groups.find(c => c.name === req.body.group)){
                                req.user_a.removeGroup(req.body.group)
                                return res.status(200).json({success : true})
                            }else{
                                return res.status(400).json({success : false, message : "NO GROUP"})
                            }
                        }else{
                            return res.status(400).json({success : false, message : "NOT IN GROUP"})
                        }
                       
                    }
                   
                }

                default : {
                    return res.status(400).json({success : false})
                }
            }
        }
        else
        return res.status(400).json({success : false})
    })

export default router;