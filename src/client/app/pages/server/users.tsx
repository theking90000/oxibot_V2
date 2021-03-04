import * as React from "react"
import { connect } from 'react-redux'
import { store } from "../../app"
import { replace } from "connected-react-router"
import User from "./componements/user"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';


const StoreHandler = store => {

    return store.SyncData.guilds.find(c => c.id === store.ChangeGuild.guild.id) || { noGuild : true }

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

const UserPage = props => {

    const classes = useStyles()

    if(props.noGuild){
        store.dispatch(replace("/"))
        return (<div>null</div>)
     }

    return(
        <div>
            <div>
                <List >
            {props.members.users.map((c,index) => {
                const group = { availables : [], selected : []}
                props.groups.forEach((cx,index) => {
                    if(c.groups.includes(cx.name)){
                        group.selected.push({name : cx.name,value : index })
                    }else{
                        group.availables.push({name : cx.name,value : index })
                    }
                }) 

                return (
                <User  
                groups={group.selected}  
                availablegroups={group.availables} 
                key={index} 
                name={c.tag} 
                url={c.avatarUrl} 
                id={c.id} />
            )})}
                </List>
            </div>
        </div>
    )
}

export default connect(StoreHandler)(UserPage)