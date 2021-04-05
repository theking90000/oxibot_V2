const appdata = (window as any).appdata

export async function init() : Promise<{
state : "loading" | "login" | "captcha",
appid:string,
callbacks : string[]
captcha_key :string,
type :"ReCaptcha" | "hCaptcha",
customMessage : string,
captcha_id :  string}>{
    console.log(appdata)
    if(appdata.auth){
    if(window.localStorage.oxibotV2_token){
        const request = await fetch('/api/module/Captcha/login', {
            headers : {
                'Authorization' : window.localStorage.oxibotV2_token
            },
            method : "GET"
        })
        const res = await request.json()
        if(res.success){

            document.cookie = "Oxibot_V2_captcha_module=;path=/"
            return {
                state : "captcha",
                appid : appdata.appid,
                callbacks : appdata.callbacks_url,
                captcha_key : appdata.captcha_key,
                type : appdata.CaptchaType,
                customMessage : appdata.customMessage,
                captcha_id : appdata.captcha_id
            }
        }
    }
        document.cookie = `Oxibot_V2_captcha_module=${window.location.pathname};path=/`
        return { 
            state : "login",
            appid : appdata.appid,
            callbacks : appdata.callbacks_url,
            captcha_key : appdata.captcha_key,
            type : appdata.CaptchaType,
            customMessage : appdata.customMessage,
            captcha_id : appdata.captcha_id
    }
    
    }
    return { 
        state : "captcha",
        appid : appdata.appid,
        callbacks : appdata.callbacks_url,
        captcha_key : appdata.captcha_key,
        type : appdata.CaptchaType,
        customMessage : appdata.customMessage,
        captcha_id : appdata.captcha_id
}
}

function isAuth() {
    
}