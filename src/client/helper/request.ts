import { StringLiteralType } from "typescript"
import auth from "../../server/web/api/format/auth"


export default async function Request_Helper(data : {
     api? : boolean,
     route : string,
     response? : 'json' | 'fetch' | 'blob',
     json? : boolean,
     data? : string,
     auth? : boolean,
     method? : string,
     query? : {key:string,value:string}[],
    }) : Promise<Response | any | Blob> {
    
     const headers = {}

     if(data.json !== false) headers['Content-Type'] = 'application/json'
     if(data.auth !== false) headers['Authorization'] = window.localStorage.oxibotV2_token
      const body = data.data

      let query = ""
    if(data.query){
          query = "?"
          for (var i = 0; i < data.query.length; i++){
                if(data.query[i].key !== "")
                query += encodeURI(data.query[i].key + "=" + data.query[i].value + ((i+1 < data.query.length) ? "&" : ""))
          }
    }

     try{
    const req = await fetch((data.api ? `/api/${data.route}${query}` : data.route+query),{
          headers,
          body,
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