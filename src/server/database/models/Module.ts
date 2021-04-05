import * as mongoose from "mongoose";

const ModuleSchema : mongoose.Schema = new mongoose.Schema({
    guildID : {
        type : String,
        required : true,
    },
    toggled : {
        type : Boolean,
        default : true,
    },
    data : mongoose.Schema.Types.Mixed,
    name : String
    
},{
    versionKey : false
})

export interface IModuleDocument extends mongoose.Document{
    guildID : string,
    name : string,
    toggled : boolean,
    data : any,
} 

interface IModuleInterface extends IModuleDocument {

}
export interface IModuleModel extends mongoose.Model<IModuleInterface> {
    getAll() : Promise<IModuleDocument[]>
}

ModuleSchema.static('getAll', async  () : Promise<IModuleDocument[]> => {
    
    const m : IModuleDocument[] = await Module.find();

    return m;
})

const Module = mongoose.model<IModuleInterface,IModuleModel>('Modules',ModuleSchema)

export default Module;

const ModuleDataSchema :  mongoose.Schema = new mongoose.Schema({
    guildID : {
        type : String,
        required : true,
    },
    userID : {
        type : String,
        required : true,
    },
    data : mongoose.Schema.Types.Mixed,
    name : String
})

export interface IModuleDataDocument extends mongoose.Document {
    guildID : string,
    userID : string,
    name : string,
    data : any,
}
interface IModuleDataInterface extends IModuleDataDocument {
    
}
export interface IModuleDataModel extends mongoose.Model<IModuleDataInterface> {
    getAll() : Promise<IModuleDataDocument[]>
}

ModuleDataSchema.static('getAll', async  () : Promise<IModuleDataDocument[]> => {
    
    const m : IModuleDataDocument[] = await ModuleData.find();

    return m;
})

export const ModuleData = mongoose.model<IModuleDataInterface,IModuleDataModel>('ModulesData',ModuleDataSchema)
