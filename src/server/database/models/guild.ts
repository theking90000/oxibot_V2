import * as mongoose from "mongoose";

const ServerSchema = new mongoose.Schema({
    guildID : {
        type : String,
        required : true,
    },
})