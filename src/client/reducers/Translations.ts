import { store } from "../app/app"
import Request_Helper from "../helper/request"

const Translations_IntialState = []

export const ACTIONS = {
  FETCH_ALL_DATA: "@Translations:FETCH_ALL_DATA",
  FETCH_GUILD: "@Translations:FETCH_GUILD",
  UPDATE_CHANNELS: "@Translations:UPDATE_CHANNELS",
  CREATE_REMOVE_LANGAGE: "@Translations:CREATE_REMOVE_LANGAGE",
  SET_CUSTOM_LANG_VALUE: "@Translations:SET_CUSTOM_LANG_VALUE",
  ADD_REMOVE_FORCEDCHANNELS: "@Translations:ADD_REMOVE_FORCEDCHANNELS"
}
const ACTIONS_ = {
  SET_DATA: "@Translations:SET_DATA"
}

const fetch_data = async (data_: "ALL" | string) => {
  const res = await Request_Helper({
    api: true,
    route: "sync/customlangs",
    method: "GET",
    response: "json",
    query: [{
      key: "type",
      value: data_,
    }]
  }) as any
  if (res.success)
    store.dispatch({ type: ACTIONS_.SET_DATA, payload: { data: res.data, guild: data_ } })
}

export const update_channels = async (type, data: { ServerID, channel, code }) => {
  await Request_Helper({
    data: JSON.stringify({
      guild: data.ServerID,
      channels: data.channel,
      langcode: data.code
    }),
    api: true,
    route: "lang/channels",
    method: "PUT",
    response: "json",
  })

  return { type: ACTIONS.UPDATE_CHANNELS, payload: { ...data, type } }
}

export const create_remove_langage = async (payload_: {
  action: "CREATE" | 'DELETE', ServerID: string,
  name: string,
  code: string,
  template?: string,
}) => {

  const res = await Request_Helper({
    data: JSON.stringify({
      guild: payload_.ServerID,
      langname: payload_.name,
      langcode: payload_.code,
      action: payload_.action,
    }),
    api: true,
    route: "lang",
    method: "POST",
    response: "json",
  }) as any

  if (!res.success || (payload_.action === "CREATE" && !res.translations)) {
    return { type: "null", payload: {} }
  }

  return { type: ACTIONS.CREATE_REMOVE_LANGAGE, payload: { ...payload_, translations: res.translations, } }

}

export const set_custom_lang_value = async (payload: {
  ServerID: string,
  code: string,
  key: string,
  value: string,
}) => {
  const res = await Request_Helper({
    data: JSON.stringify({
      guild: payload.ServerID,
      langcode: payload.code,
      key: payload.key,
      value: payload.value,
    }),
    api: true,
    route: "lang",
    method: "PUT",
    response: "json",
  }) as any
  if (!res.success) {
    return { type: "null", payload: {} }
  }

  return { type: ACTIONS.SET_CUSTOM_LANG_VALUE, payload }
}

export const add_remove_forcedchannels = async (payload: {
  action: "ADD" | 'REMOVE', ServerID: string,
  code: string,
  channel: string,
}) => {

  const res = await Request_Helper({
    data: JSON.stringify({
      guild: payload.ServerID,
      langcode: payload.code,
      type: payload.action,
      channel: payload.channel,
    }),
    api: true,
    route: "lang/channels",
    method: "PUT",
    response: "json",
  }) as any

  if (!res.success) {
    return { type: "null", payload: {} }
  }

  return { type: ACTIONS.ADD_REMOVE_FORCEDCHANNELS, payload }

}

export default function (state = Translations_IntialState, action) {
  switch (action.type) {
    case ACTIONS.FETCH_GUILD: {
      fetch_data(action.payload.guild || "ALL")
    }
    case ACTIONS_.SET_DATA: {
      if (action.payload.data && action.payload.guild) {
        if (action.payload.guild === "ALL") {
          state = action.payload.data
          return state;
        }
        if (state.find(c => c.id === action.payload.guild)) {
          let t = state.find(c => c.id === action.payload.guild)
          t.data = action.payload.data
          return state;
        } else {
          return [...state, { id: action.payload.guild, translations: action.payload.data }]
        }
      }
    }
    case ACTIONS.UPDATE_CHANNELS: {
      if (action.payload.channel && action.payload.ServerID && action.payload.code) {
        const guild = state.find(c => c.id === action.payload.ServerID)
        if (guild && guild.find(c => c.code === action.payload.code)) {
          var _Translate = guild.find(c => c.code === action.payload.code)
          if (_Translate) {
            if (action.payload.type === "REMOVE") {
              _Translate.forcedChannels.filter(x => x !== action.payload.channel)
            }
            if (action.payload.type === "ADD") {
              _Translate = [..._Translate, action.payload.channel]
            }
          }
        }
      }
      return state;
    }

    case ACTIONS.CREATE_REMOVE_LANGAGE: {
      var _guild = state.find(x => x.id === action.payload.ServerID)
      if (action.payload.action === "CREATE") {
        if (_guild && action.payload.code && action.payload.name && !_guild.translations.find(c => c.code === action.payload.code)) {
          _guild.translations = [..._guild.translations, {
            code: action.payload.code,
            name: action.payload.name,
            translations: action.payload.translations
          }]
          console.dir(state)
        }
      }
      if (action.payload.action === "DELETE") {
        if (_guild && action.payload.code && _guild.translations.find(c => c.code === action.payload.code)) {
          _guild.translations = _guild.translations.filter(x => x.code !== action.payload.code);
        }
      }
      return state;
    }

    case ACTIONS.SET_CUSTOM_LANG_VALUE: {
      const _guild = state.find(x => x.id === action.payload.ServerID)
      if (_guild && action.payload.code && action.payload.key && action.payload.value) {
        const _t = _guild.translations.find(c => c.code === action.payload.code)
        if (_t && _t.translations[action.payload.key])
          _t.translations[action.payload.key] = action.payload.value
      }
      return state
    }
    case ACTIONS.ADD_REMOVE_FORCEDCHANNELS: {
      const _guild = state.find(x => x.id === action.payload.ServerID)
      const _t = _guild.translations.find(c => c.code === action.payload.code)
      if (_t) {
        if (action.payload.action === "REMOVE") {
          _t.forcedChannels.filter(x => x !== action.payload.channel)
        }
        if (action.payload.action === "ADD") {
          _t.forcedChannels = [..._t.forcedChannels, action.payload.channel]
        }
      }
      return state;
    }

    default: {
      return state
    }
  }
}