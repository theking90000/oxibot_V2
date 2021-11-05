import { Client } from "discord.js";
import { token, mongodb } from "../../config.js";
import { register_commands } from "./commands";
import { register_event } from "./event";
import { register_cache } from "./cache";
import { connectdb } from "./database/database";
import { blue, blueBright, red, redBright } from "chalk";
import web from "./web/app";
import { addEventListeners } from "./modules/ModuleManager";

export const version = "0.1";

const client = new Client({
  presence: {
    activities: [{
      name: "Oxibot_V2",
      type: "WATCHING",
    }],
  },
  intents : ['GUILDS','DIRECT_MESSAGES','GUILD_BANS','GUILD_INVITES','GUILD_MEMBERS','GUILD_MESSAGES','GUILD_PRESENCES','GUILD_VOICE_STATES',]
});

(async () => {
  await connectdb({
    ...mongodb,
  });
  console.log(blueBright(`Connecté a la base de données ! (${mongodb.host})`));
})().then(() => {
  client.login(token);
  client.on("debug", console.debug);
  register_commands();
  register_cache();
  register_event();
  addEventListeners();
  web();
});
process.title = `Oxibot_V2`;
process.on("uncaughtException", (err) => {
  console.log(
    redBright("Une erreur est survenue :") + red(err.message) + blue(err.stack)
  );
});
process.on("unhandledRejection", (err: any) => {
  console.log(
    redBright("Une erreur est survenue : ") + red(err) + blue(err.stack)
  );
});

export default client;
