import fetch from "node-fetch"

export async function checkReCaptcha(secret_key : string,response : string) : Promise<boolean>{
    try{
    const req = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response}`,{
        method : "POST",
    })
    const json = await req.json()

    return json.success;
    }catch{
        return false;
    }
}

export async function checkHCaptcha(secret_key : string,response : string) : Promise<boolean> {
    try{
        const req = await fetch(`https://hcaptcha.com/siteverify?secret=${secret_key}&response=${response}`,{
        method : "POST",
    })
    const json = await req.json()

    return json.success;
    }
    catch{
        return false;
    }
}