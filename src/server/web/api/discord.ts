import fetch from 'node-fetch';


   export const checkToken = async function(token) {
        const data = await fetch(`https://discord.com/api/users/@me`, {method: 'GET',headers: {"Authorization": 'Bearer '+token}})
        const json = await data.json()
        if(!json||(json.code && json.code ===0)) return false;
        if( json.id ) return json;
        else return false;
    }
