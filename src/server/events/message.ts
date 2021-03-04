import client from "../index";
import {prefix} from "../../../config"
import commands from "../commands"
import { permissionuser,getUser } from "../permissions"
import {  Message } from "discord.js";

export interface message_ extends Message {
    userPerm? :  permissionuser,
    args? : string[],
    prefix? : string,
} 



client.on('message',(message) => {
    if(!message.content.startsWith(prefix) || message.author.bot || message.channel.type == "dm") return;

    const args = message.content.slice(prefix.length).split(' ');
    const command_ = args.shift().toLowerCase();

    var msg : message_;
    msg = message
    msg.args = args;
    msg.userPerm = getUser({userID : message.author.id,guildID : message.guild.id})
    msg.prefix = prefix;

    if(commands.has(command_)){
        commands.get(command_).execute(msg)
    }
})