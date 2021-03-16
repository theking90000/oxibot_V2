import client from "../index";
import {prefix} from "../../../config"
import commands from "../commands"
import { permissionuser,getUser } from "../permissions"
import {  Message } from "discord.js";
import { getCommandData, getGuild } from "../cache/guilds";
import { IGuildDocument } from "../database/models/guild";

export interface message_ extends Message {
    userPerm? :  permissionuser,
    args? : string[],
    prefix? : string,
    guild_params? : IGuildDocument,
    data? : any,
} 

const HandleGuildMessage = async (message : Message) => {
    const guild = getGuild(message.guild.id)
    const prefix_  = guild ? guild.settings.server.prefix : prefix

    if(!message.content.startsWith(prefix_)) return

    const args = message.content.slice(prefix_.length).split(' ');
    const command_ = args.shift().toLowerCase();

    var msg : message_;
    msg = message
    msg.guild_params = guild;
    msg.args = args;
    msg.userPerm = getUser({userID : message.author.id,guildID : message.guild.id})
    msg.prefix = prefix_;

    if(commands.has(command_)){
        try{
            const data = await getCommandData(message.guild.id,command_);
            if(data)msg.data = data.settings.settings.data;
            if(!data || data.enabled === true){
                commands.get(command_).execute(msg)
            }
            
        }
        catch(err){
            console.log(err)
            message.react('❌')
        }
    }
}

client.on('message',(message) => {

    if(message.channel.type === "dm" || message.author.bot) return
    HandleGuildMessage(message)
    
})