import { store } from "../app/app"
import Request_Helper from "../helper/request"

export const ACTIONS = {
    SET_GUILD_DATA : "@Roles:SET_MODULE_DATA",
    SET_DATA : "@Roles:SET_DATA",
}

export const fetch_data=async(payload:{guild: string}) =>{
    const res = await Request_Helper({
        api: true,
        route: "sync/roles",
        query: [{
            key: "type",
            value : payload.guild,
        },],
        method: "GET",
        response: "json",
      }) as any
    if (res.success && res.data) {
        return store.dispatch({ type: ACTIONS.SET_GUILD_DATA, payload: {...payload, data : res.data } })
    }
    
}


export default function (state = [], action) {
    switch(action.type){
        case ACTIONS.SET_GUILD_DATA : {
            if(action.payload.guild && action.payload.data){
                state = [...state,{
                    id : action.payload.guild,
                    roles : action.payload.data,
                }]
            }
        }
        default : {
            return state;
        }
    }

}