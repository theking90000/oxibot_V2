import { GuildMember, Message } from "discord.js"
import {EventListeners, Module} from "./module"
import { site_base_url,recaptcha,hcaptcha, } from "../../../config.js"
import {randomBytes} from "crypto"
import { getLangFromMessage } from "../utils/i18n"
import guilds, { getGuild } from "../cache/guilds"
import embed from "../utils/embed"
import { Router } from "express"
import { getModule } from "./ModuleManager"
import { selectUser } from "../cache/user"
import { ActionUserWeb, selectUser as SelectUserWeb } from "../cache/userweb"
import { checkHCaptcha, checkReCaptcha } from "../utils/CheckCaptcha"
import client from ".."
import { proxycheck } from "../utils/IpCheck"
import { hash } from "../utils/HashHelper"

type userdata = {
    hashed_ip : string,
    captcha_id: string,
    captcha_secret: string,
    valided : boolean,
}

export default class Captcha extends Module{
    constructor(){
        super({
            name : "Captcha",
            settings : {
                requireAuth : {
                    default : false,
                    type : "boolean",
                },
                customMessage : {
                    default : "SALUT A TOUS C FANTA",
                    type : "string"
                },
                CaptchaType : {
                    type : "choice",
                    default : {
                        availables : ["ReCaptcha","hCaptcha"],
                        selected : "ReCaptcha"
                    }
                },
                maxAccountPerIp : {
                    type : "number",
                    default : 1,
                    meta : {
                        min : 1,
                    }
                },
                CaptchaRole : {
                    type : "role",
                    default : [],
                    meta : {
                        min : 0,
                    }
                },
                VerifiedRole : {
                    type : "role",
                    default : [],
                    meta : {
                        min : 0,
                    }
                }
            },
            subscribe : ["join","message"],
            routes
        })
    }
    
    public async onEvent(e){
        /**
         * HANDLE JOIN EVENT 
         * (Captcha Creation)
         */
        if(e.name === "join"){
        const event = e.event as GuildMember
        if(event.user.bot) return;
          var userd = this.getUserData(event.guild.id,event.id) as userdata;
           if(!userd.captcha_id){
               const data : userdata = {
                    captcha_id : this.genUniqueId(16),
                    captcha_secret : this.genUniqueId(32),
                    hashed_ip : "",
                    valided : false,
               }
               this.setUserData(event.guild.id,event.id,data)
               userd = data;
           }
           if(!userd.valided){
               const user =selectUser( event.id,event.guild.id )
               const lang = await getLangFromMessage({
                guild : getGuild (event.guild.id),
                user: user ? user.user : null
            })
            const data_ = this.getData(event.guild.id)
            
            if(data_.CaptchaRole.value && Array.isArray(data_.CaptchaRole.value) ){
                for(const role_ of data_.CaptchaRole.value){
                    const role= event.guild.roles.cache.get(role_)
                    if(role && role.editable && event.manageable && !event.roles.cache.has(role_)){
                        try{
                            await event.roles.add(role)
                        }catch{

                        }
                    }
                }
            }
            return event.user.send(embed({
                guildid : event.guild.id,
                name : lang.t("CaptchaEmbedTitle"),
                fields : [{
                    val1 : lang.t('CaptchaEmbed'),
                    val2 : `[${lang.t("CaptchaEmbedDescription")}](${this.getLink(userd.captcha_id)})`
                }]
            }).getEmbed())
            
           }
          
           this.RolesC(event.guild.id,event.id)
        }
        /**
         * Message Event
         * (Testing)
         */
        if(e.name === "message"){
            const msg = e.event as Message
            const userd = this.getUserData(msg.guild.id,msg.author.id) as userdata;
            
          
        }
    }

    public genUniqueId (size : number) : string  {
    
        const gen = () : string => randomBytes(size).toString('hex');
        const exist = (id : string) : boolean => {
            for(const [g,guild] of this.getAllUserData()){
                for(const [u,user_ ] of guild) {
                   const user= user_ as userdata
                    if(user.captcha_id === id )
                        return true;
                }
            }
            return false;
        }
        
        let uuid = gen();
        while(exist(uuid)){
            uuid = gen();
        }
    
        return uuid;
    }

    public getLink(id : string){
        return site_base_url + (site_base_url.endsWith("/") ? "captcha" : "/captcha")
        + "/" + id;
    }
    
