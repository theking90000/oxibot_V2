import { store } from "../app/app"
import Request_Helper from "../helper/request"

const Commands_IntialState = []

export const ACTIONS = {
    SET_GUILD_DATA: "@Commands:SET_GUILD_DATA",
    SET_COMMAND_DATA : "@Commands:SET_COMMAND_DATA",
    SET_ALL_DATA: "@Commands:SET_ALL_DATA",
    SET_COMMAND_SETTING: "@Commands:SET_COMMAND_SETTING",
    DISABLE_COMMAND : "@Commands:DISABLE_COMMAND",
    ADD_REMOVE_ALIASES : "@Commands:ADD_REMOVE_ALIASES"
}

export const fetch_data = async (type : "ALL"  | string, command? : string) => {
    
    const res = await Request_Helper({
        api: true,
        route: "sync/commands",
        query: [{
            key: "type",
            value : type,
        },
            (command) ?
                { key: "command", value: command} :
                { key: "", value: "" }],
        method: "GET",
        response: "json",
      }) as any

    if (res.success && res.data) {
        if (type === "ALL")
            return store.dispatch({ type: ACTIONS.SET_ALL_DATA, payload: res.data })
        if (command)
            return store.dispatch({ type: ACTIONS.SET_COMMAND_DATA, payload : { cmd: res.data.cmd, id: type }})
        
        return store.dispatch({ type: ACTIONS.SET_GUILD_DATA, payload: { cmds: res.data.cmds, id: type } })
    }
}

export const set_command_setting = async (payload : { ServerID : string,name : string,setting : string,value : any }) => {

    await Request_Helper({ 
      data : JSON.stringify({
      guild : payload.ServerID,
      setting : payload.setting,
      name : payload.name,
      value: payload.value,
      }),
      api : true,
      route : "command/data",
      method : "PUT",
      response : "json",
   })
  
   return {type: ACTIONS.SET_COMMAND_SETTING, payload}
  
  }
  
  export const SetCommandEnabled = async (obj : {ServerID : string,value : boolean,name : string}) => {
    await Request_Helper({
      data : JSON.stringify({
        guild : obj.ServerID,
        name : obj.name,
        value : obj.value,
      }),
      api : true,
      route : "command/enable",
      method : "PUT",
      response : "json",
    })
  
    return { type : ACTIONS.DISABLE_COMMAND,payload: obj}
  }

  export const AddRemoveCommandAliases = async (obj : {ServerID : string,data : string | string[],name : string,type : "REMOVE" | 'ADD'}) => {
    const req = await Request_Helper({
      data : JSON.stringify({
        guild : obj.ServerID,
        name : obj.name,
        type : obj.type,
        data : obj.data
      }),
      api : true,
      route : "command/aliases",
      method : "PUT",
      response : "json",
    })

    if(!req.success)
    return {type : "null" , payload : {}}
    
    return {type : ACTIONS.ADD_REMOVE_ALIASES, payload : obj}
  }

export default function (state = Commands_IntialState, action) {
    switch (action.type) {
        case ACTIONS.SET_GUILD_DATA: {
            if (action.payload && action.payload.cmds && action.payload.id) {
                state = state.filter(x => x.id !== action.payload.id)
                state = [...state, action.payload]
            }
        }
            
        case ACTIONS.SET_COMMAND_DATA: {
            if (action.payload && action.payload.cmd && action.payload.id) {
                const guild = state.find(x => x.id === action.payload.id)
                state = state.filter(x => x.id !== action.payload.id)
                if (!guild) {
                    state = [...state, {
                        id: action.payload.id,
                        cmds : [action.payload.cmd]
                    }]
                }
                else
                    state = [...state, {
                        id: guild.id,
                        cmds : [...guild.cmds, action.payload.cmd]
                    }]

            }
        }
            
        case ACTIONS.SET_ALL_DATA: {
            if (action.payload && action.payload.cmds) {
                state = action.payload.cmds
            }
        }

        case ACTIONS.DISABLE_COMMAND : {
            state = state.map(guild => {
              if(guild.id=== action.payload.ServerID){
                guild.cmds= guild.cmds.map(cmd => {
                  if(cmd.name === action.payload.name){
                    cmd.enabled = action.payload.value
                  }
                  console.log(action.payload.value)
                  return cmd
                })
              }
              return guild
            })
            return state;
          }
      
          case ACTIONS.SET_COMMAND_SETTING : {
            const _guild = state.find(x => x.id === action.payload.ServerID)
      
            if(_guild){
              const set =_guild.cmds.find(c=> c.name === action.payload.name);
              if(set && set.settings.settings.data[action.payload.setting]){
                set.settings.settings.data[action.payload.setting].value = action.payload.value
              }
            }
            return state
          }
          case ACTIONS.ADD_REMOVE_ALIASES : {
            if(action.payload.name && action.payload.data, action.payload.type){
            const _guild = state.find(x => x.id === action.payload.ServerID)
            if(_guild){
              const cmd = _guild.cmds.find(x => x.name === action.payload.name)
              if(cmd && action.payload.type === "ADD"){
                if(Array.isArray(action.payload.data)) cmd.settings.settings.Aliases = [...cmd.settings.settings.Aliases,...action.payload.data]
                else if (!cmd.settings.settings.Aliases.find(x => x === action.payload.data)) 
                cmd.settings.settings.Aliases.push(action.payload.data)
              }
              if(cmd && action.payload.type === "REMOVE"){
                cmd.settings.settings.Aliases = cmd.settings.settings.Aliases.filter(x => x !== action.payload.data)
              }
            }
          }
            return state
          }
            
        default: {
            return state;
        }
    }

}