import { store } from "./app/app"
import { push, replace } from 'connected-react-router'
import { ACTIONS } from "./reducers/SyncData"
import { setup } from "./i18n"
import { setPermissionList } from "./reducers/Docs"
import {__first} from "./store"
import { AutoDetectGuild } from "./reducers/ChangeGuild"

//declare const window : any


export default async function start(){
    const backurl = store.getState().router.location

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
        if(getCookie("Oxibot_V2_captcha_module")){
            const cookie = getCookie("Oxibot_V2_captcha_module")
            document.cookie = "Oxibot_V2_captcha_module=;path=/"
            if(cookie !== null)
            return window.location.href =  cookie
         }
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
        await setup(json.defaultlocale, json.availableslang);

        const reqs = await fetch('/api/doc/permissions');
        const reqsj = await reqs.json();
        
        setPermissionList(reqsj);

        store.dispatch(({ type : ACTIONS.REPLACE_DATA, payload : json.data }))
        AutoDetectGuild(__first)
        setTimeout(()=> store.dispatch(replace(__first === "/loading" || __first === "/login" ? "/" : __first)),250)
        }else{
            store.dispatch(replace('/login'));
        }
    }else {
        store.dispatch(replace('/login'));
    }

}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  