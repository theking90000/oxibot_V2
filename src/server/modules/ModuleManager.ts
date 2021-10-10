import client from "../index";
import Captcha from "./captcha";
import level from "./level";
import { ExecuteEvent, Module, PostLoad } from "./module";
import Warn from "./warn";

export const Modules: Module[] = [];

export const initModules = () => {
  Modules.push(new Captcha(), new level(), new Warn());
};
initModules();

export function getModule(module: string) {
  return Modules.find((c) => c.getName() === module);
}
export function addEventListeners() {
  client.on("ready", () => PostLoad());
  client.on("guildMemberAdd", (member) =>
    ExecuteEvent("join", member.guild.id, member)
  );
  client.on("message", (message) => {
    if (message.channel.type !== "dm")
      ExecuteEvent("message", message.guild.id, message);
  });
  client.on("guildMemberRemove", (member) =>
    ExecuteEvent("leave", member.guild.id, member)
  );
}
