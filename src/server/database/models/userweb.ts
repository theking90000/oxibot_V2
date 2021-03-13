import * as mongoose from "mongoose";

const UserWebSchema : mongoose.Schema = new mongoose.Schema({
    DiscordUserID : {
        type : String,
        required : true,
    },
    access_token : {
        type : String,
        required :true,
    },
    expires : {
        type: Number,
        required: true,
        validate : (value) => {
            const date = new Date()
            if (Math.round((date.getTime() / 1000)) > parseInt(value)) {
                throw new Error('Token Expired')
            }
        }
        },
    token : {
        type : String,
        required : true,
    },
    serverToAdd : [{
        name : {
            type : String,
            required : true,
        },
        id : {
            type : String,
            required : true,
        }
    }]
})

export interface IUsersWebDocument extends mongoose.Document{
    DiscordUserID : string,
    token : string,
    expires : number,
    access_token : string,
    serverToAdd? : {
        name : string,
        id : string
    }[]
} 

interface UserWebInterface extends IUsersWebDocument {

}
export interface IUserWebModel extends mongoose.Model<UserWebInterface> {

    
    getAll() : Promise<IUsersWebDocument[]>
  }


  UserWebSchema.static('getAll', async  () : Promise<IUsersWebDocument[]> => {
    
    const users : IUsersWebDocument[] = await UserWeb.find();

    return users;
})

const UserWeb = mongoose.model<UserWebInterface,IUserWebModel>('usersweb',UserWebSchema)

export default UserWeb;