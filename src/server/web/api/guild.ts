import * as express from "express";
import * as Guilds from "../../cache/guilds"

const router = express.Router();

router.use( (req,res,next) => {
    if(req.body && req.body.guild && req.user.guilds.get(req.body.guild)){
        if(req.user.guilds.get(req.body.guild).permission.hasPermission('panel.settings.manage')){
            next();
        }else{
            return res.status(401).json({success : false})
        }
    }   else{
        return res.status(400).json({success : false})
    }
    
})

router.put("/settings" , async (req,res,next) => {
    if((req.body.value !== undefined) && req.body.cat && req.body.name){
        if(await Guilds.updateSettingVal({ 
            cat : req.body.cat,
            id : req.body.guild,
            name : req.body.name,
            value : req.body.value
         })){
             res.status(200).send({success : true})
         }
         else
         res.status(400).send({success : false})
    }
})

export default router