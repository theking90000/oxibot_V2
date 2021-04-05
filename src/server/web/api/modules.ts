import * as Express from "express"
import { EnableDisableModule, getGuild, setData } from "../../cache/Module";


const router = Express.Router();


router.use( (req,res,next) => {
    if(!req.path.startsWith("") || !req.path.startsWith("/") || req.path.startsWith("/enable")) return next()
    if(req.body && req.body.guild && req.user.guilds.get(req.body.guild)){
        if(req.user.guilds.get(req.body.guild).permission.hasPermission('panel.modules.manage')){
            next();
        }else{
            return res.status(401).json({success : false})
        }
    }   else{
        return res.status(400).json({success : false})
    }
    
})

router.put("/", async (req , res, next) => {
    if(req.body.name && req.body.path && req.body.type && req.body.value !== null ){
       if(await setData(req.body.guild ,req.body.name,req.body.value,
        req.body.path,req.body.type)){
            return res.status(200).json({success : true})
        }else{
            return res.status(400).json({success : false})
        }
        
    }else{
        return res.status(400).json({success : false})
    }
})

router.put('/enable', async (req,res,next) => {
    if(req.body.name && (req.body.value !== undefined || req.body.value !== null)){
        if(await EnableDisableModule({ module : req.body.name,guildID : req.body.guild,value : req.body.value })){
            return res.status(200).json({success : true})
           }else{
            return res.status(400).json({success : false})
           }
        }else{
            return res.status(400).json({success : false})
        }
})

export default router;