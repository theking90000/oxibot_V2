import { channel } from "./sync";

export const channelsRoute = (req,res) => {
    
    if((req.query.type as string).toLowerCase() === "all"){
        const t : {id : string,channels : channel[]}[] = [];
       for(const [id,guild] of req.user.guilds){
         if(guild.permission.hasPermission("panel.channels.see")){
          t.push({
            id : id,
            channels : guild.Guild.channels.cache.map(c => ({
              id : c.id,
              name : c.name,
              type : c.type,
            }))
          })
         }
       }
       return res.status(200).json({success : true, data : t})
      }else if (req.user.guilds.has(req.query.type as string) 
      && req.user.guilds.get(req.query.type as string).permission.hasPermission("panel.channels.see")) {
        return res.status(200).json({success : true , data : req.user.guilds.get(req.query.type as string).Guild.channels.cache.map(c => ({
          id : c.id,
          name : c.name,
          type : c.type,
        }))})
      }
      else{
        return res.status(400).json({success : false})
      }
}