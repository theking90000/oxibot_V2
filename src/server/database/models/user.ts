import * as mongoose from "mongoose";

const UserSchema : mongoose.Schema = new mongoose.Schema({
    userID : {
        type : String,
        required : true,
    },
    guildID : {
        type : String,
        required : true,
    },
    Groups : [{
        type : String,
    }],
    lang: {
        type: String,
        required: false,
    }
},{
    versionKey : false
})

export interface IUsersDocument extends mongoose.Document{
    userID : string,
    guildID : string,
    Groups: string[],
    lang?: string,
    
} 

interface UserInterface extends IUsersDocument {

}
export interface IUserModel extends mongoose.Model<UserInterface> {
    // here we decalre statics
    
    getAll() : Promise<IUsersDocument[]>
  }


  UserSchema.static('getAll', async  () : Promise<IUsersDocument[]> => {
    
    const users : IUsersDocument[] = await Users.find();

    return users;
})

const Users = mongoose.model<UserInterface,IUserModel>('users',UserSchema)

export default Users;