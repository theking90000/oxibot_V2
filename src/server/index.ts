import { Client } from "discord.js";
import {  token,mongodb } from "../../config.js";
import { register_commands } from "./commands";
import { register_event } from "./event";
import { register_cache } from "./cache";
import { connectdb } from "./database/database";
import { blueBright } from "chalk"
import web from "./web/app";

const client = new Client();

(async () => {
    await connectdb({
        database : mongodb.database,
        host : mongodb.host,
        password : mongodb.password,
        user : mongodb.user,
    });
    console.log(blueBright(`Connecté a la base de données ! (${mongodb.host})`));
})().then(() => {

    

    client.login(token)

    register_commands();
    register_cache();
    register_event();

    web()

})

export default client;

