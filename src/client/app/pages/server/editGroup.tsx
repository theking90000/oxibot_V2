import { Grid } from "@material-ui/core";
import * as React from "react";
import { createMatchSelector } from 'connected-react-router';
import { store } from "../../app"
import { connect } from "react-redux";
import { replace, } from "connected-react-router";
import { ACTIONS } from "../../../reducers/ChangeGuild";
import { useTranslation } from "react-i18next"


const elem = (props : { group : string }) => {

    
    console.log(props)
    
    return (
        <Grid container >
            TODO
        </Grid>
    )
}

export default (elem)