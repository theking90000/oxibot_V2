import { syncObjD } from "../../server/web/api/helper/sync"
import Request_Helper from "../helper/request"

const SyncManager_initialState : syncObjD= {
    userinfo : {
      avatar : null,
      avatarURl : null,
      discriminator : null,
      id : null,
      tag : null,
      username : null,
    },
    guilds : [],
}

export const update_user_group = (obj : { type : 'REMOVE' | 'ADD', group : string, userID : string,ServerID : string}) => {
  return { type : ACTIONS.UPDATE_USER_GROUP , payload : obj}
}

export const update_group_permission = (obj : { type : 'REMOVE' | 'ADD', group : string, permission : string,ServerID : string}) => {

}

export const CreateGroup = async (obj : { group : string,ServerID : string }) => {
  await Request_Helper({ 
    data : JSON.stringify({
     guild : obj.ServerID,
      group : obj.group,
      action : "CREATE",
    }),
    api : true,
    route : "group",
    method : "POST",
    response : "json",
 })

  return { type : ACTIONS.CREATE_GROUP,payload : obj }
}

export const DeleteGroup = async (obj : { group : string,ServerID : string }) => {
  await Request_Helper({ 
    data : JSON.stringify({
     guild : obj.ServerID,
      group : obj.group,
      action : "DELETE",
    }),
    api : true,
    route : "group",
    method : "POST",
    response : "json",
 })

 return { type : ACTIONS.DELETE_GROUP,payload : obj }
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

export const update_settings_value = async (payload : { ServerID : string,cat : string,name : string,value : any }) => {

  await Request_Helper({ 
    data : JSON.stringify({
    guild : payload.ServerID,
    cat : payload.cat,
    name : payload.name,
    value: payload.value,
    }),
    api : true,
    route : "guild/settings",
    method : "PUT",
    response : "json",
 })

 return {type : ACTIONS.UPDATE_SETTINGS_VALUE , payload}
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

export const ACTIONS = {
    REPLACE_DATA : "@SyncManager:REPLACE_DATA",
    UPDATE_USER_GROUP : "@SyncManager:UPDATE_USER_GROUP",
    UPDATE_GROUP_PERMISSION : "@SyncManager:UPDATE_GROUP_PERMISSION",
    CREATE_GROUP : "@SyncManager:CREATE_GROUP",
    DELETE_GROUP : "@SyncManager:DELETE_GROUP",
    UPDATE_SETTINGS_VALUE : "@SyncManager:UPDATE_SETTINGS_VALUE",
    DISABLE_COMMAND : "@SyncManager:DISABLE_COMMAND",
    SET_COMMAND_SETTING : "@SyncManager:SET_COMMAND_SETTING",
    CREATE_REMOVE_LANGAGE : "@SyncManager:CREATE_REMOVE_LANGAGE",
}

export const create_remove_langage = async (payload_ : {
  action : "CREATE" | 'DELETE',ServerID : string,
  name : string,
  code : string,
  template? : string,
}) => {

  const res = await Request_Helper({
    data : JSON.stringify({
      guild : payload_.ServerID,
      langname : payload_.name,
      langcode : payload_.code,
      action: payload_.action,
      }),
      api : true,
      route : "lang",
      method : "POST",
      response : "json",
  }) as any

  if(!res.success || (payload_.action === "CREATE" && !res.translations)){
    return {type : "null",payload : {}}
  }
  const payload = {...payload_, translations : res.translations}

  return {type : ACTIONS.CREATE_REMOVE_LANGAGE,payload}

}

export default function SyncManager(state = SyncManager_initialState, action) {
    switch (action.type) {
      case ACTIONS.REPLACE_DATA:{
        state = action.payload
        return action.payload; 
      }
      case ACTIONS.UPDATE_USER_GROUP : {
        
        state.guilds = state.guilds.map(guild => {
          if(guild.id === action.payload.ServerID){
            guild.members.users = guild.members.users.map(user => {
              if(user.id === action.payload.userID){
                if(action.payload.type === "ADD")
              user.groups.push(action.payload.group)
              if(action.payload.type === "REMOVE" && user.groups.indexOf(action.payload.group) !== -1)
              user.groups.splice(user.groups.indexOf(action.payload.group),1)
              }
              

              return user;
            })
          }
          
          return guild;
        })
      }

      case ACTIONS.UPDATE_GROUP_PERMISSION : {
        state.guilds = state.guilds.map(guild => {
          if(guild.id === action.payload.ServerID){
            guild.groups = guild.groups.map(group => {
              if(group.name === action.payload.group){
                if(action.payload.type === "ADD")
                  group.permission.push(action.payload.permission)
              if(action.payload.type === "REMOVE" && group.permission.indexOf(action.payload.grpermissionoup) !== -1)
              group.permission.splice(group.permission.indexOf(action.payload.permission),1)
              }
              

              return group;
            })
          }
          
          return guild;
        })
      }

      case ACTIONS.CREATE_GROUP : {
        const g = []
        state.guilds.forEach(guild => {
          if(guild.id === action.payload.ServerID){
            if(!guild.groups.find(v => v.name === action.payload.group)){
              guild.groups.push({ name : action.payload.group, permission : [] })
              console.log(guild)
            }
          }
          g.push(guild)
      })
      state.guilds = g;
      return state
    }

    case ACTIONS.DELETE_GROUP : {
      state.guilds = state.guilds.map(guild => {
        if(guild.id === action.payload.ServerID){
          guild.groups = guild.groups.filter(c => c.name !== action.payload.group);
        }
        return guild
    })
    return state
  }

    case ACTIONS.UPDATE_SETTINGS_VALUE : {
      state.guilds = state.guilds.map(guild => {
        if(guild.id === action.payload.ServerID){
          guild.settings = guild.settings.map(setting => {
            if(setting.name === action.payload.cat && setting.values[action.payload.name] !== undefined){
              setting.values[action.payload.name] = action.payload.value
            }
            return setting;
          })
        }
        return guild
    })
    }

    case ACTIONS.DISABLE_COMMAND : {
      state.guilds = state.guilds.map(guild => {
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
      const _guild = state.guilds.find(x => x.id === action.payload.ServerID)

      if(_guild){
        const set =_guild.cmds.find(c=> c.name === action.payload.name);
        if(set && set.settings.settings.data[action.payload.setting]){
          set.settings.settings.data[action.payload.setting].value = action.payload.value
        }
      }
      return state
    }
    case ACTIONS.CREATE_REMOVE_LANGAGE : {
      const _guild = state.guilds.find(x => x.id === action.payload.ServerID)
      if(action.payload.action === "CREATE"){
        if(_guild && action.payload.code && action.payload.name && !_guild.customslangs.find(c => c.code === action.payload.code)){
          _guild.customslangs.push({
            code : action.payload.code,
            name : action.payload.name,
            translations : action.payload.translations
          })
        }
      }
      if(action.payload.action === "DELETE"){
        if(_guild && action.payload.code && action.payload.name && _guild.customslangs.find(c => c.code === action.payload.code)){
          _guild.customslangs.filter(x => x.code !== x.code);
        }
      }
      return state;
    }
      default:
        
        return state
    }
  }