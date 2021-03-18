import * as Express from "express"
import { AddForcedTranslationChannel, CreateServerLang, DeleteServerLang, RemoveForcedTranslationChannel, SetKeyServerLang } from "../../cache/lang";
import { defaultlocale } from "../../../../config"

const router = Express.Router();

router.use( (req,res,next) => {
    if(req.body && req.body.guild && req.user.guilds.get(req.body.guild)){
        if(req.user.guilds.get(req.body.guild).permission.hasPermission('panel.lang.manage')){
            next();
        }else{
            return res.status(401).json({success : false})
        }
    }   else{
        return res.status(400).json({success : false})
    }
    
})

router.post('/', async (req,res,next) => {
    if (req.body.langcode && req.body.langname && req.body.action) {
        switch(req.body.action){
            case "CREATE" : {
                try{
                if(req.body.langname.match(/^[a-z-A-Z-0-9]{1,15}$/) && req.body.langcode.match(/^[a-z]{2}-[A-Z]{2}$/) ){
                    const translations = await CreateServerLang({
                        langcode : req.body.langcode,
                        langname : req.body.langname,
                        serverID : req.body.guild,
                        template : req.body.template || defaultlocale
                    })
                    if(!translations){
                        return res.status(400).json({success : false})
                    }else
                    return res.status(200).json({success: true,  translations})
                }
            }catch{
                return res.status(500).json({success : false})
            }
                
            }
            case "DELETE" : {
                    try{
                        if (req.body.langcode) {
                        if(await DeleteServerLang({
                            langcode: req.body.langcode,
                            serverID : req.body.guild,
                        }))
                        return res.status(200).json({success: true})
                        else return res.status(400).json({success : false})
                    }
                }catch{
                    return res.status(500).json({success : false})
                }
                    
            }

            default :{
                return res.status(400).json({success : false})
            }
        }
    }else{
        return res.status(400).json({success : false})
    }
})

router.put("/", async (req, res, next) => {
    try {
        if (req.body.langcode && req.body.key && req.body.value && req.body.value !== "") {
            if (await SetKeyServerLang({
                key: req.body.key,
                langcode: req.body.langcode,
                serverID: req.body.guild,
                value: req.body.value
            })) return res.status(200).json({ success: true })
            else return res.status(400).json({ success: false })

        }
    } catch {
        return res.status(500).json({ success: false })
    }
} )

router.put('/channels', async (req, res, next) => {
    try {
        if (req.body.langcode && req.body.channel && req.body.type === "ADD") {
            if (await AddForcedTranslationChannel({
                channel: req.body.channel,
                langcode: req.body.langcode,
                serverID: req.body.guild,
            })) return res.status(200).json({ success: true })
            else return res.status(400).json({ success: false })

        }
        if (req.body.langcode && req.body.channel && req.body.type === "REMOVE") {
            if (await RemoveForcedTranslationChannel({
                channel: req.body.channel,
                langcode: req.body.langcode,
                serverID: req.body.guild,
            })) return res.status(200).json({ success: true })
            else return res.status(400).json({ success: false })
        }
        return res.status(400).json({ success: false })
    } catch {
        return res.status(500).json({ success: false })
    }
})

export default router;