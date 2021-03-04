import * as express from "express";
import { checkToken } from "./discord"
import auth from "./format/auth"
import syncFormat from "./helper/sync"
import { randomBytes } from "crypto"
import * as bodyParser from "body-parser";
import { addUserWeb,selectUser } from "../../cache/userweb"
import userRouter from "./user"

const router = express.Router();

router.use(bodyParser.json())

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

      const token = randomBytes(64).toString('base64')

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
    }
    return res.status(400).json({success : false})
  })

  /**
   * @name /sync
   * 
   */

  router.use("*", (req,res,next) => {
    if(req.headers.authorization){
      try{
        const user = selectUser(req.headers.authorization);
        if(!user) return res.status(401).json({success : false})

        req.user = user;
        next()
      }catch{
        return res.status(401).json({success : false})
      }
    }
  })

   router.get('/sync' , async (req,res,next)  => {

    if(req.headers.authorization){
      try{
        const user = selectUser(req.headers.authorization);
        if(!user) return res.status(401).json({success : false})

        return res.status(200).json({success: true, data : await syncFormat(user)})
      }catch{
        return res.status(401).json({success : false})
      }
      


    }

   })

   /**
    * @name /user/*
    * 
    */

    router.use('/user', userRouter)

export default router;