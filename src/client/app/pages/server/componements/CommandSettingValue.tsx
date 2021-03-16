import * as React from "react";
import TextField from "@material-ui/core/TextField"
import { useTranslation } from "react-i18next";
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import Typography from "@material-ui/core/Typography"
import { Switch } from "@material-ui/core";
import { store } from "../../../app";
import { set_command_setting } from "../../../../reducers/SyncData";

export default props => {

    const {t,i18n} = useTranslation()

    const [isLoading,setLoading] = React.useState(false);

    const [isChecked,SetChecked] = React.useState(Boolean(props.params.value));

    var timeout;

    React.useEffect(() => {
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    const Dispatch = async (value : any) => {
        store.dispatch(await set_command_setting({
            ServerID: props.id,
            name : props._cmdname,
            setting : props.name,
            value : value,
        }))

        setLoading(false)
    }

    const handleChange = async (e : React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if(!e.target.value) e.target.value = ""
        clearTimeout(timeout)
        setLoading(true)
        timeout =  setTimeout(() => Dispatch(e.target.value),2000) 
    }

    const handleChangeBoolean = async (e) => {
        SetChecked(state=> {
            Dispatch(!state)
            return !state;
        })
        
    }

    switch(props.params.type.toLowerCase()){
        case "string" : {
            return (
                <div>
                    <Typography style={{marginRight : "10px"}} >
                    {props.name}
                    </Typography>
                    <TextField
                onChange={handleChange} 
                style={{width : "100%"}}
                defaultValue={props.params.value || ''} 
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
                />
                </div>
            )
        }
        case "boolean" : {
            return (
                <div style={{width : "100%"}} >
                    <Typography style={{marginRight : "10px"}} >
                    {props.name}
                    </Typography>
                    <div style={{
                    display : "flex",
                    flexDirection : "row",
                    justifyContent : "space-between",
                    width : "100%"
                }}>
                    <Switch 
                    color="secondary"
                    checked={isChecked} 
                    onChange={handleChangeBoolean} 
                    value={isChecked}
                    />
                    { isLoading && 
                    <div style={{marginLeft : "auto"}}>
                     <CircularProgress 
                     size={25}
                      />
                    </div>   
                    }
                    { !isLoading && 
                    <div style={{marginLeft : "auto"}}>
                    <CheckIcon
                    
                    />
                    </div>}
                     </div>
                </div>
            )
        }

        default : {
            return (
                <div></div>
            )
        }
    }
}