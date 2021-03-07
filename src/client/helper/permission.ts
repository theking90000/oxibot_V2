import { store } from "../app/app"

export const getPermission = (userID : string,guildID : string) : string[] => {
    const guild = store.getState().SyncData.guilds.find(c => c.id === guildID);
    if(!guild) return []

    const user = guild.members.users.find(c => c.id === userID)
    if(!user) return []
    let permissions = [];
    guild.groups.forEach(c => {
        if(user.groups.includes(c.name))
        c.permission.forEach(p => {
            permissions.push(p);
        })
    }) 

    return permissions
}

export const hasPermission = (arg0 : string,permissions : string[]) : boolean => {
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
}