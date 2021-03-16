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
  if(store.getState().ChangeGuild.guild.id !== "" && s.pathname === "/"){
    store.dispatch({type : ACTIONS.SET_GUILD_NONE,payload : {nochange : true}})
  }
  if(s.pathname.startsWith("/guild")){
    const match :any = createMatchSelector({ path: '/guild/:serverid/*' })(store.getState())
    if(match && match.params && match.params.serverid){
      if(match.params.serverid !== store.getState().ChangeGuild.guild.id){
        store.dispatch({type : ACTIONS.SET_CURRENT_GUILD, payload : {id : match.params.serverid , nochange : true}})
      }
    }
  }

})
}

export default function ChangeGuild(state = SyncManager_initialState, action) {
    switch (action.type) {
      case ACTIONS.SET_CURRENT_GUILD:{
        state = {guild : { id  :  action.payload.id }}
        if(!action.payload.nochange)
        setTimeout(() => { 
          const path = action.payload.url.replace(/[0-9]{18}/, action.payload.id)
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