    public getAllIps(){
        const ips = []
        for(const [g,guild ] of this.getAllUserData()) {
            for(const [u,user_] of guild){
                const user= user_ as userdata
                ips.push(user.hashed_ip)
            }
        }
        return ips;
    }

    public findByCaptchaId(id : string){
                for(const [g,guild ] of this.getAllUserData()) {
                    for(const [u,user_] of guild){
                        const user= user_ as userdata
                        if(user.captcha_id === id)
                            return {
                                guildID : g,
                                userID : u,
                                data : user,
                            }

                    }
                }
                return null;

        }

    public passCaptcha(id : string,ip :string){
        const captcha = this.findByCaptchaId(id);
        if(!captcha) return 
        captcha.data.valided = true;
        captcha.data.hashed_ip = ip;
        this.RolesC(captcha.guildID,captcha.userID)
        this.setUserData(captcha.guildID,captcha.userID,captcha.data)
    }

    private async RolesC (guildID,userID){
        try{
        const data_ = this.getData(guildID)
        const event = client.guilds.cache.get(guildID).members.cache.get(userID)
        if(data_.CaptchaRole.value && Array.isArray(data_.CaptchaRole.value) ){
            for(const role_ of data_.CaptchaRole.value){
                const role= event.guild.roles.cache.get(role_)
                if(role && role.editable && event.manageable && event.roles.cache.has(role_)){
                    try{
                        await event.roles.remove(role)
                    }catch{

                    }
                }
            }
        }
        if(data_.VerifiedRole.value && Array.isArray(data_.VerifiedRole.value) ){
            for(const role_ of data_.VerifiedRole.value){
                const role= event.guild.roles.cache.get(role_)
                if(role && role.editable && event.manageable && !event.roles.cache.has(role_)){
                    try{
                        await event.roles.add(role)
                    }catch{

                    }
                }
            }
        }
    }catch{

    }
    }
}

const routes = (router :Router): Router => {

    router.post("/verification",async(req,res,next)=> {
        try{
            /**
             * Check Captcha First
             * 
             */
            if(!req.body || !req.body.captcha_token ||
                (req.body.captcha_type !== "ReCaptcha" && req.body.captcha_type !== "hCaptcha"))
            return res.status(401).json({success : false,error : "Invalid Type"})

            if((req.body.captcha_type === "ReCaptcha" && await checkReCaptcha(recaptcha.secret,req.body.captcha_token)
            || (req.body.captcha_type === "hCaptcha" && await checkHCaptcha(hcaptcha.secret,req.body.captcha_token)))){

            /**
             * Users checks;
             */
            if(req.body.captcha_id){
                const module = getModule("Captcha") as Captcha
                const captcha = module.findByCaptchaId(req.body.captcha_id);
                if(!captcha) return res.status(401).json({success : false, error : "Invalid Captcha"})
                const data= module.getData(captcha.guildID)
                if(!data) return res.status(400).json({success : false, error : "Invalid Captcha"})
                if(data.requireAuth.value === true){
                    var user : ActionUserWeb;
                    if(req.headers.authorization){
                          user = await SelectUserWeb(req.headers.authorization);
                    }
                    if(!user || user.getDiscord.User.id !== captcha.userID) return res.status(401).json({success : false, error :"Invalid user"}) 
                }

            /**
             * Ip check
             * 
             */
                let ip = req.header('x-forwarded-for') || req.ip;
                if(await proxycheck(ip)){
                    return res.status(401).json({success : false, error : "VPN DETECTED"})
                }
                ip = await hash(ip); 
                const ips = module.getAllIps().filter(x => x === ip);
                
                if(ips.length === 0 || ips.length+1 <= data.maxAccountPerIp.value){
                module.passCaptcha(captcha.data.captcha_id, ip);
                return res.status(200).json({success : true})
                }
                return res.status(401).json({success : false, error : "Max account reached"})
            }
            }else{
                return res.status(401).json({success :false,error :"Invalid Captcha"})
            }
        }catch(e){
            return res.status(500).json({success :false})
        }
    })

    router.get('/login', async (req,res,next) => {
        try{
            var user;
           if(req.headers.authorization){
                user = await SelectUserWeb(req.headers.authorization);
           }
          if(!user) return res.status(401).json({success : false}) 
          return res.json({ success : true, userid : (user as ActionUserWeb).getDiscord.User.id})
        }catch(e){
            return res.status(500).json({success : false})
        }
    })

    return router
}