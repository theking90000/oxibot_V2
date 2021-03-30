import * as mongoose from "mongoose";

const GroupSchema : mongoose.Schema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    guildID : {
        type : String,
        required : true,
    },
    permissions : [{
        type : String,
        required : false,
    }],
    Roles : [{
        id : {
            type : String,
            required : true,
        }
    }]
},{
    versionKey : false,
})

export interface IgroupDocument extends mongoose.Document{
    name : string,
    guildID : string,
    permissions : string[],
    Roles? : [{
        id : string,
    }],
    
} 

interface GroupInterface extends IgroupDocument {

}
export interface IGroupModel extends mongoose.Model<GroupInterface> {
    // here we decalre statics
    
    getAll() : Promise<IgroupDocument[]>
  }


GroupSchema.static('getAll', async  () : Promise<IgroupDocument[]> => {
    
    const users : IgroupDocument[] = await Group.find();

    return users;
})

const Group = mongoose.model<GroupInterface,IGroupModel>('groups',GroupSchema)

export default Group;