import * as React from "react"
import  { store } from "../../app"
import { push } from "connected-react-router"
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import { connect } from 'react-redux'
import AppBar from "../../Componements/appBar"
import { getPermission , hasPermission} from "../../../helper/permission"
import { Switch, Route} from "react-router-dom";
import UserPage from "./users"
import GroupPage from "./groups"
import ContactsIcon from '@material-ui/icons/Contacts';

const handleData = (store) => {
    return store.SyncData.guilds.find(c => c.id === store.ChangeGuild.guild.id) || { noGuild : true }
}

const pages = [{
    name : "Aperçu",
    permission : "panel.guild.see",
    url : `/`,
    icon : <DashboardIcon />
},{
    name : "Utilisateurs",
    permission : "panel.users.see",
    url : `/users`,
    icon : <PeopleIcon />
},
{
    name : "Groupes",
    permission : "panel.groups.see",
    url : `/groups`,
    icon : <ContactsIcon />
}]

const MainPageServer = props => {

    
    if(!props.noGuild){
       
    
    const perms = getPermission(props.me.id, props.id)

    const links = pages.filter(c => {
        if(hasPermission(c.permission, perms ) || !c.permission){
            return c;
        }
    })

    return (
        <div>
            <AppBar name={props.name} drawer={true} menu={links.map(c => {
                return {
                    action : () => {
                        store.dispatch(push(`/guild/${props.id}${c.url}`))
                       
                       store.dispatch(push(`/guild/${props.id}${c.url}`))
                },
                    name : c.name,
                    icon : c.icon
                }
            })} >
            
            <Switch >
                <Route path="/guild/:serverid/users">
                    {hasPermission("panel.users.see",perms) && <UserPage />}
                </Route>
                <Route path="/guild/:serverid/groups*">
                    {hasPermission("panel.groups.see",perms) && <GroupPage />}
                </Route>
            </Switch>
            
            </AppBar>
        </div>
    )
        }
    return null
}

export default connect(handleData)(MainPageServer)

