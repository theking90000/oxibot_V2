import { Client } from "discord.js";
import {  token,mongodb } from "../../config.js";
import { register_commands } from "./commands";
import { register_event } from "./event";
import { register_cache } from "./cache";
import { connectdb } from "./database/database";
import { blue, blueBright, red, redBright } from "chalk"
import web from "./web/app";
import "./modules/ModuleManager";

export const version = "0.1";

const client = new Client({
    ws: { compress: true },
    shards: "auto",
});

(async () => {
    await connectdb({
        ...mongodb
    });
    console.log(blueBright(`Connecté a la base de données ! (${mongodb.host})`));
})().then(() => {

    client.login(token)

    register_commands();
    register_cache();
    register_event();

    web()

})
process.title = `Oxibot_V2`;
process.on('uncaughtException', (err) => {
    console.log(redBright("Une erreur est survenue :") + red(err.message) + blue(err.stack))
})
process.on('unhandledRejection', (err: any) => {
    console.log(redBright("Une erreur est survenue : ") + red(err) + blue(err.stack))
})

export default client;

