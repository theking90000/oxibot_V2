import { GuildMember, MessageReaction, User } from "discord.js";
import client from "..";
import { getUser } from "../permissions";

class event {
  private nativeEvent: MessageReaction;
  private user: User;
  private id: number;
  constructor(m: MessageReaction, id: number, user: User) {
    this.nativeEvent = m;
    this.id = id;
    this.user = user;
  }
  public getNativeEvent() {
    return this.nativeEvent;
  }

  public getMessage() {
    return this.nativeEvent.message;
  }

  public unRegister() {
    unRegisterEvent(this.getMessage().id, this.id);
  }

  public cancel() {
    this.getNativeEvent().users.remove(this.user);
  }

  public getReaction() {
    return this.getNativeEvent().emoji;
  }

  public getUser() {
    return this.user;
  }

  public userHasPermission(perm: string) {
    return getUser({
      guildID: this.getMessage().guild.id,
      userID: this.getUser().id,
    }).hasPermission(perm);
  }
}

export const Handlers = new Map<string, Map<number, (e: event) => void>>();

client.on("messageReactionAdd", async (e, user) => {
  if (Handlers.has(e.message.id)) {
    const h = Handlers.get(e.message.id);
    for (const [id, Callback] of h) {
      Callback(new event(e, id, await user.fetch()));
    }
  }
});

export const registerEvent = (
  message: string,
  callback: (e: event) => void
) => {
  let id = 0;
  if (Handlers.has(message)) {
    const h = Handlers.get(message);
    id = h.size + 1;
    h.set(id, callback);
  } else {
    const map = new Map().set(id, callback);
    Handlers.set(message, map);
  }

  return id;
};

export const unRegisterEvent = (message: string, id: number) => {
  if (Handlers.has(message)) {
    const h = Handlers.get(message);
    if (h.has(id)) {
      h.delete(id);
    }
  }
};
