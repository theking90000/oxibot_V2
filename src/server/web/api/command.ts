import * as Express from "express";
import * as GuildCache from "../../cache/guilds"

const router = Express.Router();


router.use( (req,res,next) => {
    if(req.body && req.body.guild && req.user.guilds.get(req.body.guild)){
        if(req.user.guilds.get(req.body.guild).permission.hasPermission('panel.commands.edit')){
            next();
        }else{
            return res.status(401).json({success : false})
        }
    }   else{
        return res.status(400).json({success : false})
    }
    
})

router.put('/enable',async (req,res,next) => {
    if(req.body.name && (req.body.value !== undefined || req.body.value !== null)){
       if(await GuildCache.SetCommandEnabled({ name : req.body.name ,id : req.body.guild,value : req.body.value })){
        return res.status(200).json({success : true})
       }else{
        return res.status(400).json({success : false})
       }
    }else{
        return res.status(400).json({success : false})
    }
})

router.put('/data', async (req,res,next) => {
    if(req.body.name && req.body.setting && (req.body.value !== undefined || req.body.value !== null)){
        if(await GuildCache.setCommandData({ name : req.body.name,setting : req.body.setting ,id : req.body.guild,value : req.body.value })){
            return res.status(200).json({success : true})
           }else{
            return res.status(400).json({success : false})
           }
        }else{
            return res.status(400).json({success : false})
        }
})
router.put('/aliases', async (req,res,next) => {
    try{
    if(req.body.name && req.body.type && req.body.data){
        if(await GuildCache.AddRemoveCommandAliases({data : req.body.data, id : req.body.guild,name : req.body.name,type : req.body.type})){
            return res.status(200).json({success : true})
           }else{
            return res.status(400).json({success : false})
           }
        }else{
            return res.status(400).json({success : false})
        }
    }catch(e){
        return res.status(500).json({success : false})
    }
})

export default router;