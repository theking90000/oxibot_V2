import * as React from "react";
import { AnyIfEmpty, connect } from "react-redux";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Fade from '@material-ui/core/Fade';
import { getPermission } from "../../../helper/permission"
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import { store } from "../../app"
import { replace } from "connected-react-router"
import Typography from "@material-ui/core/Typography";
import { Box, Card, CardContent, Grid, ListItem } from "@material-ui/core";
import { update_settings_value } from "../../../reducers/SyncData";
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';

const storeHandler = store => {
    return store.SyncData.guilds.find(c => c.id === store.ChangeGuild.guild.id) || { noGuild : true }
}

const SettingItem = props  => {

    const [isLoading,setLoading] = React.useState(false);

    const [isChecked,SetChecked] = React.useState(props.field);

    var timeout;

    React.useEffect(() => {
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    const Dispatch = async (field : string,cat : string,value) => {
        const action = await update_settings_value({
            ServerID : props.id,
            cat,
            name : field,
            value :value,
        })
        store.dispatch(action)

        setLoading(false)

    }

    const handleChange = async (e : React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field : string,cat : string) => {
        if(!e.target.value) e.target.value = ""
        await clearTimeout(timeout)
        setLoading(true)
        timeout =  setTimeout(() => Dispatch(field,cat,e.target.value),2000) 
    }

    const handleChangeBoolean = async (e, field : string,cat : string) => {
        setLoading(true)
        SetChecked(state=>!state)
        Dispatch(field,cat,e.target.checked)
    }

    return (
        <ListItem >
            <React.Fragment>
                <Typography style={{marginRight : "10px"}} >
                {props.val}
                </Typography>
                {typeof props.field === "boolean" && 
                <Switch 
                onChange={(e) => handleChangeBoolean(e,props.val,props.value.name)} 
                checked={isChecked}  
                />}
                {typeof props.field === "boolean" && isLoading && 
                    <div style={{marginLeft : "auto"}}>
                     <CircularProgress 
                     size={25}
                      />
                    </div>   
                }
                {typeof props.field === "boolean" && !isLoading && 
                    <div style={{marginLeft : "auto"}}>
                    <CheckIcon
                    
                    />
                </div>
                }
                {typeof props.field === "string" &&
                <TextField
                onChange={(e) => handleChange(e,props.val,props.value.name)} 
                style={{width : "100%"}}
                defaultValue={props.field || ''} 
                InputProps={{
                    endAdornment: isLoading ?  
                    <div>
                     <CircularProgress size={25} />
                    </div> 
                    :
                    <div>
                        <CheckIcon />
                    </div>

                }}
                />}
            </React.Fragment>
        </ListItem>
    )
}



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
      width : '100%',
      height : "100%"
    },
    value : {
        width : '100%'
    },
    grid : {
        margin : theme.spacing(3)
    }
  }),
);
type setting = {
    name : string,
    values : {
        name : string,
        value : string,
    }[]
}



const Settings = (props ) => {

    const classes = useStyles()
    const { t, i18n } = useTranslation();

    React.useEffect(() => {
        setFade(true)
       return () => {
           setFade(false)
       }
    }, [])

    /**   const settings : setting = [{
        name : t('SettingsEmebdTitle'),

    }] */

    if(props.noGuild){
        store.dispatch(replace("/"))
        return (<div>null</div>)
     }

     const [cats,setCats] = React.useState([])

     React.useEffect(() => {
        setCats(props.settings)
     }, [props.settings])

     const [fade,setFade] = React.useState(false)
 
     

    return (
        <div className={classes.root}>
        <Fade in={fade} >
            <React.Fragment>
            {cats[0] && <Grid container>
              <Grid item xs={12} >
                <Typography variant="h2" >
                    {t('ModifySettings')}
                </Typography>
                </Grid>
                    {cats.map((value,index) => {
                        return (
                            <Grid className={classes.grid} item xs={5} key={index} >            
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">
                                        {i18n.exists(`SettingsTitle-${value.name}`) ? 
                                        t(`SettingsTitle-${value.name}`) :
                                        value.name
                                    }
                                    </Typography>
                                    <List>
                                    {Object.keys(value.values).map((val,key) => {
                                        const field = value.values[val];
                                        return (
                                            <div key={val}>
                                            <SettingItem key={field + val + key + index} id={props.id}  val={val} value={value} field={field} />
                                            </div>
                                        )
                                        })}
                                    </List>
                                </CardContent>
                            </Card>
    </Grid>
                    )})}                    
                </Grid>}
            {!cats[0] && <Grid item xs={12} >ok</Grid>}
            </React.Fragment>
        </Fade>
        </div>
    )
}

export default connect(storeHandler)(Settings);