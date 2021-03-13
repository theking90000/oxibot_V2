import { commandType } from "../commands"
import { getUser } from "../permissions"
import * as guildsCache from "../cache/guilds"

const command : commandType = {
    name : `test`,

    execute : async (message) => {

        
        let u = getUser({ guildID : message.guild.id,userID : message.author.id })
      //  message.channel.send(u.permissions)
        u.hasPermission('test.ok');
      message.channel.send(message.prefix)
        if(!guildsCache.hasGuild(message.guild.id)){
          guildsCache.CreateGuild(guildsCache.DefaultGuild(message.guild.id));
      }

    }
}





export default command;