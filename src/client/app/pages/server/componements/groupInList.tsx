import * as React from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper"
import { store } from "../../../app";
import { push } from "connected-react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
        display : "flex",
        flexDirection : "row",
        alignItems : "center",
        justifyContent : 'space-between',
      width : "100%",
      background : theme.palette.background.default,
      padding : theme.spacing(1)
    }
}))

export default (props : { name : string,path : string }) => {

    const classes = useStyles();

    const HandleClick = (e) => {
        store.dispatch(push(props.path + `/edit/${props.name}`))
    }

    return(
        <ListItem >
            <Paper className={classes.box} >
                <Box>
                    <Typography>
                    {props.name}
                    </Typography>
                </Box>
                <Box>
                    <Button onClick={HandleClick} >Modifier</Button>
                </Box>
            </Paper>
        </ListItem>
    )
}