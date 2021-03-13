import * as mongoose from "mongoose";

const GuildSchema = new mongoose.Schema({
    guildID : {
        type : String,
        required : true,
    },
    settings : {
        embed : {
            color : {
                type : String,
                required : false,
            },
            date : {
                type : Boolean,
                required : false,
            },
            footer : {
                type : String,
                required : false,
            },
        },
        server : {
            prefix : String,   
        },
    }
})

export interface IGuildDocument extends mongoose.Document{
    guildID : string,
    settings : {
        embed : {
            color : string,
            date : boolean,
            footer : string,
        },
        server : {
            prefix : string,
        }
    }
} 

interface GuildInterface extends IGuildDocument {

}
export interface IGuildModel extends mongoose.Model<GuildInterface> {
    getAll() : Promise<IGuildDocument[]>
  }


  GuildSchema.static('getAll', async  () : Promise<IGuildDocument[]> => {
    
    const users : IGuildDocument[] = await Guilds.find();


    return users;
})

const Guilds = mongoose.model<GuildInterface,IGuildModel>('guilds',GuildSchema)

export default Guilds;