import { Grid, Grow, Switch } from "@material-ui/core"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography"
import { replace } from "connected-react-router"
import Paper from "@material-ui/core/Paper"
import * as React from "react"
import { useTranslation } from "react-i18next"
import { connect } from "react-redux"
import { store } from "../../app"
import CommandSettingValue from "./componements/CommandSettingValue"
import { SetCommandEnabled } from "../../../reducers/SyncData";

const handleData = (store) => {
    return store.SyncData.guilds.find(c => c.id === store.ChangeGuild.guild.id) || { noGuild: true }
}

const useStyle = makeStyles((theme: Theme) => createStyles({
    Grid: {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        margin: theme.spacing(1),
        border: theme.spacing(1)
    },
    list: {
        width: "100%"
    },
    field: {
        margin: theme.spacing(2),
    },
    paper: {
        width: "100%",
        height: "100%",
        background: theme.palette.background.default,
        padding: theme.spacing(2)
    }
}))

const EditCmd = (props: any) => {


    const { t, i18n } = useTranslation()
    const classes = useStyle()
    let command


    command = props.cmds.find(c => c.name === props.cmd_name)

    if (!command) {
        store.dispatch(replace('/guild/' + props.id))
        return null;
    }

    const [enabled, setEnabled] = React.useState(command.enabled)

    const [fade,setFade] = React.useState(false)

   React.useEffect(() => {
       setFade(true)

      return () => setFade(false)
   }, [])
   
    React.useEffect(() => {
        command = props.cmds.find(c => c.name === props.cmd_name)

        if (!command) {
            store.dispatch(replace('/guild/' + props.id))
            return null;
        }

    }, [props.cmds])







    const HandleDisable = async () => {

        const payload = await SetCommandEnabled({ ServerID: props.id, name: command.name, value: !enabled })
        store.dispatch(payload)
        setEnabled(!enabled);

    }
    return (
        <div>
            <Grow in={fade}>
                <div>
            <Typography variant="h2" >
                {t(`CommandName`, { cmd: command.name })}
            </Typography>
            <Grid container>
                {command.settings.settings.canBeDisabled && <Grid item xs={12} className={classes.Grid} >
                    <Typography variant="h3" >
                        {t('EnableCommand', { cmd: command.name })}
                    </Typography>
                    <Switch
                        checked={enabled}
                        onChange={HandleDisable}
                        color="secondary"

                    />
                </Grid>}
                <Grid item xs={12} className={classes.Grid} >
                    <Typography variant='h3'>
                        {t(`CommandSetting`, { cmd: command.name })}
                    </Typography>
                    <Grid container justify="space-around">
                        {command.settings.settings.data && Object.keys(command.settings.settings.data).map((value, key) => {
                            const params = command.settings.settings.data[value]
                            return (
                                <Grid  className={classes.field} item xs={5} key={key} >
                                    <Paper elevation={3} className={classes.paper}>
                                        <CommandSettingValue
                                            params={params}
                                            id={props.id}
                                            name={value}
                                            _cmdname={command.name}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
            </Grid>
            </div>
            </Grow>
        </div>
    )
}

export default connect(handleData)(EditCmd)