import * as path from "path";
import { readdirSync } from "fs";
 
const events = new Map<string,any>();

export const register_event = () => {

    const commandsFile = readdirSync(path.join(__dirname , 'events')).filter(file => file.endsWith('.js'));

    for(const file of commandsFile) {
        const command = require(path.join(__dirname , 'events' ,  file));
        events.set(file, command);
    }

    return events;
}

export default events;
