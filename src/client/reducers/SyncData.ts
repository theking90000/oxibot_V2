import { syncObjD } from "../../server/web/api/helper/sync"
import { store } from "../app/app"

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

export const ACTIONS = {
    REPLACE_DATA : "@SyncManager:REPLACE_DATA",
    UPDATE_USER_GROUP : "@SyncManager:UPDATE_USER_GROUP",
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

        return state;
        
      }
      default:
        
        return state
    }
  }