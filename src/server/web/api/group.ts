import * as express from "express";
import * as Groups from "../../cache/group"

const router = express.Router();

router.use( (req,res,next) => {
    if(req.body && req.body.guild && req.body.group){
            next();
    }   else{
        return res.status(400).json({success : false})
    }
    
})

router.post('/', async (req,res,next) => {
    if(req.body.action){
        switch(req.body.action){
            case "CREATE" : {
                if(req.user.guilds.get(req.body.guild).permission.hasPermission('panel.groups.create')
                    && !Groups.getGroups(req.body.guild).find(c => c.name === req.body.group) 
                    && req.body.group.match(/^[a-z-A-Z-0-9]{3,15}$/)) {
                        try{
                            await Groups.createGroup({ guildID : req.body.guild,name : req.body.group,permissions : [] })
                            return res.status(200).json({success : true})
                        }catch{
                            return res.status(400).json({success : false})
                        }
                    }else{
                        return res.status(400).json({success : false})
                    }
            }
            case "DELETE" : {
                if(req.user.guilds.get(req.body.guild).permission.hasPermission('panel.groups.delete')
                && Groups.getGroups(req.body.guild).find(c => c.name === req.body.group)) {
                    try{
                        await Groups.removeGroup({ guildID : req.body.guild,name : req.body.group, })
                        return res.status(200).json({success : true})
                    }catch{
                        return res.status(400).json({success : false}) 
                    }
                }else{
                    return res.status(400).json({success : false})
                }
            }

            default : {
                return res.status(400).json({success : false})
            }
        }
    }
})

router.post('/permission', async (req,res,next) => {
    if(req.body.action){
        switch(req.body.action){
            case "REMOVE" : {
                if(req.body.permission && req.user.guilds.get(req.body.guild).permission.hasPermission('panel.groups.permissions.delete')
                    && Groups.getGroups(req.body.guild).find(c => c.name === req.body.group)) {
                       
                    await Groups.setPermission( { name: req.body.group, guildID : req.body.guild },
                         (perms) =>  perms.filter(c => c !== req.body.permission))
                    return res.status(200).json({success : true})
                }
            }
            case "ADD" : {
                if(req.body.permission && req.user.guilds.get(req.body.guild).permission.hasPermission('panel.groups.permissions.add') 
                && Groups.getGroups(req.body.guild).find(c => c.name === req.body.group)){

                    let success = false

                   Groups.setPermission( {
                       name : req.body.group,
                       guildID : req.body.guild
                   }, (perms) => {
                    if(!perms.includes(req.body.permission)) {
                        perms.push(req.body.permission)
                        success = true;
                    }
                        
                    return perms;
                   }) 

                   return res.status(200).json({success : success})

                }
            }
            default : {
                return res.status(400).json({success : false})
            }
        }
    }

})

export default router