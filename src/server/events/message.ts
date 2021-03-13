import client from "../index";
import {prefix} from "../../../config"
import commands from "../commands"
import { permissionuser,getUser } from "../permissions"
import {  Message } from "discord.js";
import { getGuild } from "../cache/guilds";
import { IGuildDocument } from "../database/models/guild";

export interface message_ extends Message {
    userPerm? :  permissionuser,
    args? : string[],
    prefix? : string,
    guild_params? : IGuildDocument,
} 

const HandleGuildMessage = (message : Message) => {
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
            commands.get(command_).execute(msg)
        }
        catch{
            message.react('❌')
        }
    }
}

client.on('message',(message) => {

    if(message.channel.type === "dm" || message.author.bot) return
    HandleGuildMessage(message)
    
})