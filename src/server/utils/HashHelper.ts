import * as crypto from "crypto";
import { scrypt_salt } from "../../../config.js"

export async function hash(password : string) : Promise<string> {
    return new Promise((resolve,reject) => {

    crypto.scrypt(password, scrypt_salt,64, (err,hash_) => {
        if(err) reject(err);
        resolve(hash_.toString("hex"))
    })
    })
}

export async function verify(password : string,hash : string){
    return new Promise((resolve,reject) => {
        crypto.scrypt(password, scrypt_salt,64, (err,hash_) => {
            if(err) reject(err);
            resolve(hash == hash_.toString('hex'))
        })
    })
}