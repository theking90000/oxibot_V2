import { store } from "../app/app"
import Request_Helper from "../helper/request"

export const ACTIONS = {
    SET_MODULE_DATA : "@Modules:SET_MODULE_DATA",
    UPDATE_DATA : "@Modules:UPDATE_DATA",
    SET_ENABLED : "@Modules:SET_ENABLED",
}

export const fetch_data=async(payload:{guild: string,name : string}) =>{
    const res = await Request_Helper({
        api: true,
        route: "sync/modules",
        query: [{
            key: "type",
            value : payload.guild,
        },{
            key : "module",
            value: payload.name,
        }],
        method: "GET",
        response: "json",
      }) as any
    if (res.success && res.data) {
        return store.dispatch({ type: ACTIONS.SET_MODULE_DATA, payload: {name : payload.name,guild:payload.guild, data : res.data } })
    }
    
}

export const update_data = async (payload : {
    value: any,
    type : string,
    guild : string,
    path : string,
    name : string,
}) => {
    const res = await Request_Helper({
        api: true,
        route: "modules",
        method: "PUT",
        response: "json",
        data : JSON.stringify({
            ...payload
        })
      }) as any
    if (res.success && res.data) {
        return true;
    }
    return false
}

export const SetModuleEnabled = async (obj : {ServerID : string,value : boolean,name : string}) => {
    await Request_Helper({
      data : JSON.stringify({
        guild : obj.ServerID,
        name : obj.name,
        value : obj.value,
      }),
      api : true,
      route : "modules/enable",
      method : "PUT",
    })
    
    return { type : ACTIONS.SET_ENABLED,payload: obj}
  }

export default function (state = [], action) {

    const createGuild = (id) => {
        if(!state.find(x => x.id === id)){
            state = [...state,{
                id,
                modules : []
            }]
        }
    }
    
    switch(action.type){
        case ACTIONS.SET_MODULE_DATA : {
            if(action.payload.guild && action.payload.data && action.payload.name){
                
                if(!state.find(g => g.id === action.payload.guild)) createGuild(action.payload.guild)
                let guild = state.find(g => g.id === action.payload.guild);
                if(!guild.modules.find(x => x.name === action.payload.name)){
                    guild.modules = [...guild.modules,{...action.payload.data}]
                }
            }
        } 

        case ACTIONS.SET_ENABLED : {
            if(action.payload.guild && action.payload.value && action.payload.name){
            let guild = state.find(g => g.id === action.payload.guild);
            if(guild && guild.modules.find(x => x.name === action.payload.name)){
                const mod = guild.modules.find(x => x.name === action.payload.name)
                mod.toggled = action.payload.value
            }
        }
        }


        default :{
            return state;
        }
    }

}