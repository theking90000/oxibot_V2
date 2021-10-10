import { store } from "../app/app";
import Request_Helper from "../helper/request";

export const ACTIONS = {
  SET_USER_DATA: "@Users:SET_USER_DATA",
  UPDATE_USER_GROUP: "@Users:UPDATE_USER_GROUP",
};
const request_pending = new Map<string, string[]>();

export const update_user_group = (obj: {
  type: "REMOVE" | "ADD";
  group: string;
  userID: string;
  ServerID: string;
}) => {
  return { type: ACTIONS.UPDATE_USER_GROUP, payload: obj };
};

export const fetch_data = async (payload: { guild: string; }) => {
  if ( request_pending.has(payload.guild))
    return;
  request_pending.set(payload.guild, null)
  const res = (await Request_Helper({
    api: true,
    route: "sync/users",
    query: [
      {
        key: "type",
        value: payload.guild,
      },
    ],
    method: "GET",
    response: "json",
  })) as any;
  if (res.success) {
    request_pending.delete(payload.guild)
    return store.dispatch({
      type: ACTIONS.SET_USER_DATA,
      payload:{ guild: payload.guild, data: res.data },
    });
  }
};

export default function (state = [], action) {
  switch (action.type) {
    case ACTIONS.SET_USER_DATA: {
      if (action.payload.guild && action.payload.data) {
        state = [
          ...state,
          {
            id: action.payload.guild,
            users: action.payload.data,
          },
        ];
      }
    }
    case ACTIONS.UPDATE_USER_GROUP: {
      state = state.map((guild) => {
        if (guild.id === action.payload.ServerID) {
          guild.users = guild.users.map((user) => {
            if (user.id === action.payload.userID) {
              if (action.payload.type === "ADD")
                user.groups.push(action.payload.group);
              if (
                action.payload.type === "REMOVE" &&
                user.groups.indexOf(action.payload.group) !== -1
              )
                user.groups.splice(
                  user.groups.indexOf(action.payload.group),
                  1
                );
            }

            return user;
          });
        }

        return guild;
      });
    }
    default: {
      return state;
    }
  }
}