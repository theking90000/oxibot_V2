import { store } from "../app/app";

const Docs_IntialState = {
    permissions_list : {}
}

export const ACTIONS = {
    SET_PERMISSION_LIST : "@DocManager:SET_PERMISSION_LIST"
}

export function setPermissionList(perms){
    store.dispatch({ type: ACTIONS.SET_PERMISSION_LIST, payload : perms })
}

export default function DocManager(state = Docs_IntialState, action) {
    switch(action.type){
        case ACTIONS.SET_PERMISSION_LIST : {
            state.permissions_list = action.payload;
        }


        default :
            return state;
    }
}