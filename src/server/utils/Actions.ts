import { Guild, GuildMember, TextChannel, User } from "discord.js";
import client from "..";
import validtext from "./validtext";

type action = {
  [key in action_type]: {
    type: string;
    default;
    meta?;
    isInternal?: boolean;
  };
};

export const action_types = ["AddRoles", "RemoveRoles", "SendMessage"];
type action_type = typeof action_types[number];

export const ACTIONS: action = {
  AddRoles: {
    type: "role",
    default: [],
    meta: {
      with_value: {
        name: "Action",
        value: {
          selected: "AddRoles",
        },
      },
    },
  },
  RemoveRoles: {
    type: "role",
    default: [],
    meta: {
      with_value: {
        name: "Action",
        value: {
          selected: "RemoveRoles",
        },
      },
    },
  },
  SendMessage: {
    type: "choice",
    default: {
      availables: ["Dm", "Channel"],
      selected: "Channel",
    },
    meta: {
      with_value: {
        name: "Action",
        value: {
          selected: "SendMessage",
        },
      },
    },
  },
  SelectChannelSendMessage: {
    type: "channel",
    default: [],
    isInternal: true,
    meta: {
      max: 1,
      with_value: {
        name: "SendMessage",
        value: {
          selected: "Channel",
        },
      },
    },
  },
  MessageChannelSendMessage: {
    type: "string",
    default: "{{user}} est passé niveau **{{level}}** !",
    isInternal: true,
    meta: {
      with_value: {
        name: "SendMessage",
        value: {
          selected: "Channel",
        },
      },
    },
  },
  MessageDmSendMessage: {
    type: "string",
    default: "Tu a atteind le niveau **{{level}}** sur {{server}}!",
    isInternal: true,
    meta: {
      with_value: {
        name: "SendMessage",
        value: {
          selected: "Dm",
        },
      },
    },
  },
};

export function GetActionsSettings(custom?: {
  name?: string;
  disable?: action_type[];
}) {
  const obj = {};
  const __ = { type: "choice", default: { availables: [], selected: "" } };
  for (const a in ACTIONS) {
    if (a === "Action" || a === custom?.name) continue;
    if (custom?.disable && custom?.disable?.includes(a)) continue;
    if (!ACTIONS[a].isInternal) __.default.availables.push(a);

    if (ACTIONS[a]) {
      obj[a] = ACTIONS[a];
    }
  }
  const r = {};
  __.default.selected = __.default.availables[0];

  r[custom?.name || "Action"] = __;
  return { ...r, ...obj };
}

export async function ExecuteAction(
  action: {
    meta?: {
      replace?: {
        value: string;
        replace: string;
      }[];
    };
    type: action_type;
    data;
  },
  user: {
    guild?: Guild | string;
    user?: User | string;
  }
) {
  switch (action.type) {
    case "AddRoles": {
      const guild = getGuild(user.guild);
      const member = await getMember(guild, getUSER(user.user));
      if (guild && member) {
        if (action.data["AddRoles"] && Array.isArray(action.data["AddRoles"])) {
          for (const role_ of action.data["AddRoles"]) {
            const role = guild.roles.cache.get(role_);
            if (
              role &&
              role.editable &&
              member.manageable &&
              !member.roles.cache.has(role_)
            ) {
              try {
                await member.roles.add(role);
              } catch {}
            }
          }
        }
      }
    }
    case "SendMessage": {
      const guild = getGuild(user.guild);
      const member = await getMember(guild, getUSER(user.user));
      if (action.data["SendMessage"]?.selected) {
        if (action.data["SendMessage"].selected === "Channel") {
          if (
            action.data["SelectChannelSendMessage"] &&
            Array.isArray(action.data["SelectChannelSendMessage"])
          ) {
            for (const channel_ of action.data["SelectChannelSendMessage"]) {
              let channel = guild.channels.cache.get(channel_);
              if (
                channel &&
                channel.permissionsFor(guild.me).has("SEND_MESSAGES") &&
                channel.isText()
              ) {
                if (
                  action.data["MessageChannelSendMessage"] &&
                  typeof action.data["MessageChannelSendMessage"] === "string"
                ) {
                  try {
                    let message = validtext(
                      action.data["MessageChannelSendMessage"]
                    );
                    if (Array.isArray(action?.meta?.replace)) {
                      action.meta.replace.forEach((r) => {
                        message = message.replace(`{{${r.replace}}}`, r.value);
                      });
                    }
                    (channel as TextChannel).send(message);
                  } catch {}
                }
              }
            }
          }
        }
        if (
          action.data["SendMessage"].selected === "Dm" &&
          typeof action.data["MessageDmSendMessage"] === "string"
        ) {
          member
            .createDM()
            .then((channel) => {
              let message = validtext(action.data["MessageDmSendMessage"]);
              if (Array.isArray(action?.meta?.replace)) {
                action.meta.replace.forEach((r) => {
                  message = message.replace(`{{${r.replace}}}`, r.value);
                });
              }
              if (channel && channel.isText())
                channel.send(message).catch((err) => null);
            })
            .catch((err) => null);
        }
      }
    }
    case "RemoveRoles": {
      const guild = getGuild(user.guild);
      const member = await getMember(guild, getUSER(user.user));

      if (guild && member) {
        if (
          action.data["RemoveRoles"] &&
          Array.isArray(action.data["RemoveRoles"])
        ) {
          for (const role_ of action.data["RemoveRoles"]) {
            const role = guild.roles.cache.get(role_);
            if (
              role &&
              role.editable &&
              member.manageable &&
              member.roles.cache.has(role_)
            ) {
              try {
                await member.roles.remove(role);
              } catch {}
            }
          }
        }
      }
    }
    default: {
      return false;
    }
  }
}

export const getUSER = (user): User => {
  if (user instanceof User) return user;
  return client.users.cache.get(user);
};

export const getGuild = (guild): Guild => {
  if (guild instanceof Guild) return guild;
  return client.guilds.cache.get(guild);
};

export const getMember = async (
  guild: Guild,
  user: User
): Promise<GuildMember> => {
  if (guild && user) return await guild.members.fetch({ user });

  return null;
};
