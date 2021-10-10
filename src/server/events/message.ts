import client from "../index";
import {prefix} from "../../../config"
import commands from "../commands"
import { permissionuser,getUser } from "../permissions"
import {  Message } from "discord.js";
import { getCommandData, getCommandsWithAliases, getGuild } from "../cache/guilds";
import { IGuildDocument } from "../database/models/guild";
import { getLangFromMessage, langobject } from "../utils/i18n"
import { selectUser } from "../cache/user";
import { ExecuteEvent } from "../modules/module";

export interface message_ extends Message {
    userPerm? :  permissionuser,
    args? : string[],
    prefix? : string,
    guild_params? : IGuildDocument,
    data?: any,
    lang?: langobject
} 

const HandleGuildMessage = async (message : Message) => {
    const guild = getGuild(message.guild.id)
    const prefix_  = guild ? guild.settings.server.prefix : prefix

    if(message.content.startsWith(prefix_)) {

    const args = message.content.slice(prefix_.length).split(' ');
    var command_ = args.shift().toLowerCase();
    const user = selectUser(message.guild.id, message.author.id)

    // Injection de props au message de base
    var msg: message_;
    msg = message
    msg.guild_params = guild;
    msg.args = args;
    msg.userPerm = getUser({userID : message.author.id,guildID : message.guild.id})
    msg.prefix = prefix_;
    msg.lang = await getLangFromMessage({
        channel: message.channel,
        guild,
        user: user ? user.user : null
    })

    // Check les aliases
    const aliases = commands.has(command_) ? null : getCommandsWithAliases(message.guild.id,command_)
    if(aliases){
        command_ = aliases
    }
    // Recherche la commande, récupère ses données et l'éxécute
    if(commands.has(command_)){
        try{
            const data = await getCommandData(message.guild.id,command_);
            if(data) msg.data = data.settings.settings.data;
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



}

client.on('message',(message) => {

    if(message.channel.type === "dm" || message.author.bot) return
    HandleGuildMessage(message)
    
})