import { IgroupDocument } from "./database/models/groups"
import * as user__cache from "./cache/user"

export type permissionuser = {
    hasPermission(arg0 : string) : boolean,
    readonly permissions : string[],
}

export const getUser = (u : { guildID : string,userID : string }) : permissionuser => {
    let groups : IgroupDocument[]
    try{
        groups = user__cache.selectUser(u.guildID,u.userID).getGroups();
    }catch{
        return {
            hasPermission : (arg0) => false,
            permissions : [], 
        }
    }
    
    let permissions = [];
    groups.forEach(c => {
        
        c.permissions.forEach(p => {
            permissions.push(p);
        })
    }) 
    let c : permissionuser = {
        hasPermission : (arg0) => {
            let ok = false;
            let c = arg0.split('.');
            for(const perm of permissions){
                let p = perm.split('.'),b=true,counter = 0;
                for(var i=0;i<c.length;i++){
                    if((p[i] && c[i] === p[i] || p[i] === "*")){
                        counter++
                         b = true;         
                    }
                    else if (!p[i]){
                        let c_ = false;
                        for(var x=0;x<c.length;x++){
                            if (!c_ && (!p[i] && (p[i-x] && p[i-x] === '*') )){
                                counter = p.length
                                c_ = true,b = true;
                            }else if (!c_){
                                b = false;
                            }
                        }
                    }
                    else b = false;
                }
                if(b && counter === p.length) ok = true
            }

            return ok;
        },
        permissions : permissions,
    }

    return c;

}

export const PERMISSIONS = {
    "command.group" : "PermissionCommandGroup",
    "command.group.permission" : "PermissionCommandGroupPerm"
}