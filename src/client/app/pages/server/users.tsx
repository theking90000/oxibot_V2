import * as React from "react"
import { connect } from 'react-redux'
import { store } from "../../app"
import { replace } from "connected-react-router"
import User from "./componements/user"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Grow from '@material-ui/core/Grow';
import { getPermission } from "../../../helper/permission"
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';


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
      width : '100%',
      height : "100%"
    },
    elem : {
        display :"flex",
        flexDirection : "column",
        width : '100%',
      height : "100%"
    },
    list : {
        height: "100%",
        display : "block",
        overflowY : "auto",
    },
    parentList : {
        height : "50%",
        position: "relative",
        width : "100%"
    },
    search : {
        width :'100%'
    }
  }),
);

const UserPage = props => {

    const classes = useStyles()

    const [display,SetDisplay] = React.useState(props.members.users)

    if(props.noGuild){
        store.dispatch(replace("/"))
        return (<div>null</div>)
     }

     const [fade,setFade] = React.useState(false)
 
     const perms = getPermission(props.me.id, props.id)

    React.useEffect(() => {
        setFade(true)

       return () => setFade(false)
    }, [])

    

    const handleSearch = (e) => {
        const d = []
        for (const u of props.members.users){
          if(~u.tag.indexOf(e.target.value) || (u.nickname && ~u.nickname.indexOf(e.target.value)) || e.target.value === "" ) d.push(u)
        }
        SetDisplay(d);
      }

      React.useEffect( () => {
        SetDisplay(props.members.users)
    }, [props.members.users])

    const { t, i18n } = useTranslation();

    return(
        <div className={classes.root}>
            <Grow in={fade} >
            <div className={classes.elem}>
            <div >
                <TextField autoFocus label={t("SearchUserPlaceholder", {counter : display.length})} onChange={handleSearch} className={classes.search} />
            </div>
            <div className={classes.parentList}>
                <List className={classes.list}>
            {display.map((c,index) => {
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
                perms={perms} 
                pseudo={c.nickname}
                id={c.id} />
            )})}
                </List>
            </div>
            </div>
            </Grow>
        </div>
    )
}

export default connect(StoreHandler)(UserPage)