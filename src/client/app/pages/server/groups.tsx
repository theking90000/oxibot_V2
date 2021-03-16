import * as React from "react"
import { connect } from 'react-redux'
import { store } from "../../app"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import { Switch, Route, Link,} from "react-router-dom";
import  Button  from "@material-ui/core/Button";
import { push, replace } from "connected-react-router";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card"
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import GroupInList from "./componements/groupInList";
import EditGroup from "./editGroup";
import { createMatchSelector } from 'connected-react-router';
import Typography from "@material-ui/core/Typography";
import { ACTIONS } from "../../../reducers/ChangeGuild";
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { CreateGroup, DeleteGroup } from "../../../reducers/SyncData";
import Request_Helper from "../../../helper/request";

const StoreHandler = storex => {

  const match = createMatchSelector({ path: '/guild/:serverid/groups' })(storex)
  const match2 = createMatchSelector({ path: '/guild/:serverid/groups/edit/:groupname' })(storex)
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
    AddGroup : {
      textAlign : "center"
    }
  }),
);

const GroupsPage = props => {
  if(props.error){
    return(
      <div>ERROR</div>
    )
  }
    const classes = useStyles()

    const [fade,setFade] = React.useState(false)
 
    const[NameValue,SetNameValue] = React.useState("") 

    const [NameError,SetNameError] = React.useState(false)

    React.useEffect(() => {
        setFade(true)
        
       return () => setFade(false)
    }, [])

    React.useEffect(() => {
      if(props.error)
      store.dispatch({type : ACTIONS.SET_GUILD_NONE});
  }, [props.error])



    const handleClick = () => {
      store.dispatch(push(path + "/test"))
    }

    

    const {t,i18n} = useTranslation()
    const path = !props.error ? `/guild/${props.guild.id}/groups` : ""

    const handleValueNameChange = (e) => {
      if(props.guild.groups.find(c => c.name === e.target.value))
      SetNameError(true)
      else
      SetNameError(false)
      if(e.target.value.match(/^[a-z-A-Z-0-9]{0,15}$/)){
        if(e.target.value.match(/^[a-z-A-Z-0-9]{0,2}$/)) SetNameError(true);
        else SetNameError(false)
        SetNameValue(e.target.value.toLowerCase())
      }
      if(e.target.value === "") SetNameError(false)
    }

    const handleCreateGroup = async (e) => {
      if(!NameValue.match(/^[a-z-A-Z-0-9]{3,15}$/) || props.guild.groups.find(c => c.name === NameValue)) return
      store.dispatch(await CreateGroup({ ServerID : props.guild.id,group : NameValue }))
      SetNameValue('')
    }

    const HandleDeleteGroup = async (event,value) => {
      store.dispatch(replace(`/guild/${props.guild.id}/groups`))   
      store.dispatch(await DeleteGroup({ ServerID : props.guild.id,group : value }))
      store.dispatch(replace(`/guild/${props.guild.id}/groups`))    
    }

    return(
        <div>
          <Switch>
          <Route path={`/guild/:serverid/groups/edit/:groupname`} >
            <Fade in={fade} >
              <React.Fragment>
                <Typography variant="h2" >
                  {t('EditGroupTitle',{groupname : props.params.params.groupname})}
                  <Button onClick={(e) => HandleDeleteGroup(e, props.params.params.groupname)} >
                      {t('DeleteGroupButton')}
                  </Button>
                  </Typography>
                <EditGroup  {...props} group={props.params.params.groupname} /*group={props.params.params.groupname}*/ />
              </React.Fragment>
            </Fade>
            </Route>
            <Route >
            <Fade in={fade} >
                <Grid container spacing={3} >
                  <Grid item xs={12}>
                    <Card >
                        <CardContent >
                            {props.guild.groups.length !== 0 &&  <List>
                              {props.guild.groups.map((item,index) => (
                                <GroupInList path={path} name={item.name} key={index} />
                              ))}
                            </List>}
                            {props.guild.groups.length === 0 && <Paper >
                            <Typography>{t('GroupListNoGroup')}</Typography>
                            </Paper>}
                        </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} >
                    <Card>
                        <CardContent className={classes.AddGroup} >
                          <Typography  variant="h3" >
                              {t('CreateGroupTitle')}
                          </Typography>
                              <TextField 
                              onChange={handleValueNameChange} 
                              value={NameValue} 
                              placeholder={NameError ? t('CreateGroupErrorNamePlaceholder') : t('CreateGroupNamePlaceholder')}
                               error={NameError}
                              />
                          <CardActions>
                            <Button onClick={handleCreateGroup} style={{marginLeft : "auto" }}>
                              {t('CreateGroupButton')}
                            </Button>
                          </CardActions>
                        </CardContent>
                    </Card>
                  </Grid>
                </Grid>
            </Fade>
            </Route>
            
          </Switch>
        </div>
    )
}

export default connect(StoreHandler)(GroupsPage)