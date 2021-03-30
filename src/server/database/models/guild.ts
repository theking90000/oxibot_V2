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
    },
    commands :  [{
            enabled : {
                type : Boolean,
                default : true,
            },
            settings : {},
            name : String
        }],
    saves : {
        backups_cat : {
            name : {
                type : String,
                required : false,
            },
            id : {
                type : String,
                required : false,
            }
        }
    }
},{
    versionKey : false
})

export interface commandBaseSettings  {
    enabled : boolean,
    settings : {
        name : string,
        settings : {
            canBeDisabled? : boolean,
            data : any,
            canHasAliases? : boolean,
            Aliases? : string[]
        }
    },
    name : string,
}

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
    },
    commands : commandBaseSettings[],
    saves : {
        backups_cat : {
            name : string,
            id : string,
        },
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