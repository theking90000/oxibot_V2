import * as React from "react"
import CircularProgress from "@material-ui/core/CircularProgress"
import {  createMuiTheme , ThemeProvider} from "@material-ui/core/styles"
import {init} from "./helper"
import Login from "./Login"
import Captcha from "./Captcha"

export const THEME = createMuiTheme({
    palette : {
      type : "dark",
      primary : {main : "#ffffff"},
      
    },
  })

export default function(props) {

    const [Page,setPage] = React.useState({
    state : "loading",
    appid : "null",
    callbacks : [],
    type : "",
    captcha_key : "",
    customMessage : "",
    captcha_id : ""
})

    React.useEffect(() => {
        (async () => {
            const v = await init()
            setPage(v)
        })()
    },[])

    return(
        <ThemeProvider theme={THEME} >
        <div style={{
            textAlign : "center",
            marginRight : "auto",
            marginLeft : "auto",
            marginTop : "auto",
            marginBottom : "auto",
        }}>
           {(() => {
               switch(Page.state){
               case "loading" : {
                return(<CircularProgress size={250} />)
               }
               case "login" : {
                   return (<Login callback={Page.callbacks} appid={Page.appid} />)
               }
               case "captcha" : {
                   return (<Captcha 
                    sitekey={Page.captcha_key} 
                    custommsg={Page.customMessage} 
                    type={Page.type} 
                    captcha_id={Page.captcha_id}
                    />)
               }
               default : {
                   return ("ERROR")
               }
           }})()}
        </div>
        </ThemeProvider>
    )
}