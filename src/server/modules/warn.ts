import { ExecuteAction, GetActionsSettings } from "../utils/Actions";
import { Module } from "./module";

export interface warn {
  id: string;
  time: number;
  reason: string;
  from: string;
}

export default class Warn extends Module {
  constructor() {
    super({
      name: "Warn",
      subscribe: [],
      settings: {
        Punishements: {
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
      },
    });
  }

  public onEvent(event) {}

  public getWarns(
    guild: string,
    user: string
  ): { counter: number; warns: warn[] } {
    const d = this.getUserData(guild, user) as any;
    return d.warns ? d : this.getWarnObject();
  }

  public addWarn(guild: string, user: string, warn: warn) {
    const warns = this.getWarns(guild, user);
    warns.warns.push(warn);
    warns.counter++;
    this.setUserData(guild, user, warns);

    this.onWarn(warns);

    /**
     * Handle Actions ....
     *
     */
    try {
      const data = this.getData(guild);
      const p = data.Punishements.value.selected.filter(
        (x) => x.At === warns.counter
      );

      for (const action of p) {
        ExecuteAction(
          {
            type: action["Action"].selected,
            data: action,
            meta: {
              replace: [
                {
                  replace: "user",
                  value: `<@${user}>`,
                },
                {
                  replace: "counter",
                  value: warns.counter.toString(),
                },
              ],
            },
          },
          {
            guild: guild,
            user: user,
          }
        );
      }
    } catch {}
  }

  public getServer(serverid: string) {
    return {
      getWarns: (user: string) => this.getWarns(serverid, user),
      addWarn: (user: string, warn: warn) => this.addWarn(serverid, user, warn),
    };
  }

  public removeWarn(guild: string, user: string, warn: warn) {
    const warns = this.getWarns(guild, user);
    warns.warns = warns.warns.filter(
      (x) => JSON.stringify(x) !== JSON.stringify(warn)
    );
    this.setUserData(guild, user, warns);
  }

  private getWarnObject(): { counter: number; warns: warn[] } {
    return {
      counter: 0,
      warns: [],
    };
  }

  public onWarn(w: { counter: number; warns: warn[] }) {}
}
