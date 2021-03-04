import { connect } from "mongoose";

type mongodblogin = {
    password : string,
    user : string,
    host : string,
    database: string,
    port? : number,
}

export const connectdb = async (l : mongodblogin) => {

   

    return await connect(`mongodb+srv://${l.user}:${l.password}@${l.host}${l.port ? `:${l.port}` : ""}/${l.database}?retryWrites=true&w=majority`,
    {useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true});

    

}

