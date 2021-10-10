import { Message } from "discord.js";
import { ModulesData } from "../cache/Module";
import { ExecuteAction, GetActionsSettings } from "../utils/Actions";
import { Module } from "./module";

export default class level extends Module {
  public Guilds = new Map<string, ModuleGuild>();

  constructor() {
    super({
      name: "Level",
      subscribe: ["message"],
      settings: {
        Rewards: {
          type: "AdvancedSetting",
          default: {
            availables: {
              At: {
                type: "number",
                default: 1,
                meta: {
                  min: 1,
                },
              },
              ...GetActionsSettings(),
            },
            selected: [],
          },
        },
        Cooldown: {
          type: "number",
          meta: {
            min: 0,
          },
          default: 60,
        },
        "Max-Xp": {
          type: "number",
          default: 25,
          meta: {
            min: 1,
          },
        },
        "Min-Xp": {
          type: "number",
          default: 10,
          meta: {
            min: 1,
          },
        },
      },
      data_display: [
        {
          key: "xp",
          expected: "number",
          modifiable: true,
        },
        {
          key: "level",
        },
      ],
    });
  }

  public onEvent(e) {
    if (e.name === "message") {
      const event = e.event as Message;
      if (event.author.bot) return;

      const data = this.getData(event.guild.id);
      if (!this.Guilds.has(event.guild.id)) this.createGuild(event.guild.id);

      const guild = this.Guilds.get(event.guild.id);

      if (data.Cooldown.value !== guild.cooldown)
        guild.cooldown = data.Cooldown.value;

      guild.addXP(event.author.id, (new_level) => {
        try {
          const actions = data.Rewards.value.selected.filter(
            (r) => r.At === new_level
          );
          for (const action of actions) {
            ExecuteAction(
              {
                type: action["Action"].selected,
                data: action,
                meta: {
                  replace: [
                    {
                      replace: "user",
                      value: `<@${event.author.id}>`,
                    },
                    {
                      replace: "level",
                      value: new_level.toString(),
                    },
                  ],
                },
              },
              {
                guild: event.guild,
                user: event.author,
              }
            );
          }
        } catch {}
      });
    }
  }

  public createGuild(id) {
    const d = this.getData(id);
    if (d)
      this.Guilds.set(
        id,
        new ModuleGuild(
          id,
          d?.Cooldown?.value || 60,
          {
            max: d["Max-Xp"]?.value || 25,
            min: d["Min-Xp"]?.value || 10,
          },
          (members) => {
            members.forEach((member) =>
              this.setUserData(id, member.id, {
                xp: member.xp,
                level: member.level,
              })
            );
          }
        )
      );
  }

  public PostLoad() {
    for (const [gID, g] of this.getAllUserData()) {
      if (!this.Guilds.has(gID)) this.createGuild(gID);
      for (const [uID, u] of g) {
        this.Guilds.get(gID).addMembers(uID, u.xp || 0, u.level || 1);
      }
    }
  }
}

interface xp_obj {
  xp: number;
  cooldown: number;
  id: string;
  level: number;
}

class ModuleGuild {
  public members = new Map<string, xp_obj>();
  public id: number;
  public cooldown: number;
  public xp: { max: number; min: number };
  public onSave: (members: xp_obj[]) => void;

  constructor(
    id,
    cooldown,
    xp: { max: number; min: number },
    onSave?: (members: xp_obj[]) => void
  ) {
    this.id = id;
    this.cooldown = cooldown;
    this.xp = xp;
    if (onSave) this.onSave = onSave;
    setInterval(() => {
      if (this.onSave) this.onSave(Array.from(this.members.values()));
    }, 100000);
  }

  public isInCoolDown(member): boolean {
    if (
      this.members.has(member) &&
      this.members.get(member).cooldown >= Date.now() / 1000
    )
      return true;

    return false;
  }

  public setCoolDown(member) {
    if (!this.members.has(member)) return this.addMembers(member, 0, 0);
    const member_ = this.members.get(member);
    member_.cooldown = this.getCoolDown();
  }

  public getCoolDown() {
    return Math.floor(Date.now() / 1000) + this.cooldown;
  }

  public addMembers(member, xp: number = 0, level = 1) {
    this.members.set(member, {
      cooldown: 0,
      xp,
      id: member,
      level,
    });
  }

  public setOnsave(s: (members: xp_obj[]) => void) {
    this.onSave = s;
  }

  public hasMember(id) {
    return this.members.has(id);
  }

  public getXpNeeded(level) {
    return level * level * 100;
  }

  public addXP(id, l?: (level: number) => void) {
    if (!this.hasMember(id)) this.addMembers(id, 0);
    if (!this.isInCoolDown(id)) {
      const m = this.members.get(id);
      m.xp += Math.floor(
        Math.random() * (this.xp.max - this.xp.min + 1) + this.xp.min
      );
      if (this.getXpNeeded(m.level) <= m.xp) {
        m.level++;
        if (l) l(m.level);
      }
    }
  }
}
