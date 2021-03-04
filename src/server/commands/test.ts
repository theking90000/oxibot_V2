import { commandType } from "../commands"
import { getUser } from "../permissions"


const command : commandType = {
    name : `test`,

    execute : async (message) => {

        
        let u = getUser({ guildID : message.guild.id,userID : message.author.id })
      //  message.channel.send(u.permissions)
        u.hasPermission('test.ok');


    }
}





export default command;