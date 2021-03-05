import { Box, Grid, Typography } from "@material-ui/core";
import * as React from "react";
import ListItem from "@material-ui/core/ListItem"
import  Paper  from "@material-ui/core/Paper";
import List from "@material-ui/core/List"
import { store } from "../../app";
import { ACTIONS } from "../../../reducers/ChangeGuild";
import { useTranslation } from "react-i18next"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const useStyle = makeStyles((theme : Theme) => createStyles({

    Box : {
        margin : theme.spacing(2)
    },

    search : {
        width :'80%'
    },

}))

const elem = (props) => {


    const classes = useStyle();

    React.useEffect(() => {
        if(props.noGuild)
        store.dispatch({ type: ACTIONS.SET_GUILD_NONE })
    }, [props.noGuild])
    
    const group = props.guild.groups.find(c => c.name === props.group);
    if(!group)
    store.dispatch({ type: ACTIONS.SET_GUILD_NONE })

    const [PermDisplayed,SetPermDisplayed] = React.useState(group.permission)

    const handleSearch = (event) => {

    }

    const {t , i18n} = useTranslation()

    return (
        <Grid container >
            <Grid item xs={12} >
                <Paper >
                    <Box className={classes.Box} display="flex" alignContent="center" flexDirection="row" justifyContent="space-between" >
                    <TextField autoFocus label={t("SearchGroupPermissionPlaceholder", {counter : PermDisplayed.length})} onChange={handleSearch} className={classes.search} />
                    <Typography variant="h5">
                        {t('EditGroupPermission', {counter : PermDisplayed.length})}
                    </Typography>
                    </Box>
                    <List>
                        {PermDisplayed.map((value,index) => (
                            <ListItem key={index}>
                                {value}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default (elem)