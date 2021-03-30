import { store } from "../app/app";
import { createMatchSelector, push , replace} from 'connected-react-router'
import { generatePath } from 'react-router';
import { useParams } from "react-router-dom"
import { history } from "../store";


const SyncManager_initialState = {
    guild : {
        id : "",
    }
}

export const ACTIONS = {
    SET_CURRENT_GUILD : "@ChangeGuild:SET_CURRENT_GUILD",
    SET_GUILD_NONE : "@ChangeGuild:SET_GUILD_NONE"
}
export const setupListener = () => {

history.listen((s) => {
  AutoDetectGuild(s.pathname)
})
}

export const AutoDetectGuild = (path : string) => {
  if(!path.startsWith('/guild/')){
    store.dispatch({type : ACTIONS.SET_GUILD_NONE,payload : {nochange : true}})
  }
  if(path.startsWith("/guild/")){
    const id :string[] = path.split('/')
    if (id && id[2] && id[2] !== store.getState().ChangeGuild.guild.id) {
        store.dispatch({type : ACTIONS.SET_CURRENT_GUILD, payload : {id : id[2] ,url : path, nochange : path.endsWith('/')}})
    }
  }
}

export default function ChangeGuild(state = SyncManager_initialState, action) {
    switch (action.type) {
      case ACTIONS.SET_CURRENT_GUILD:{
        state = {guild : { id  :  action.payload.id }}
        if(!action.payload.nochange)
        setTimeout(() => { 
          var path : string= action.payload.url.replace(/[0-9]{18}/, action.payload.id)
          path += path.endsWith('/') ? "" : "/"
          console.log(path)
          store.dispatch(push(path.startsWith(`/guild/`) ? path : `/guild/${action.payload.id}/`))
        })
        return state; 
      }
      case ACTIONS.SET_GUILD_NONE : {
        if(!action.payload || !action.payload.nochange) {
        setTimeout(() => { 
          store.dispatch(push('/'))
        })
      }
        state = SyncManager_initialState;
        return state;
      }


      default:
        
        return state
    }
  }