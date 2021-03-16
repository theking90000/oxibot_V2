import * as express from "express";
import { checkToken } from "./discord"
import auth from "./format/auth"
import syncFormat from "./helper/sync"
import { randomBytes } from "crypto"
import { urlencoded, json}from "body-parser";
import { addUserWeb,selectUser,isUserExist,updateUserToken } from "../../cache/userweb"
import userRouter from "./user"
import GroupRouter from "./group"
import DocRouter from "./doc"
import GuildRouter from "./guild"
import CommandRouter from "./command"
import LangRouter from "./lang"
import { defaultlocale } from "../../../../config"
import { getAllLang } from "../../cache/lang"

const router = express.Router();

router.use(urlencoded({extended: true}));
router.use(json())


  /**
   * @name /auth
   * @description called to get Token from discord Token
   * @type POST
   */
  router.post('/auth', async (req,res,next) => {
    let err = auth.validate(req.body).error 
    if(!err){
      
      const useri = await checkToken(req.body.token)
      console.log(useri)
      if(!useri) return res.status(400).json({success : false})

      const token = randomBytes(256).toString('base64')

      if(!isUserExist(useri.id)){
      try{
        let user = await addUserWeb({
          userID : useri.id,
        access_token : req.body.token,
        expires : req.body.expires_in,
        token : token,
        })

        if(user){
        return  res.status(200).json({success : true,token : token})
        }
        return  res.status(400).json({success : false})
      }catch{
        return res.status(400).json({success : false})
      }
    }else{
      let user = await updateUserToken({
        userID : useri.id,
      access_token : req.body.token,
      expires : req.body.expires_in,
      token : token,
      })

      if(user){
      return  res.status(200).json({success : true,token : token})
      }
      return  res.status(400).json({success : false})
    }

    }
    return res.status(400).json({success : false})
  })

  /**
     * @name /doc/*
     * 
     */
   router.use('/doc',DocRouter)

   router.get('/test',(req,res,next) => {
     res.send('eaz')
   })

  /**
   * @name /sync
   * 
   */

  router.use("*", async (req,res,next) => {
    if(req.headers.authorization){
      try{
        const user = await selectUser(req.headers.authorization);
        if(!user) return res.status(401).json({success : false})

        req.user = user;
        next()
      }catch{
        return res.status(401).json({success : false})
      }
    }else
    return res.status(401).json({ success : false})
  })

   router.get('/sync' , async (req,res,next)  => {

    if(req.headers.authorization){
      try{
        const user = await selectUser(req.headers.authorization);
        if(!user) return res.status(401).json({success : false})

        return res.status(200).json({success: true,defaultlocale,availableslang : getAllLang() , data : await syncFormat(user)})
      }catch(err){
        console.log(err)
        return res.status(401).json({success : false})
      }
      


    }else{
      return res.status(401).json({success : false})
    }

   })

   /**
    * @name /user/*
    * 
    */

    router.use('/user', userRouter)

    /**
     * @name /group/*
     */
    router.use('/group', GroupRouter)

    /**
     * @name /guild/*
     */
    router.use('/guild', GuildRouter)

    /**
     * @name /command/*
     */
    router.use('/command', CommandRouter)

    router.use('/lang', LangRouter)

export default router;