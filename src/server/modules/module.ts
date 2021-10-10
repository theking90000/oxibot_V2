import * as Discord from "discord.js";
import { Router } from "express";
import * as ModuleCache from "../cache/Module";
import { Modules } from "./ModuleManager";

type AdvancedSetting = {
  availables: {
    [key: string]: {
      default:
        | string
        | number
        | string[]
        | boolean
        | {
            availables: string[];
            selected: string;
          };
      type: "string" | "number" | "list" | "choice" | "boolean" | "role";
      meta?: {
        max?: number;
        min?: number;
        with_value?: {
          name: string;
          value;
        };
      };
    };
  };
  selected: {
    [key: string]: {
      value;
    };
  }[];
  max?: number;
  min?: number;
};

type setting = {
  [key: string]: {
    default:
      | string
      | number
      | string[]
      | boolean
      | AdvancedSetting
      | {
          availables: string[];
          selected: string;
        };
    type:
      | "string"
      | "number"
      | "list"
      | "choice"
      | "boolean"
      | "role"
      | "AdvancedSetting";
    meta?: {
      max?: number;
      min?: number;
    };
  };
};

type data_display = {
  key: string;
  expected?: "string" | "number";
  modifiable?: boolean;
};

type ModuleConstructor = {
  name: string;
  settings: setting;
  user_settings?: any;
  subscribe: (keyof EventListeners)[];
  routes?: (router: Router) => Router;
  data_display?: data_display[];
};

export interface EventListeners {
  message?: {
    data: Discord.Message;
  };
  join?: {
    data: Discord.GuildMember;
  };
  leave?: {
    data: Discord.GuildMember;
  };
}

export class Module {
  private name: string;
  private default_settings: setting;
  private data_display: data_display[] = [];
  private default_user_data;
  private subscribe: (keyof EventListeners)[] = [];
  public routes: (router: Router) => Router;

  public constructor(infos: ModuleConstructor) {
    this.name = infos.name;
    this.default_settings = infos.settings;
    this.subscribe = infos.subscribe;
    this.default_user_data = infos.user_settings;
    this.routes = infos.routes;
    this.data_display = infos.data_display || [];
  }

  public Execute(name: keyof EventListeners, serverID, event) {
    const e = { event: event, data: this.getData(serverID), name };
    this.onEvent(e);
  }

  public onEvent(e: { name: string; data: any }) {}

  public getData(guildID) {
    const guild = ModuleCache.getGuild(guildID);
    if (guild && guild.has(this.getName())) {
      return guild.get(this.getName()).data;
    }
    return;
  }

  public getSubscribed(): (keyof EventListeners)[] {
    return this.subscribe;
  }

  public isSubscribed(name: keyof EventListeners): boolean {
    return this.subscribe.includes(name);
  }

  public isActive(guildID): boolean {
    const guild = ModuleCache.getGuild(guildID);
    if (guild && guild.has(this.getName())) {
      return guild.get(this.getName()).toggled;
    }
    return;
  }

  public getRoutes(): Router {
    return this.routes(Router());
  }

  public getDefaultSettings() {
    const p = {};
    for (const setting in this.default_settings) {
      const s = this.default_settings[setting];
      const meta = s.meta;
      p[setting] = {
        value: s.default,
        type: s.type,
        meta,
      };
    }
    return p;
  }

  public getName() {
    return this.name;
  }

  public getUserData(guildID: string, userID: string) {
    const d = ModuleCache.getModuleData(guildID, userID, this.getName());
    return d ? d.data : {};
  }

  public setUserData(guildID: string, userID: string, data) {
    ModuleCache.setModuleData({
      guildID,
      userID,
      data,
      module: this.getName(),
    });
  }

  public getAllUserDataGuild(guildID: string) {
    const d = ModuleCache.getModuleDataGuild(guildID);
    const data = new Map<string, any>();
    if (!d) return data;
    for (const [user, u_data] of d) {
      if (u_data.has(this.name) && u_data.get(this.name).data) {
        data.set(user, u_data.get(this.name).data);
      }
    }
    return data;
  }
  public getAllUserData() {
    const guilds = new Map<string, Map<string, any>>();
    for (const guild of ModuleCache.ModulesData.keys()) {
      var data = new Map<string, any>();
      const g = ModuleCache.getModuleDataGuild(guild);
      for (const [u, user] of g) {
        if (user.has(this.name) && user.get(this.name).data) {
          data.set(u, user.get(this.name).data);
        }
      }
      guilds.set(guild, data);
    }
    return guilds;
  }

  public PostLoad() {}

  public getDisplayableData(guildID: string) {
    let d = [];
    try {
      const datas = this.getAllUserDataGuild(guildID);
      if (!datas) return d;
      for (const [id, userdata] of datas) {
        if (typeof userdata === "object") {
          let x = {},
            v = false;
          Object.keys(userdata).forEach((key) => {
            const f = this.data_display.find((k) => k.key === key);
            if (f) {
              if (
                typeof userdata[key] === "string" ||
                typeof userdata[key] === "number"
              ) {
                v = true;
                x[key] = {
                  value: userdata[key],
                  expected: f.expected,
                  modifiable: f.modifiable || false,
                };
              }
            }
          });
          if (v) d.push({ id, data: x });
        }
      }
      return d;
    } catch (e) {
      console.error(e);
      return d;
    }
  }
}

export const ExecuteEvent = async (
  name: keyof EventListeners,
  serverID,
  event
) => {
  for (const m of Modules) {
    if (m.isSubscribed(name) && m.isActive(serverID)) {
      m.Execute(name, serverID, event);
    }
  }
};

export const PostLoad = () => {
  for (const m of Modules) {
    m.PostLoad();
  }
};
