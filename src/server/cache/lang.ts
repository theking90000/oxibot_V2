import * as nodeCache from "node-cache";
import * as fs from "fs"
import {join} from 'path'

const lang = new nodeCache();

const init = async () => {
    fs.readdir(join(__dirname , '..' , '..', '..', 'locales'),(err, files) => {
        if(err) return;
        for(const file of files){
            if(!file.endsWith('.json')) continue

            const translate = require(join(__dirname , '..' , '..', '..', 'locales', file) )
            lang.set(file.slice(0,-5), translate)
        }
    })
}

init()


export const LangExist = (name : string) : boolean => lang.has(name)

export const GetLang = (name : string) : any => lang.get(name)

export const getAllLang = () : {lang : string,langname : string}[] => lang.keys().map((value) => 
{ return{
    lang: value,
    langname : GetLang(value).name 
}})
