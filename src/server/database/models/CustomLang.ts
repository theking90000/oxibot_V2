import * as mongoose from "mongoose";

const CustomLangSchema = new mongoose.Schema({

    guildID : String,
    langname : String,
    langcode : String,
    translations : mongoose.Schema.Types.Mixed

}, {versionKey : false,strict : false})

export interface CustomLangDocument extends mongoose.Document {
    guildID : string,
    langname : string,
    langcode : string,
    translation : any,
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

