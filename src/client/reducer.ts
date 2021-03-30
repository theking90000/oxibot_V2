import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import SyncData from "./reducers/SyncData"
import ChangeGuild from "./reducers/ChangeGuild"
import Docs from "./reducers/Docs"
import Channels from "./reducers/Channels" 
import Translations from "./reducers/Translations" 
import Commands from "./reducers/Commands" 


const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    SyncData,
    ChangeGuild,
    Docs,
    Channels,
    Translations,
    Commands
})

export default createRootReducer