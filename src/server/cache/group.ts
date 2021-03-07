import * as nodeCache from "node-cache";
import Group, {IgroupDocument} from "../database/models/groups";
import * as UserCache from "./user"
const groups = new nodeCache();

export const getGroups = (serverid : string) : IgroupDocument[] => {
    
    if(!groups.has(serverid)) return []

    return groups.get(serverid);
}

export const updateCache = async () : Promise<void> => {
    
        let group_ = await Group.getAll();
            groups.close();
        groups.set('cache', group_);

        for(const group of group_){
            let guild : IgroupDocument[] = groups.has(group.guildID) ? groups.get(group.guildID) : []
            guild.push(group);
            groups.set(group.guildID , guild) ;
        }   

        

}

type createGroupT = {
    name : string,
    guildID : string,
    permissions : string[],
    Roles? : [{
        id : string,
    }],
}
export const createGroup = async (g_ : createGroupT) => {
    let groups_ = getGroups(g_.guildID)
    const group = new Group(g_)

    if(groups_.map(c => c.name).includes(g_.name))  throw new Error("Exists")

    if(await group.save()){
        
        groups_.push(group);
        groups.set(group.guildID , groups_) ;

        return group;
    }
}

export const removeGroup = async (g_ : {name : string , guildID : string}) => {
    if(g_.name === "admin") return;

    const groups_ = getGroups(g_.guildID)

    const group = groups_.find(c => c.name === g_.name)

    if(!group)  throw new Error("Not Exists")

    UserCache.getUsers(g_.guildID).forEach(user => {
       const u = UserCache.selectUser( g_.guildID, user.userID)

       if(u.getGroups().find(x => x.name === g_.name)){
           u.removeGroup(g_.name)
       }
    })

   if(await group.delete()){

    groups_.splice(groups_.indexOf(group),1)
    groups.set(group.guildID, groups_)

   }
}

export const setPermission = async (group : { name : string,guildID : string }, callback : (arg0:string[]) => string[] ) => {
    const groups_ = getGroups(group.guildID)

    const group_ = groups_.find(c => c.name === group.name);

    const index = groups_.indexOf(group_)

    if(!group_) return;

    const permissions = callback(group_.permissions)
    groups_[index].permissions = permissions

    if(await groups_[index].save()){
        groups.set(group.guildID, groups_)
    }
    
} 


updateCache();

export default groups;