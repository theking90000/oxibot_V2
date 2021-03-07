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
    guilds : []
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

export const ACTIONS = {
    REPLACE_DATA : "@SyncManager:REPLACE_DATA",
    UPDATE_USER_GROUP : "@SyncManager:UPDATE_USER_GROUP",
    UPDATE_GROUP_PERMISSION : "@SyncManager:UPDATE_GROUP_PERMISSION",
    CREATE_GROUP : "@SyncManager:CREATE_GROUP",
    DELETE_GROUP : "@SyncManager:DELETE_GROUP",
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
  }
      default:
        
        return state
    }
  }