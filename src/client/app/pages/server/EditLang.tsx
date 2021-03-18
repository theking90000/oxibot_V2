import * as React from "react";
import {FixedSizeList } from "react-window"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper"
import Box from "@material-ui/core/Box"
import { useTranslation } from "react-i18next";
import { CircularProgress, MenuItem, Select, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { store } from "../../app";
import { replace } from "connected-react-router";
import CheckIcon from "@material-ui/icons/Check"
import { add_remove_forcedchannels, set_custom_lang_value } from "../../../reducers/Translations";
import { connect } from "react-redux";
import { ACTIONS } from "../../../reducers/Channels";
import Selector from "./componements/Selector";

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

const MapStateToProps = state => {
    const channels = state.Channels.find(c => c.id === state.ChangeGuild.guild.id)
    if (channels)
        return { channels: channels.channels };
    else
        store.dispatch({ type: ACTIONS.FETCH_GUILD, payload: { guild: state.ChangeGuild.guild.id } })

    return { channels: null }
}

const __elem = (props: any) => {

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

    const row = (props_) => {
        const { index, style } = props_

        const item = Displayed[index]

        const [Value,setValue] = React.useState(item.value)

        const [isLoading,SetLoading] = React.useState(false)

        const [timeout,setTimeout_] = React.useState(null)

        const [Channels, SetChannels] = React.useState([])

        const Update = async (val) => {
            if(Value === "")return

            store.dispatch(await set_custom_lang_value({
                ServerID: props.guild.id,
                key: item.name,
                value: val,
                code: props.lang.code
            }))
            SetLoading(false)
        }

        const HandleChange = (e) => {

            setValue(e.target.value)

            clearTimeout(timeout || -1)
            
            SetLoading(true)
            setTimeout_(setTimeout(() => Update(e.target.value), 2000))


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

    const handleChannelChange = async (type: "ADD" | "REMOVE", data) => {
        store.dispatch(await add_remove_forcedchannels({
            ServerID: props.guild.id,
            action: type,
            channel: data.value,
            code: props.lang.code
        }))
    }

    return (
        <div>
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
            <Box >
                <Paper className={classes.paper} style={{}}>
                    <Typography variant="h5">
                        {t("ForcedChannelLang")}
                    </Typography>

                    {!props.channels && <CircularProgress />}
                    <div>
                        {props.channels && <Selector
                            selected={(props.lang.forcedChannels && props.lang.forcedChannels.length > 0) ? props.lang.forcedChannels.map(ch => {
                                const c = props.channels.find(chx => chx.id === ch);
                                if (c)
                                    return ({
                                        name: c.name,
                                        elem: (<span style={{ fontStyle: "italic" }} >#{c.name}</span>),
                                        value: c.id
                                    })
                            }) : []}
                            availables={props.channels.filter(x => x.type === "text" && (props.lang.forcedChannel && !props.lang.forcedChannels.includes(x.id))).map((c, index) => {

                                return ({
                                    name: c.name,
                                    elem: (<span style={{ fontStyle: "italic" }} >#{c.name}</span>),
                                    value: c.id
                                })
                            }
                            )}
                            onChange={handleChannelChange}
                            canAdd={true}
                            canRemove={true}
                        />}
                    </div>
                </Paper>
            </Box>
        </div>
    )
}

export default connect(MapStateToProps)(__elem)