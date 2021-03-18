import * as mongoose from "mongoose";

const CustomLangSchema = new mongoose.Schema({

    guildID : String,
    langname : String,
    langcode: String,
    default: {
        type: Boolean,
        default: false,
    },
    translations: mongoose.Schema.Types.Mixed,
    forcedChannels: [String]

}, {versionKey : false,strict : false})

export interface CustomLangDocument extends mongoose.Document {
    guildID : string,
    langname : string,
    langcode : string,
    translation: any,
    default: boolean,
    forcedChannels: string[]
}

interface CustomLangInterface extends CustomLangDocument {

}
export interface ICustomLang extends mongoose.Model<CustomLangInterface> {   
    getAll() : Promise<CustomLangDocument[]>
}



CustomLangSchema.static('getAll', async  () : Promise<CustomLangDocument[]> => {
    
    const users : CustomLangDocument[] = await CustomLang.find();

    return users;
})

const CustomLang = mongoose.model<CustomLangInterface,ICustomLang>('CustomLangs',CustomLangSchema)

export default CustomLang;

