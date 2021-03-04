import { store } from "./app/app"
import { push, replace } from 'connected-react-router'
import { ACTIONS } from "./reducers/SyncData"

declare const window : any


export default async function start(){


    if(store.getState().SyncData.userinfo.id) return store.dispatch(push('/'));

    const urlParams= new URLSearchParams(window.location.hash)
    if(urlParams.has("access_token") && urlParams.has('expires_in')){
        store.dispatch(replace('/loading'))
        const x = await fetch('/api/auth',{
            body : JSON.stringify({
                token : urlParams.get("access_token"),
                expires_in : urlParams.get('expires_in')
            }),
            headers: {
                'Content-Type':'application/json',
            },
            method : "POST"
        })
        const res = await x.json()
        if(res.success){
        window.localStorage.oxibotV2_token = res.token
         
          
        }else{
            return store.dispatch(replace('/login')); 
        }
    }

    if(window.localStorage.oxibotV2_token){
        store.dispatch(replace('/loading'));


        const request = await fetch('/api/sync', {
            headers : {
                'Authorization' : window.localStorage.oxibotV2_token
            },
            method : "GET"
        })

        const json = await request.json();
        if(json.success){
        store.dispatch(({ type : ACTIONS.REPLACE_DATA, payload : json.data }))

        store.dispatch(replace('/'))
        }else{
            store.dispatch(replace('/login'));
        }
    }else {
        store.dispatch(replace('/login'));
    }

}