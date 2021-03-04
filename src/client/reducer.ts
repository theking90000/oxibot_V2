import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import SyncData from "./reducers/SyncData"
import ChangeGuild from "./reducers/ChangeGuild"

  
 

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    SyncData,
    ChangeGuild,
})

export default createRootReducer