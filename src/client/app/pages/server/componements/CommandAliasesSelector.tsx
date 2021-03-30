import * as React from "react";
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import { useTranslation } from "react-i18next"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField"
import Popper from "@material-ui/core/Popper";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Chip } from "@material-ui/core";
import { store } from "../../../app";
import { AddRemoveCommandAliases } from "../../../../reducers/Commands";

const useStyle = makeStyles((theme : Theme) => createStyles({
    SearchPerms : {
        width : "100%",
        height : "80%",
        margin : theme.spacing(1),
        label : {
            background : theme.palette.background.default
        }
    },
    autoComplete : {
        width : "100%"
    }
}))

export default function (props ) {
    
    const classes = useStyle();
   const {t,i18n} = useTranslation()

   const [value,setValue] = React.useState([])

   const HandleChange = (event,v) => {
       setValue(v)
   }

   const clickHandler = async (event) => {
       if(value[0]){
            for(const _v of value){
                store.dispatch(await AddRemoveCommandAliases({
                    data : _v,
                    ServerID : props.guild.id,
                    name : props.commandname,
                    type : "ADD"
                }))
            }
            setValue([])
       }
   }

   const handleDelete = async (value_) => {
       store.dispatch(await AddRemoveCommandAliases({
           data : value_,
           ServerID : props.guild.id,
           name : props.commandname,
           type : "REMOVE"
       }))
       props.onDelete(value_)
   }


    return(
        <div>
            <Box display="flex" >
                {props.aliases.map((val,index) => (
                    <Chip 
                    key={index}
                    label={val}
                    onDelete={()=>handleDelete(val)}
                    />
                ))}
            </Box>
            <Box display="flex"  flexDirection="row"  >
                        <Autocomplete
                            className={classes.autoComplete}
                            multiple
                            options={[]}
                            value={value}
                            onChange={HandleChange}
                            getOptionLabel={(option) => option}
                            filterSelectedOptions
                            freeSolo
                            renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label={t('AddAliasesCommand')}
                            />
                            )}
                        />

                        <Button  onClick={clickHandler} >
                            {t('AddAliasesCommandButton')}
                        </Button>
        </Box>
        </div>
    )

}