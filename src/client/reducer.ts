import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import SyncData from "./reducers/SyncData"
import ChangeGuild from "./reducers/ChangeGuild"
import Docs from "./reducers/Docs"
  
 

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    SyncData,
    ChangeGuild,
    Docs
})

export default createRootReducer