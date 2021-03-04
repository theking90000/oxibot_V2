import { join } from "path"
import { Express } from "express"
import router from "./api/routes"

export default function (app : Express){

    app.use('/api',router)

    app.get('/bundle.js', (req,res,next) => {
        res.sendFile('bundle.js', { root : join(__dirname, '..','..','client'),}, (err) => {

        })
    })

    app.get("*", (req,res,next) =>{
        res.sendFile('index.html',{root:join(__dirname,'..','..','client')}, (err) =>{
            if(err) null
            else next()
        })
    }) 

}