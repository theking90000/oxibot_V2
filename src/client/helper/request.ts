import { StringLiteralType } from "typescript"
import auth from "../../server/web/api/format/auth"


export default async function Request_Helper(data : {
     api? : boolean,
     route : string,
     response? : 'json' | 'fetch' | 'blob',
     json? : boolean,
     data : string,
     auth? : boolean,
     method? : string
    }) : Promise<Response | Object | Blob> {
    
     const headers = {}

     if(data.json !== false) headers['Content-Type'] = 'application/json'
     if(data.auth !== false) headers['Authorization'] = window.localStorage.oxibotV2_token

     try{
    const req = await fetch((data.api ? `/api/${data.route}` : data.route),{
          headers,
          body : data.data,
          method : data.method ? data.method : "GET"
    })

    if(data.response === "fetch") return req

    if(data.response === "json") return await req.json()

    if(data.response === "blob") return await req.blob()

      }
      catch{
            return {success : false}
      }
}