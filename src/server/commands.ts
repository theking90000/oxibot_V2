import * as path from "path";
import { Message } from "discord.js";
import { readdirSync } from "fs";
import { message_ } from "./events/message";
 
const commands = new Map<string,commandType>();

export const register_commands = () => {

    const commandsFile = readdirSync(path.join(__dirname , 'commands')).filter(file => file.endsWith('.js'));

    for(const file of commandsFile) {
        const command = require(path.join(__dirname , 'commands' ,  file));
        if(command.default.name && command.default.execute)
        commands.set(command.default.name, command.default);
    }

    return commands;
}

export default commands;

export type commandType = {

    name : string,
    execute : (message : message_) => void,

}