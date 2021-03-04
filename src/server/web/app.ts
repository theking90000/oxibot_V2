import * as express from "express";
import * as http from "http";
import { default_port } from "../../../config"
import { redBright } from "chalk";
import routes from "./routes"
import { ActionUserWeb } from "../cache/userweb";

declare global {
    namespace Express {
      interface Request {
        user?: ActionUserWeb
      }
    }
  }
  
 

export default function(){
    const app = express();
    const server = http.createServer(app);

    
    routes(app)

    server.listen(default_port,() => {
        console.log(redBright(`Serveur web sur http://localhost:${default_port}`))
    })
}
