import { store } from "../app/app";
import Request_Helper from "../helper/request";

const Channel_IntialState = [];

export const ACTIONS = {
  FETCH_ALL_DATA: "@Channels:FETCH_ALL_DATA",
  FETCH_GUILD: "@Channels:FETCH_GUILD",
};
const ACTIONS_ = {
  SET_DATA: "@Channels:SET_DATA",
};

const request_pending = [];

export const fetch_data = async (data_: "ALL" | string) => {
  if (request_pending.includes(data_)) return;
  request_pending.push(data_);
  const res = (await Request_Helper({
    api: true,
    route: "sync/channels",
    method: "GET",
    response: "json",
    query: [
      {
        key: "type",
        value: data_,
      },
    ],
  })) as any;
  if (res.success)
    store.dispatch({
      type: ACTIONS_.SET_DATA,
      payload: { data: res.data, guild: data_ },
    });
};

export default function Channels(state = Channel_IntialState, action) {
  switch (action.type) {
    case ACTIONS.FETCH_GUILD: {
      if (action.payload.guild) {
        fetch_data(action.payload.guild);
      } else {
        fetch_data("ALL");
      }
    }
    case ACTIONS_.SET_DATA: {
      if (action.payload.data && action.payload.guild) {
        if (action.payload.guild === "ALL") {
          state = action.payload.data;
          return state;
        }
        if (state.find((c) => c.id === action.payload.guild)) {
          let t = state.find((c) => c.id === action.payload.guild);
          t.data = action.payload.data;
          return state;
        } else {
          return [
            ...state,
            { id: action.payload.guild, channels: action.payload.data },
          ];
        }
      }
    }
    default: {
      return state;
    }
  }
}
