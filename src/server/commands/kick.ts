import { GuildMember } from "discord.js";
import { selectUser } from "../cache/user";
import { commandType } from "../commands";
import { getUser } from "../permissions";
import embed from "../utils/embed";

const command: commandType = {
  name: "kick",
  settings: {
    canBeDisabled: true,
    canHasAliases: true,
    Aliases: ["k"],
    data: {
      DefaultTempKick: {
        type: "boolean",
        value: false,
      },
      TempKickTime: {
        type: "string",
        value: "1d",
      },
      DefaultReasonKick: {
        type: "string",
        value: "You are kicked !",
      },
      DmMembers: {
        type: "boolean",
        value: true,
      },
    },
  },
  execute: async (message) => {
    if (!message.args[0] && message.userPerm.hasPermission("command.kick")) {
      await message.channel.send(
        embed({
          name: message.lang.t("KickCommandEmbedDefaultTitle"),
          guildid: message.guild.id,
          fields: [
            {
              val1: message.lang.t("KickCommandEmbedDefaultKick", {
                prefix: message.prefix,
              }),
              val2: message.lang.t("KickCommandEmbedDefaultKickDescription", {
                permission: "command.kick.user",
              }),
            },
          ],
        }).getEmbed()
      );
    }

    if (
      message.args[0] &&
      message.userPerm.hasPermission("command.kick.user")
    ) {
      const mentions = message.mentions.members.array();

      const users: GuildMember[] = mentions;
      let raison = "",
        dm: boolean = message.data.DmMembers.value;

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
        } else if (arg === "--nodm") {
          dm = false;
        } else {
          raison += arg + " ";
        }
      }

      if (users.length < 1) {
        await message.channel.send(
          embed({
            name: message.lang.t("CommandKickEmbedErrorTitle"),
            guildid: message.guild.id,
            fields: [
              {
                val1: message.lang.t("CommandKickEmbedError"),
                val2: message.lang.t("CommandKickErrorNoMentions"),
              },
            ],
          }).getEmbed()
        );
        return;
      }

      const ResumeEmbed = embed({
        guildid: message.guild.id,
        name: message.lang.t("CommandKickEmbedResumeTitle"),
      });

      let errmsg = {
        val1: message.lang.t("CommandKickErrorCantBeKick"),
        val2: "",
      };
      let successmsg = {
        val1: message.lang.t("CommandKickSuccess"),
        val2: "",
      };
      for (const user of users) {
        if (
          user.kickable &&
          !getUser({
            guildID: message.guild.id,
            userID: user.id,
          }).hasPermission("kick.bypass")
        ) {
          successmsg = {
            ...successmsg,
            val2: (successmsg.val2 += message.lang.t(
              "CommandKickSuccessFormat",
              {
                user: `<@${user.id}>`,
                tag: user.user.tag,
              }
            )),
          };
          if (dm)
            user.send(
              embed({
                guildid: message.guild.id,
                name: message.lang.t("KickDmEmbedTitle"),
              }).getEmbed()
            );
          user.kick(`${user.user.tag} : ${raison}`);
        } else {
          errmsg = {
            ...errmsg,
            val2:
              errmsg.val2 +
              message.lang.t("CommandKickErrorCantBeKickFormat", {
                user: `<@${user.id}>`,
                tag: user.user.tag,
              }),
          };
        }
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
  },
};

export default command;
