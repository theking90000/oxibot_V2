
import Captcha from "./captcha";
import { Module } from "./module";

export const Modules : Module[] = [
    
];

export const initModules = ()=>{
    Modules.push(new Captcha())

 
}
initModules()

export function getModule(module : string) {
    return Modules.find(c => c.getName() === module);
}