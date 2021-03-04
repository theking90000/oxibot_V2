import * as React from "react";

import Container from "@material-ui/core/Container"
import LinearProgress from "@material-ui/core/LinearProgress"
import theme from "../app"


export default class  loading extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <LinearProgress  value={50} />
        )
    }
}