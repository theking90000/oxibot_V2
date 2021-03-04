import { store } from "../app/app";
import { push } from 'connected-react-router'
import { generatePath } from 'react-router';
import { useParams } from "react-router-dom"


const SyncManager_initialState = {
    guild : {
        id : "",
    }
}

export const ACTIONS = {
    SET_CURRENT_GUILD : "@ChangeGuild:SET_CURRENT_GUILD",
    SET_GUILD_NONE : "@ChangeGuild:SET_GUILD_NONE"
}




export default function ChangeGuild(state = SyncManager_initialState, action) {
    switch (action.type) {
      case ACTIONS.SET_CURRENT_GUILD:{
        state = {guild : { id  :  action.payload.id }}
        console.log(action.payload)
        setTimeout(() => { 
          const path = action.payload.url.replace(/[0-9]{18}/, action.payload.id)
          console.log(path)
          store.dispatch(push(path.startsWith(`/guild/`) ? path : `/guild/${action.payload.id}/`))
        })
        return state; 
      }
      case ACTIONS.SET_GUILD_NONE : {

        setTimeout(() => { 
          store.dispatch(push('/'))
        })
        state = SyncManager_initialState;
        return state;
      }


      default:
        
        return state
    }
  }