import client from "../index";
import { yellowBright } from "chalk";

client.on('ready', () => {
    console.log(yellowBright(`Connecté a discord`))
})