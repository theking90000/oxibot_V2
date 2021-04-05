import {proxicheck_api_key} from "../../../config.js"
import fetch from "node-fetch"
/**
 * @name proxycheck
 * @param ip ip to check
 * @returns true if vpn / false if not
 */
export const proxycheck = async (ip :string) : Promise<Boolean> => {
    if(ip === "::ffff:127.0.0.1") return false;
    const req = await fetch(`http://proxycheck.io/v2/${ip}?key=${proxicheck_api_key}`)
    const json = await req.json();

    if(json.status == "warning" || json.status == "ok" && json[json.ip].proxy == "yes") {
        return true;
    }

    return false;
}