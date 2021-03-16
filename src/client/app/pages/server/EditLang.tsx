import * as React from "react";
import {FixedSizeList } from "react-window"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper"
import Box from "@material-ui/core/Box"
import { useTranslation } from "react-i18next";
import { CircularProgress, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { store } from "../../app";
import { replace } from "connected-react-router";
import CheckIcon from "@material-ui/icons/Check"

const useStyles = makeStyles((theme : Theme) => createStyles({
    box : {
        background : theme.palette.background.default,
        width : "100%",
        height : "100%"
    },
    ListU : {
        marginTop : theme.spacing(2),
        borderRadius : theme.spacing(1)
    },
    Field : {
        marginRight : theme.spacing(2),
        width : "50%"
    },
    Title : {
        marginLeft : theme.spacing(2),
    },
    paper : {
        background : theme.palette.background.default,
        overflow : "hidden",
        margin : theme.spacing(2),
        padding :theme.spacing(2)
    },
    Box : {
        background : theme.palette.background.default,
        alignItems : "center",
        textAlign : "center",
        padding : theme.spacing(1)
    }
}))

export default (props :any) => {

    if(!props.lang.code){
       setTimeout(() => store.dispatch(replace(`/guild/${props.guild.id}/langs`)))
        
    }
    

    const [Displayed,SetDisplayed] = React.useState([]);

    React.useEffect(() => {
       const _i = []
        for(const key in props.lang.translations) {
            _i.push({
                name : key,
                value : props.lang.translations[key],
            })
        }
        SetDisplayed(_i)
    },[props.lang])

    

    const classes = useStyles();

    const {t,i18n} = useTranslation()

    const row = (props) => {
        const {index,style} = props

        const item = Displayed[index]

        const [Value,setValue] = React.useState(item.value)

        const [isLoading,SetLoading] = React.useState(false)

        const [timeout,setTimeout_] = React.useState(null)

        const Update = () => {
            if(Value === "")return
            SetLoading(false)
        }

        const HandleChange = (e) => {

            setValue(e.target.value)

            clearTimeout(timeout || -1)
            
            SetLoading(true)
            setTimeout_(setTimeout(Update,2000))


        }

        return (
            <div style={style}>
                <Box 
                display="flex" 
                justifyContent="space-between" 
                className={classes.Box}
                >
                    <Typography 
                    variant='h6' 
                    className={classes.Title}
                    >
                        {item.name}
                    </Typography> 
                    <TextField 
                    onChange={HandleChange}
                    variant="outlined"
                    className={classes.Field}
                    value={Value} 
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
                </Box>
            </div>
        )
    }

    const handleSearch = (e) => {
        const d = []
        for(const key in props.lang.translations) {
            if(~key.indexOf(e.target.value) || e.target.value === ""){
                d.push({
                    name : key,
                    value : props.lang.translations[key],
                })
            }
        }
        SetDisplayed(d)
    }

    return (
        <div className={classes.box}>
            <Box >
                <Paper>
                <Paper className={classes.paper} variant="outlined" >
                    <Typography>
                        {t("SearchLangKeyTitle")}
                    </Typography>
                    <TextField 
                    style={{width : "100%"}}
                    onChange={handleSearch} 
                    />
                </Paper>
                    <span style={{height : Displayed[0] ? "auto" :"400px" }} />
                    {Displayed[0] && <FixedSizeList className={classes.ListU} height={400} width="100%" itemSize={80} itemCount={Displayed.length} >
                    {row}
                    </FixedSizeList>}
                </Paper>
            </Box>
        </div>
    )
}

