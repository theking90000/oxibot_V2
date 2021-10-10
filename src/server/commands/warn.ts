import { warn } from "./../modules/warn";
import { getUser } from "./../permissions";
import { GuildMember } from "discord.js";
import { commandType } from "../commands";
import { getModule, Modules } from "../modules/ModuleManager";
import embed from "../utils/embed";
import Warn from "../modules/warn";
import { registerEvent } from "../events/reaction";

const Emojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

const removeEmoji = "❌";

const command: commandType = {
  name: "warn",
  settings: {
    Aliases: ["w"],
    canHasAliases: true,
    canBeDisabled: true,
    data: {},
  },
  execute: async (message) => {
    const warnInstance = getModule("Warn") as Warn;

    if (warnInstance.isActive(message.guild.id)) {
      switch (message.args[0]) {
        case "list": {
          if (message.args.length > 1) {
            const user = message.mentions.members.first();
            if (user && !user.user.bot) {
              const em = embed({
                guildid: message.guild.id,
                name: message.lang.t("WarnListTitle"),
              });
              const warns = warnInstance.getWarns(message.guild.id, user.id);
              const genWarns = (warns: warn[]) => {
                let f = [],
                  i = 0;
                for (const warn of warns) {
                  f.push({
                    val1: message.lang.t("WarnListFormatId", {
                      emoji: Emojis[i],
                      id: i,
                    }),
                    val2: message.lang.t("WarnListFormatDesc", {
                      author: `<@${warn.from}>`,
                      reason: warn.reason || message.lang.t("WarnNoReason"),
                      time: new Date(warn.time).toDateString(),
                    }),
                    inline: true,
                  });
                  i++;
                }
                return f;
              };
              em.addFields(genWarns(warns.warns));
              const Emessage = await message.channel.send(em.getEmbed());
              warns.warns.forEach((v, index) => {
                Emessage.react(Emojis[index]);
              });
              Emessage.react(removeEmoji);
              registerEvent(Emessage.id, (e) => {
                if (e.getUser().bot) return;
                if (
                  e.getReaction().name === removeEmoji &&
                  e.userHasPermission("command.warn.remove")
                ) {
                  Emessage.delete();
                  e.unRegister();
                }
                if (Emojis.includes(e.getReaction().name)) {
                  const warn = warns.warns.find(
                    (v, index) => index === Emojis.indexOf(e.getReaction().name)
                  );
                  if (warn && e.userHasPermission("command.warn.remove")) {
                    warnInstance.removeWarn(message.guild.id, user.id, warn);
                    if (Emessage.editable) {
                      em.clearFields();
                      let newW = warnInstance.getWarns(
                        message.guild.id,
                        user.id
                      ).warns;
                      em.addFields(genWarns(newW));
                      Emessage.edit(em.getEmbed());
                      warns.warns.forEach((w, index) => {
                        if (
                          !Emessage.reactions.cache.find(
                            (x) => x.emoji.name === Emojis[index]
                          )
                        ) {
                          Emessage.react(Emojis[index]);
                        }
                      });
                      e.cancel();
                    }
                  } else {
                    e.cancel();
                  }
                }
              });
            }
          }
          break;
        }

        default: {
          if (message.args.length >= 1) {
            if (message.userPerm.hasPermission("command.warn.add")) {
              const mentions = message.mentions.members.array();
              const users: GuildMember[] = mentions || [];
              var raison = "";
              for (var i = 0; i < message.args.length; i++) {
                const arg = message.args[i];
                if (arg.startsWith("<@") && arg.endsWith(">")) {
                  let mention = arg.slice(2, -1);
                  if (mention.startsWith("!")) mention = mention.slice(1);
                  const user = message.guild.members.cache.get(mention);
                  if (user && !users.includes(user)) users.push(user);
                } else if (arg.match(/[0-9]{18}/)) {
                  const user = message.guild.members.cache.get(arg);
                  if (user && !users.includes(user)) users.push(user);
                } else if (arg.match(/^((.{1,32})#\d{4})/)) {
                  const user = message.guild.members.cache.find(
                    (u) => u.user.tag === arg
                  );
                  if (user && !users.includes(user)) users.push(user);
                } else {
                  raison += arg + " ";
                }
              }
              if (users.length < 1) {
                await message.channel.send(
                  embed({
                    name: message.lang.t("EmbedErrorDefaultTitle"),
                    guildid: message.guild.id,
                    fields: [
                      {
                        val1: message.lang.t("WarnCommandEmbedErrorName"),
                        val2: message.lang.t("WarnCommandErrorNoMention"),
                      },
                    ],
                  }).getEmbed()
                );
                return;
              }
              const ResumeEmbed = embed({
                guildid: message.guild.id,
                name: message.lang.t("WarnEmbedTitle"),
              });
              let errmsg = {
                val1: message.lang.t("WarnError"),
                val2: "",
              };
              let successmsg = {
                val1: message.lang.t("WarnSuccess"),
                val2: "",
              };
              for (const user of users) {
                if (
                  !getUser({
                    guildID: message.guild.id,
                    userID: user.id,
                  }).hasPermission("warn.bypass")
                ) {
                  warnInstance.addWarn(message.guild.id, user.id, {
                    id: user.id,
                    from: message.author.id,
                    reason: raison,
                    time: Date.now(),
                  });

                  successmsg = {
                    ...successmsg,
                    val2: (successmsg.val2 += message.lang.t(
                      "WarnSuccessFormat",
                      {
                        user: `<@${user.id}>`,
                        tag: user.user.tag,
                      }
                    )),
                  };
                } else {
                  errmsg = {
                    ...errmsg,
                    val2:
                      errmsg.val2 +
                      message.lang.t("WarnErrorFormat", {
                        user: `<@${user.id}>`,
                        tag: user.user.tag,
                      }),
                  };
                }

                if (errmsg.val2 !== "") {
                  ResumeEmbed.addFields([errmsg]);
                }
                if (successmsg.val2 !== "") {
                  ResumeEmbed.addFields([successmsg]);
                }
                message.channel.send(ResumeEmbed.getEmbed());
                return;
              }
            }
          }
          if (message.userPerm.hasPermission("command.warn")) {
            message.channel.send(
              embed({
                guildid: message.guild.id,
                name: message.lang.t("WarnCommandEmbedDefaultTitle"),
                description: message.lang.t("WarnCommandEmbedDescription"),
                fields: [
                  {
                    val1: message.lang.t("WarnCommandEmbedWarn"),
                    val2: message.lang.t("WarnCommandEmbedWarnDescription", {
                      prefix: message.prefix,
                      permission: "message.warn.add",
                    }),
                  },
                  {
                    val1: message.lang.t("WarnCommandEmbedList"),
                    val2: message.lang.t("WarnCommandEmbedListDescription", {
                      prefix: message.prefix,
                      permission: "message.warn.list",
                    }),
                  },
                ],
              }).getEmbed()
            );
          }
        }
      }
    } else {
      if (message.userPerm.hasPermission("command.warn")) {
        message.channel.send(
          embed({
            guildid: message.guild.id,
            name: message.lang.t("EmbedErrorDefaultTitle"),
            fields: [
              {
                val1: message.lang.t("WarnCommandEmbedErrorName"),
                val2: message.lang.t("WarnCommandErrorModuleDisabled"),
              },
            ],
          }).getEmbed()
        );
      }
    }
  },
};

export default command;
