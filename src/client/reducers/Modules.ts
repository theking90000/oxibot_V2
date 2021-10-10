import { store } from "../app/app";
import Request_Helper from "../helper/request";

export const ACTIONS = {
  SET_MODULE_DATA: "@Modules:SET_MODULE_DATA",
  UPDATE_DATA: "@Modules:UPDATE_DATA",
  SET_ENABLED: "@Modules:SET_ENABLED",
  SET_MODULE_USER_DATA: "@Modules:SET_MODULE_USER_DATA",
};
const request_pending = new Map<string, string[]>();
export const fetch_data = async (payload: { guild: string; name: string }) => {
  if (
    request_pending.has(payload.guild) &&
    request_pending.get(payload.guild).includes(payload.name)
  )
    return;
  request_pending.set(payload.guild, [
    ...(request_pending.get(payload.guild) || []),
    payload.name,
  ]);
  const res = (await Request_Helper({
    api: true,
    route: "sync/modules",
    query: [
      {
        key: "type",
        value: payload.guild,
      },
      {
        key: "module",
        value: payload.name,
      },
    ],
    method: "GET",
    response: "json",
  })) as any;
  if (res.success) {
    request_pending.get(payload.guild).filter((c) => c !== payload.name);
    return store.dispatch({
      type: ACTIONS.SET_MODULE_DATA,
      payload: { name: payload.name, guild: payload.guild, data: res.data },
    });
  }
};

export const fetch_user_data = async (payload: {
  guild: string;
  name: string;
}) => {
  const res = (await Request_Helper({
    api: true,
    route: "modules/data",
    query: [
      {
        key: "type",
        value: payload.guild,
      },
      {
        key: "module",
        value: payload.name,
      },
    ],
    method: "GET",
    response: "json",
  })) as any;
  if (res.success) {
    return store.dispatch({
      type: ACTIONS.SET_MODULE_USER_DATA,
      payload: { name: payload.name, guild: payload.guild, data: res.data },
    });
  }
};

export const update_data = async (payload: {
  value: any;
  type: string;
  guild: string;
  path: string;
  name: string;
}) => {
  const res = (await Request_Helper({
    api: true,
    route: "modules",
    method: "PUT",
    response: "json",
    data: JSON.stringify({
      ...payload,
    }),
  })) as any;
  if (res.success) {
    store.dispatch({ type: ACTIONS.UPDATE_DATA, payload });
    return true;
  }
  return false;
};

export const SetModuleEnabled = async (obj: {
  ServerID: string;
  value: boolean;
  name: string;
}) => {
  await Request_Helper({
    data: JSON.stringify({
      guild: obj.ServerID,
      name: obj.name,
      value: obj.value,
    }),
    api: true,
    route: "modules/enable",
    method: "PUT",
  });

  return { type: ACTIONS.SET_ENABLED, payload: obj };
};

export default function (state = [], action) {
  const createGuild = (id) => {
    if (!state.find((x) => x.id === id)) {
      state = [
        ...state,
        {
          id,
          modules: [],
        },
      ];
    }
  };

  switch (action.type) {
    case ACTIONS.SET_MODULE_DATA: {
      if (action.payload.guild && action.payload.data && action.payload.name) {
        if (!state.find((g) => g.id === action.payload.guild))
          createGuild(action.payload.guild);
        let guild = state.find((g) => g.id === action.payload.guild);
        state = state.filter((x) => x.id !== guild.id);
        state = [
          ...state,
          {
            id: guild.id,
            modules: [...guild.modules, action.payload.data],
          },
        ];
        return [...state];
      }
    }

    case ACTIONS.SET_ENABLED: {
      if (action.payload.guild && action.payload.value && action.payload.name) {
        let guild = state.find((g) => g.id === action.payload.guild);
        if (
          guild &&
          guild.modules.find((x) => x.name === action.payload.name)
        ) {
          const mod = guild.modules.find((x) => x.name === action.payload.name);
          mod.toggled = action.payload.value;
        }
      }
    }
    case ACTIONS.SET_MODULE_USER_DATA: {
      const _guild = state.find((x) => x.id === action.payload.guild);
      if (_guild) {
        const mod = _guild.modules.find((c) => c.name === action.payload.name);
        console.log("ez", action);
        if (mod) {
          mod.userdata = action.payload.data;
        }
      }
      return [...state];
    }

    case ACTIONS.UPDATE_DATA: {
      const _guild = state.find((x) => x.id === action.payload.guild);
      if (_guild) {
        const set = _guild.modules.find((c) => c.name === action.payload.name);
        console.log(set);
        if (
          set &&
          set.data[action.payload.path] &&
          set.data[action.payload.path].value.selected
        ) {
          set.data[action.payload.path].value.selected = action.payload.value;
        } else if (set && set.data[action.payload.path]) {
          set.data[action.payload.path].value = action.payload.value;
        }
        console.log(set);
      }
    }

    default: {
      return state;
    }
  }
}
