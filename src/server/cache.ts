import * as path from "path";
import { readdirSync } from "fs";
 
const cache = new Map<string,any>();

export const register_cache = () => {

    const commandsFile = readdirSync(path.join(__dirname , 'cache')).filter(file => file.endsWith('.js'));

    for(const file of commandsFile) {
        const command = require(path.join(__dirname , 'cache' ,  file));
        cache.set(file, command);
    }

    return cache;
}

export default cache;
