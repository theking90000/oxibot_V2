import * as nodeCache from "node-cache";
import Group, {IgroupDocument} from "../database/models/groups";

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
    }
}

export const removeGroup = async (g_ : {name : string , guildID : string}) => {
    if(g_.name === "admin") return;

    const groups_ = getGroups(g_.guildID)

    const group = groups_.find(c => c.name === g_.name)

    if(!group)  throw new Error("Not Exists")

   if(await group.delete()){

    groups_.splice(groups_.indexOf(group),1)
    groups.set(group.guildID, groups_)

   }

}


updateCache();

export default groups;