import { Guild, User } from "discord.js";
import client from "../index";


export const parsePlaceHolder = (val : 
    { 
    text : string,
    guildID? : string,
    guild? : Guild,
    userID? : string,
    user? : User, 
}) : string => {

    const guild = val.guild || client.guilds.cache.get(val.guildID);

    const user = val.user || client.users.cache.get(val.userID);

    var text = val.text;

    const matches = text.match(/%\w*%/g)
    
    if(matches){
        for(const key of matches) {
            if(PLACEHOLDERS[key.replace(/\%/g,'')]){
                text = text.replace(key , PLACEHOLDERS[key.replace(/\%/g,'')]({ guild,user }))
            }
        }
    }

    
    
    return text;
}

type g = {
    user? : User,
    guild? : Guild
}

export const PLACEHOLDERS = {
        "servername" : (c : g) => c.guild ? c.guild.name : "",
        "username" : (c : g) => c.user ? c.user.username : "",
        "server_members_count" : (c : g) => c.guild ? c.guild.memberCount : "",
        "server_users_count" : (c : g) =>  c.guild ? c.guild.members.cache.filter(c => !c.user.bot).size : "",
        "nickname" : (c : g) => (c.guild && c.user) ? c.guild.members.cache.get(c.user.id).nickname : "",
        "date" : (c : g) => new Date(Date.now()).toLocaleDateString(),
        "ram_used" : (c : g) => `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        "ping_ms" : (c : g) => `${Math.round(client.ws.ping)} ms`,
        "ping" : (c : g) => Math.round(client.ws.ping),
        "uptime" : (c : g) => toHHMMSS(process.uptime())
    }

function toHHMMSS(str) {
    var sec_num = parseInt(str, 10); // don't forget the second param
    var hours :any  = Math.floor(sec_num / 3600);
    var minutes:any = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds:any = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}