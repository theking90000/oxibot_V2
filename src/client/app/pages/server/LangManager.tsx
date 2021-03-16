import * as React from "react";
import {connect} from "react-redux"
import { createMatchSelector, replace } from 'connected-react-router';
import {Route, Switch} from "react-router-dom"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { store } from "../../app"
import { ACTIONS } from "../../../reducers/ChangeGuild";
import { useTranslation } from "react-i18next";
import  Fade  from "@material-ui/core/Fade";
import { Button, Card, CardContent, Grid, List, Paper, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography"
import LangInList from "./componements/LangInList";
import CardActions  from "@material-ui/core/CardActions";
import { create_remove_langage } from "../../../reducers/SyncData";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import EditLang from "./EditLang";


const StoreHandler = storex => {

    const match = createMatchSelector({ path: '/guild/:serverid/langs' })(storex)
    const match2 = createMatchSelector({ path: '/guild/:serverid/langs/:code' })(storex)
    const p :any = match2 || match
    if(!p || !storex.SyncData.guilds.find(c => c.id === storex.ChangeGuild.guild.id)) return { error : true }
  
    return {guild : storex.SyncData.guilds.find(c => c.id === storex.ChangeGuild.guild.id), params : p} || { error : true }
  
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

    if(props.error){
      return(
        <div>ERROR</div>
      )
    }
   

    const classes = useStyles()

    const [fade,setFade] = React.useState(false)

      //if(props.error)
      //store.dispatch({type : ACTIONS.SET_GUILD_NONE});
  

    const[NameValue,SetNameValue] = React.useState({
      name : "",code : "",
      selected : !props.error ? props.guild.availableslangs[0] : ""
    }) 

    const [NameError,SetNameError] = React.useState(false)

    React.useEffect(() => {
        setFade(true)
        
       return () => setFade(false)
    }, [])

    



    const handleValueNameChange = (e) => {
        if(props.guild.groups.find(c => c.name === e.target.value))
        SetNameError(true)
        else
        SetNameError(false)
        if(e.target.value.match(/^[a-z-A-Z-0-9]{0,15}$/)){
          if(e.target.value.match(/^[a-z-A-Z-0-9]{0,1}$/)) SetNameError(true);
          else SetNameError(false)
          SetNameValue(state=> ({...state, name :e.target.value}))
        }
        if(e.target.value === "") SetNameError(false)
      }

      const handleValueCodeChange = (e) => {
        if(props.guild.groups.find(c => c.name === e.target.value))
        SetNameError(true)
        else
        SetNameError(false)
        if(!e.target.value.match(/^[a-z]{2}-[A-Z]{2}$/)){
            SetNameError(true)
        }else SetNameError(false)
        if(e.target.value === "") SetNameError(false)
        SetNameValue(state=> ({...state, code :e.target.value}))
      }
  
      const handleCreateLang = async (e) => {
        if(!NameValue.name.match(/^[a-z-A-Z-0-9]{1,15}$/) || !NameValue.code.match(/^[a-z]{2}-[A-Z]{2}$/) || props.guild.groups.find(c => c.name === NameValue)) return
        store.dispatch(await create_remove_langage({ 
            ServerID : props.guild.id,
            code :NameValue.code,
            name : NameValue.name,
            action : "CREATE",
            template : NameValue.selected
         })) 
        SetNameValue(state => ({...state,name : "",code :""}))
      }
  
      const HandleSelect = (e ) => {
        SetNameValue(state => ({...state,selected : e.target.value}))
      }

      const HandleDeleteLang = async (event,value) => {
        store.dispatch(replace(`/guild/${props.guild.id}/langs`))   
        store.dispatch(await create_remove_langage({ 
          ServerID : props.guild.id,
          code : value,
          name : props.guild.customslangs.find(x => x.code ===value).name,
          action : "DELETE",
       })) 
        store.dispatch(replace(`/guild/${props.guild.id}/langs`))    
      }

    
    const path = !props.error ? `/guild/${props.guild.id}/langs` : ""

    const {t,i18n} = useTranslation()
    return (
        <div>
            <Switch>
            <Route path={`/guild/:serverid/langs/:code`} >
             <Fade in={fade} >
              <React.Fragment>
                <Typography style={{width : "100%"}} variant="h2" >
                  {t('EditLangTitle',{
                    langcode : props.params.params.code,
                    langname : props.guild.customslangs.find(x => x.code === props.params.params.code) ? props.guild.customslangs.find(x => x.code === props.params.params.code).name : ""
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
                <EditLang  {...props} lang={props.guild.customslangs.find(x => x.code === props.params.params.code) ? props.guild.customslangs.find(x => x.code === props.params.params.code) : {}}  />
              </React.Fragment>
            </Fade>
            </Route>
                <Route>
                    <Fade in={fade}>
                        <React.Fragment>
                        <Grid container spacing={3} >
                  <Grid item xs={12}>
                    <Card >
                        <CardContent >
                            {props.guild.customslangs.length !== 0 &&  <List>
                              {props.guild.customslangs.map((item,index) => (
                                <LangInList path={path} name={item.name} code={item.code} key={index} />
                              ))}
                            </List>}
                            {props.guild.customslangs.length === 0 && <Paper >
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
                  </Grid>
                        </React.Fragment>
                    </Fade>
                </Route>
            </Switch>
        </div>
    )
}

export default connect(StoreHandler)(LangManagerPage)