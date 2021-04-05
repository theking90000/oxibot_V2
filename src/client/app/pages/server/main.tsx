import * as React from "react"
import  { store } from "../../app"
import { push } from "connected-react-router"
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import { connect } from 'react-redux'
import AppBar from "../../Componements/appBar"
import { getPermission , hasPermission} from "../../../helper/permission"
import { Switch, Route} from "react-router-dom";
import UserPage from "./users"
import SettingsPage from "./Settings"
import GroupPage from "./groups"
import ContactsIcon from '@material-ui/icons/Contacts';
import { ACTIONS } from "../../../reducers/ChangeGuild";
import { useTranslation } from 'react-i18next';
import CommandsSelector from "./componements/CommandsSelector";
import EditCommand from "./EditCommand";
import TranslateIcon from '@material-ui/icons/Translate';
import LangManager from "./LangManager";
import ModuleSelector from "./componements/ModuleSelector";
import EditModule from "./EditModule";

const handleData = (store) => {
    return store.SyncData.guilds.find(c => c.id === store.ChangeGuild.guild.id) || { noGuild : true }
}



const MainPageServer = props => {
    if(props.noGuild){
        return(
          <div>ERROR</div>
        )
      }
    const { t, i18n } = useTranslation();

    const pages = [{
    name : t('ServerPreview'),
    permission : "panel.guild.see",
    url : `/`,
    icon : <DashboardIcon />
    },{
    name : t('UserList'),
    permission : "panel.users.see",
    url : `/users`,
    icon : <PeopleIcon />
    },
    {
    name : t('GroupsList'),
    permission : "panel.groups.see",
    url : `/groups`,
    icon : <ContactsIcon />
    },
    {
    name : t('SettingsList'),
    permission : "panel.settings.see",
    url : `/settings`,
    icon : <SettingsIcon />
    },
    {
    name : t('CustomLangList'),
    permission : "panel.customlangs.see",
    url : `/langs`,
    icon : <TranslateIcon />
    }]
    
    if(!props.noGuild){
    const perms = getPermission(props.me.id, props.id)
    const links = pages.filter(c => {
        if(hasPermission(c.permission, perms ) || !c.permission){
            return c;
        }
    })
    const CmdList = []
    if(props.cmds)
    for(const cmds of props.cmds){
        CmdList.push({
            name : cmds,
            url : `/commands/${cmds}`,
        })
    }

    const ModuleList = []
    if(props.modules)
    for(const module of props.modules){
        ModuleList.push({
            name : module,
            url :`/module/${module}`
        })
    }

    const customLinks = []

    if(CmdList[0]){
        customLinks.push(<CommandsSelector cmds={CmdList} guildid={props.id} />)
    }
    if(ModuleList[0]){
        customLinks.push(<ModuleSelector cmds={ModuleList} guildid={props.id} />)
    }
    return (
        <div>
            <AppBar name={props.name} drawer={true} menu={links.map(c => {
                return {
                    action : () => {
                        if(store.getState().router.location.pathname !== `/guild/${props.id}${c.url}`)
                        store.dispatch(push(`/guild/${props.id}${c.url}`))
                },
                    name : c.name,
                    icon : c.icon
                }
            })}
            customLink={customLinks}
            >
            
            <Switch >
                <Route path="/guild/:serverid/users">
                    {hasPermission("panel.users.see",perms) && <UserPage />}
                </Route>
                <Route path="/guild/:serverid/groups*">
                    {hasPermission("panel.groups.see",perms) && <GroupPage />}
                </Route>
                <Route path="/guild/:serverid/settings*">
                    {hasPermission('panel.settings.see',perms) && <SettingsPage  />}
                </Route>
                <Route path="/guild/:serverid/langs">
                    {hasPermission('panel.customlangs.see', perms) && <LangManager />}
                </Route>
                {CmdList[0] && CmdList.map((value,key) => (
                    <Route key={key} path={`/guild/${props.id}${value.url}`}>
                        {hasPermission('panel.commands.edit',perms) && <EditCommand {...props} cmd_name={value.name} />}
                    </Route>
                ))}
                {ModuleList[0] && ModuleList.map((value,key) => (
                    <Route key={key} path={`/guild/${props.id}${value.url}`}>
                        {hasPermission('panel.commands.edit',perms) && <EditModule {...props} module_name={value.name} />}
                    </Route>
                ))}
            </Switch>
            
            </AppBar>
        </div>
    )
        }
    store.dispatch({type : ACTIONS.SET_GUILD_NONE})
    return (<div>Error...</div>)
   
}

export default connect(handleData)(MainPageServer)

