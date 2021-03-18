import * as nodeCache from "node-cache";
import user, {IUsersDocument} from "../database/models/user";
import  {  IgroupDocument} from "../database/models/groups";
import { getGroups } from "./group";
import { gray } from "chalk";

export const users = new nodeCache({ useClones: false });

export const getUsers = (serverid : string) : IUsersDocument[] => {
    
    if(!users.has(serverid)) return []
    let c :  IUsersDocument[] = users.get(serverid)
    return c;
}

export const updateCache = async () : Promise<void> => {
    
        let group_ = await user.getAll();
        users.close();
        users.set('cache', group_);

        for(const group of group_){
            let guild : IUsersDocument[] = users.has(group.guildID) ? users.get(group.guildID) : []
            guild.push(group);
            users.set(group.guildID , guild) ;
        }   

        console.log(gray(`${group_.length} utilisateurs chargés dans le cache`))

}

type createGroupT = {
    userID : string,
    guildID : string,
    Groups: string[],
}
export const addUser = async (g_ : createGroupT) => {
    let users_ = getUsers(g_.guildID)
    const user_ = new user(g_)

    if(users_.map(c => c.userID).includes(g_.userID))  throw new Error("Exists")
    let c = await user_.save();
    
    if(c){
        users_.push(user_);
        users.set(user_.guildID , users_) ;
    }
}

export type userS = {
    addGroup(groupname : string) : void,
    removeGroup(groupname : string) : void,
    getGroups(): IgroupDocument[],
    user: IUsersDocument,
    readonly lang: string,
}

export const selectUser = (guildID : string,userID : string) : userS=>{

    let users_ = getUsers(guildID);
    if(users_.length === 0 || !users_.map(c => c.userID).includes(userID)) return null;
    let user = users_[users_.map(c => c.userID).indexOf(userID)];
    if(!user) throw new Error('No user')
    return {
        addGroup : async (groupname : string) => {
            let user = getUsers(guildID).find(x => x.userID === userID)

            let g = getGroups(guildID);

            if(!g.find(c => c.name === groupname)) return;

            let u2  : IUsersDocument[] = users.get(guildID);

            if(!u2.find(c => c.Groups.includes(groupname) && c.userID === user.userID)) {

                user.Groups.push(groupname)

                await user.save();

                u2 = u2.map(x => {
                    if(x.userID === user.userID){
                        x = user;
                    }
                    return x
                })
                
                users.set(guildID,u2)

                
                
            }
        },
        removeGroup : async (groupname : string) => {
            let user = users_[users_.map(c => c.userID).indexOf(userID)];

            let g = getGroups(guildID);

            if(!g.find(c => c.name === groupname)) return;

            let u2  : IUsersDocument[] = users.get(guildID);
            
            user.Groups = user.Groups.filter(group => group !== groupname)
            await user.save();

            u2 = u2.map((data,index) => {
                if(data.userID === userID){
                    data = user;
                }
                return data;
            })
                
                users.set(guildID,u2)

                
                
        },       
        getGroups : () => {
            let g = getGroups(guildID);let c = [];
            g.forEach((f) => {
                if(users_[users_.map(c => c.userID).indexOf(userID)].Groups.includes(f.name)){
                    c.push(f);
                }
            })

            return c;
        },
        user,
        lang: user.lang,
    }
}

updateCache();

export default users;