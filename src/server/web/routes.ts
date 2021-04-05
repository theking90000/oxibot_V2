import { join } from "path"
import { Express } from "express"
import router from "./api/routes"
import * as Lang from "../cache/lang"
import captcha from "./html/captcha"
import indexP from "./html/index"

export default function (app : Express){

    app.use('/api',router)

    app.get('/bundle.js', (req,res,next) => {
        res.sendFile('bundle.js', { root : join(__dirname, '..','..','client'),}, (err) => {

        })
    })

    app.use('/captcha/:id', async (req,res,next)=> {
        if(req.params.id){
        const html = await captcha(req.params.id)
        if(html.ok)
        return res.send(html.html)
        }
        next()
    })

    app.get('/captcha.js' , (req,res,next) => {
        res.sendFile('captcha.js', { root : join(__dirname, '..','..','client'),}, (err) => {

        })
    })

    app.get('/locales/:lang.json', async (req,res,next) => {
         
        if(Lang.LangExist(req.params.lang)){
            const l = Lang.GetLang(req.params.lang);
            l.web.name = l.name
            const t = {...l.web,doc : {permissions : l.doc.permission} }
            res.status(200).json({name : l.name,translates : t})
        }else{
            return res.status(404).json({success : false});
        }
        
        
    })

    app.get("*", async (req,res,next) =>{
        const html = await indexP(req.params.id);
        if(html) return res.send(html);
        else return res.send("Error");
    }) 

}