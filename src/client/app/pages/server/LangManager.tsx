import * as React from "react";
import {connect} from "react-redux"
import { createMatchSelector, replace } from 'connected-react-router';
import {Route, Switch} from "react-router-dom"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { store } from "../../app"
import { ACTIONS, set_default_lang } from "../../../reducers/Translations";
import { useTranslation } from "react-i18next";
import  Fade  from "@material-ui/core/Fade";
import { Button, Card, CardContent, CircularProgress, Grid, Grow, List, Paper, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography"
import LangInList from "./componements/LangInList";
import CardActions  from "@material-ui/core/CardActions";
import { create_remove_langage } from "../../../reducers/Translations";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import EditLang from "./EditLang";

const payloads = []

const StoreHandler = storex => {

    if(!storex.Translations.find(x => x.id === storex.ChangeGuild.guild.id) && !payloads.includes(storex.ChangeGuild.guild.id)){
      setTimeout(() => store.dispatch({ type: ACTIONS.FETCH_GUILD, payload: { guild: storex.ChangeGuild.guild.id } }))
      payloads.push(storex.ChangeGuild.guild.id)
    }

    const match = createMatchSelector({ path: '/guild/:serverid/langs' })(storex)
    const match2 = createMatchSelector({ path: '/guild/:serverid/langs/:code' })(storex)
    const p :any = match2 || match
    if(!p || !storex.SyncData.guilds.find(c => c.id === storex.ChangeGuild.guild.id)) return { error : true }
    const _l = storex.Translations.find(x => x.id === storex.ChangeGuild.guild.id)
    return {customslangs : (_l &&_l.translations) ? _l.translations : null ,guild : storex.SyncData.guilds.find(c => c.id === storex.ChangeGuild.guild.id), params : p} || { error : true }
  
  }

  const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    ok: {
        background : theme.palette.background.default,
        padding : theme.spacing(1)
    },
    AddGroup : {
      textAlign : "center"
    }
  }),
);

  
const LangManagerPage = (props) => {

  if (props.error) {
    return (
      <div>ERROR</div>
    )
  }
   

  const classes = useStyles()

  const [fade, setFade] = React.useState(false)

  //if(props.error)
  //store.dispatch({type : ACTIONS.SET_GUILD_NONE});
  

  const [NameValue, SetNameValue] = React.useState({
    name: "", code: "",
    selected: !props.error ? props.guild.availableslangs[0] : ""
  })

  const [NameError, SetNameError] = React.useState(false)

  React.useEffect(() => {
    setFade(true)
        
    return () => setFade(false)
  }, [])

    



  const handleValueNameChange = (e) => {
    if (props.guild.groups.find(c => c.name === e.target.value))
      SetNameError(true)
    else
      SetNameError(false)
    if (e.target.value.match(/^[a-z-A-Z-0-9]{0,15}$/)) {
      if (e.target.value.match(/^[a-z-A-Z-0-9]{0,1}$/)) SetNameError(true);
      else SetNameError(false)
      SetNameValue(state => ({ ...state, name: e.target.value }))
    }
    if (e.target.value === "") SetNameError(false)
  }

  const handleValueCodeChange = (e) => {
    if (props.guild.groups.find(c => c.name === e.target.value))
      SetNameError(true)
    else
      SetNameError(false)
    if (!e.target.value.match(/^[a-z]{2}-[A-Z]{2}$/)) {
      SetNameError(true)
    } else SetNameError(false)
    if (e.target.value === "") SetNameError(false)
    SetNameValue(state => ({ ...state, code: e.target.value }))
  }
  
  const handleCreateLang = async (e) => {
    if (!NameValue.name.match(/^[a-z-A-Z-0-9]{1,15}$/) || !NameValue.code.match(/^[a-z]{2}-[A-Z]{2}$/) || props.guild.groups.find(c => c.name === NameValue)) return
    store.dispatch(await create_remove_langage({
      ServerID: props.guild.id,
      code: NameValue.code,
      name: NameValue.name,
      action: "CREATE",
      template: NameValue.selected
    }))
    SetNameValue(state => ({ ...state, name: "", code: "" }))
  }
  
  const HandleSelect = (e) => {
    SetNameValue(state => ({ ...state, selected: e.target.value }))
  }

  const HandleDeleteLang = async (event, value) => {
    store.dispatch(replace(`/guild/${props.guild.id}/langs`))
    store.dispatch(await create_remove_langage({
      ServerID: props.guild.id,
      code: value,
      name: props.customslangs.find(x => x.code === value).name,
      action: "DELETE",
    }))
    store.dispatch(replace(`/guild/${props.guild.id}/langs`))
  }
  const [DefaultLang, SetDefaultLang] = React.useState(false)

  React.useEffect(() => {
    if (props.customslangs && props.customslangs[0]) {
      SetDefaultLang((props.customslangs.length > 0 && props.customslangs.find(x => x.default === true)) ? props.customslangs.find(x => x.default === true).code : false)
    }
  }, [props.customslangs])

  const HandleDefaultChange = async (e) => {
    if (e.target.value !== DefaultLang) {
      store.dispatch(await set_default_lang({
        ServerID: props.guild.id,
        code: e.target.value
      }))
      SetDefaultLang(e.target.value)
    }
  }
    
    const path = !props.error ? `/guild/${props.guild.id}/langs` : ""

    const {t,i18n} = useTranslation()
    return (
        <div>
          {!props.customslangs && <CircularProgress />}
            {props.customslangs && <Switch>
            <Route path={`/guild/:serverid/langs/:code`} >
             <Grow in={fade} >
               <div>
              <React.Fragment>
                <Typography style={{width : "100%"}} variant="h2" >
                  {t('EditLangTitle',{
                    langcode : props.params.params.code,
                    langname : props.customslangs.find(x => x.code === props.params.params.code) ? props.customslangs.find(x => x.code === props.params.params.code).name : ""
                    })}
                  <Button style={{
                    marginBottom : "auto",
                    marginTop : "auto", 
                    float : "right",
                    textAlign : "center"
                    }}
                    onClick={(e) => HandleDeleteLang(e, props.params.params.code)} 
                    >
                      {t('DeleteGroupButton')}
                  </Button>
                  </Typography>
                <EditLang  {...props} lang={props.customslangs.find(x => x.code === props.params.params.code) ? props.customslangs.find(x => x.code === props.params.params.code) : {}}  />
              </React.Fragment>
              </div>
            </Grow>
            </Route>
                <Route>
                    <Grow in={fade}>
                      <div>
                        <React.Fragment>
                        <Grid container spacing={3} >
                  <Grid item xs={12}>
                    <Card >
                        <CardContent >
                            {props.customslangs.length !== 0 &&  <List>
                              {props.customslangs.map((item,index) => (
                                <LangInList path={path} name={item.name} code={item.code} key={index} />
                              ))}
                            </List>}
                            {props.customslangs.length === 0 && <Paper >
                            <Typography className={classes.ok} >{t('LangListNoLang')}</Typography>
                            </Paper>}
                        </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} >
                    <Card>
                        <CardContent className={classes.AddGroup} >
                          <Typography  variant="h3" >
                              {t('CreateLangTitle')}
                          </Typography>
                              <TextField
                              onChange={handleValueNameChange} 
                              value={NameValue.name} 
                              placeholder={NameError ? t('CreateLangErrorNamePlaceholder') : t('CreateLangNamePlaceholder')}
                               error={NameError}
                              />
                              <TextField
                              onChange={handleValueCodeChange} 
                              value={NameValue.code} 
                              placeholder={NameError ? t('CreateLangErrorCodePlaceholder') : t('CreateLangCodePlaceholder')}
                               error={NameError}
                              />
                              <Select 
                              value={NameValue.selected}
                              onChange={HandleSelect}
                              >
                                  {props.guild.availableslangs && props.guild.availableslangs.map((c,index) => (
                                      <MenuItem key={index} value={c}>{c}</MenuItem>
                                  ))}
                              </Select>
                          <CardActions>
                            <Button onClick={handleCreateLang} style={{marginLeft : "auto" }}>
                              {t('CreateGroupButton')}
                            </Button>
                          </CardActions>
                        </CardContent>
                    </Card>
                    </Grid>
                    <Grid item xs={6} >
                      <Card>
                        <CardContent>
                          <Typography variant="h3" >
                            {t('SelectDefaultLang')}
                          </Typography>
                          {props.customslangs.length > 0 && <Select
                            onChange={HandleDefaultChange}
                            value={DefaultLang} >
                            {props.customslangs.map((c, key) => (
                              <MenuItem key={key} value={c.code} >{c.name}</MenuItem>
                            ))}
                          </Select>}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                        </React.Fragment>
                        </div>
                    </Grow>
                </Route>
            </Switch>}
        </div>
    )
}

export default connect(StoreHandler)(LangManagerPage)