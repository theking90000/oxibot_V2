import * as React from "react";
import { Switch, Route,} from "react-router-dom";
import {  createMuiTheme , ThemeProvider} from "@material-ui/core/styles"
import { Provider } from "react-redux";
import { ConnectedRouter,push } from 'connected-react-router'
import configureStore ,{ history } from "../store"
import Loading from "./pages/loading"
import Login from "./pages/login"
import start from "../main"
import MainPage from "./pages/main";
import MainServerPage from "./pages/server/main"

export const THEME = createMuiTheme({
  palette : {
    type : "dark",
    primary : {main : "#ffffff"},
    
  },
})

export const store = configureStore({})

export default function App() {

  const style : React.CSSProperties = {
    backgroundColor : "#212121",
    width : "100%",
    height : "100%"
  }

  React.useEffect(() =>{
    start()
  })

    return (
    <Provider store={store} >
       <ConnectedRouter history={history}>
         <ThemeProvider theme={THEME} >
         <div style={style}>

         </div>
         
      <Switch>

          <Route exact path="/loading"  >
             <Loading />
          </Route>

          <Route exact path="/login" >
            <Login />
          </Route>

          <Route exact path="/guild/:serverid/*">
           <MainServerPage />
          </Route>

          <Route exact path="/" >
           <MainPage  />
          </Route>

          
      
      </Switch>
      </ThemeProvider>
      </ConnectedRouter >
       
    </Provider>

    
    )

}