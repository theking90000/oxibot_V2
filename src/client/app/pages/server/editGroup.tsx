import { Box, Button, Grid, Typography } from "@material-ui/core";
import * as React from "react";
import ListItem from "@material-ui/core/ListItem"
import  Paper  from "@material-ui/core/Paper";
import { FixedSizeList } from 'react-window';
import { store } from "../../app";
import { ACTIONS } from "../../../reducers/ChangeGuild";
import { useTranslation } from "react-i18next"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddPermission from "./componements/AddPermission";
import { connect } from "react-redux";
import { replace } from "connected-react-router";


const useStyle = makeStyles((theme : Theme) => createStyles({

    Box : {
        marginLeft : theme.spacing(2),
        marginRight : theme.spacing(2)
    },

    search : {
        width :'80%'
    },
    ListU : {
        marginTop : theme.spacing(2),
        borderRadius : theme.spacing(3)
    },
    listI : {
        width : "100%",
        padding : theme.spacing(2),
        background : theme.palette.background.default,
        display : "flex",
        justifyContent : "space-between",
        alignContent : "center"
    },
    MainC : {
        padding : theme.spacing(1)
    },
    MainC2 : {
        padding : theme.spacing(1),
        marginTop : theme.spacing(3)
    },
    

}))



const StoreHandler = store => {
    return store.Docs
}


const elem = (props) => {


    
    
    const group = props.guild.groups.find(c => c.name === props.group);
    if(!group)
        return(
          <div>ERROR</div>
        )
    const classes = useStyle();
    const {t , i18n} = useTranslation()

    var Availables;


    const [PermDisplayed,SetPermDisplayed] = React.useState(group.permission)

    const [AvailablesPerms,SetAvailablesPerm] = React.useState([])

    React.useEffect(() => {
        Availables = []
        for(const [key,value] of Object.entries(props.permissions_list)){
            if(!group.permission.includes(key)){
                Availables.push({name : key,desc : t(`doc.permissions.${value}`, {perm : key})})
            }
        }

        SetPermDisplayed((state) => group.permission)
        SetAvailablesPerm((state) => Availables)
    }, [props.guild])

    const handleSearch = (e) => {
        const d = []
        for (const u of group.permission){
          if(~u.indexOf(e.target.value) || e.target.value === "" ) d.push(u)
        }
        SetPermDisplayed(d);
    }

    const handleDelete = async (del : string) => {

        const req = await fetch('/api/group/permission',{
            headers : {
                'Authorization' : window.localStorage.oxibotV2_token,
                'Content-Type':'application/json',
              },
              body : JSON.stringify({
                guild : store.getState().ChangeGuild.guild.id,
                action : "REMOVE",
                group : group.name,
                permission : del
              }),
              method : "POST"
        })

        group.permission = group.permission.filter(c => c !== del)

        SetAvailablesPerm((state) => {
            return state.filter(c => c.name !== del)
        })

        SetPermDisplayed((state) => {
            return state.filter(c => c !== del)
        })
    }


    const handleAdd = async (value) => {
        for(const perm of value){
            
            const req = await fetch('/api/group/permission', {
                headers : {
                    'Authorization' : window.localStorage.oxibotV2_token,
                    'Content-Type':'application/json',
                  },
                  body : JSON.stringify({
                    guild : store.getState().ChangeGuild.guild.id,
                    action : "ADD",
                    group : group.name,
                    permission : perm
                                 }),
                  method : "POST"
            })

            const res = await req.json();

            if(res.success){
                SetPermDisplayed((state) => {
                    state.push(perm);
                    console.log(state)
                    return state
                })
                SetAvailablesPerm(state => state.filter(c => c.name !== perm))
            }

        }
    }



    const row = (props) => {

        const { index, style } = props;
    
        const value = PermDisplayed[index]
        return(
            <ListItem key={index} style={style}>
                <Paper className={classes.listI} >
                    <Box>
                        {t('EditGroupPermissionDisplay',{permission : value})}
                    </Box>
                    <Box>
                        <HighlightOffIcon style={{cursor : "pointer"}} onClick={() => handleDelete(value)} />
                    </Box>
                </Paper>
            </ListItem>
        )
    }
    

    

    return (
        <Grid container >
            <Grid item xs={12} >
                <Paper className={classes.MainC} >
                    <Box className={classes.Box} display="flex" alignContent="center" flexDirection="row" justifyContent="space-between" >
                    <TextField autoFocus label={t("SearchGroupPermissionPlaceholder", {counter : PermDisplayed.length})} onChange={handleSearch} className={classes.search} />
                    <Typography variant="h5" display="block" align="center" >
                        {t('EditGroupPermission', {counter : group.permission.length})}
                    </Typography>
                    </Box>
                    <FixedSizeList className={classes.ListU} height={400} width="100%" itemSize={50} itemCount={PermDisplayed.length} >
                        {row}
                    </FixedSizeList>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.MainC2} >
                    <AddPermission onAdd={handleAdd} list={AvailablesPerms} />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default connect(StoreHandler)(elem)