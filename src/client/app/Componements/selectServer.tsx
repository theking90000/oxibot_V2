import * as React from "react"
import Button from "@material-ui/core/Button"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux'
import { store } from "../app";
import { ACTIONS } from "../../reducers/ChangeGuild"
import { useParams } from "react-router-dom"

const ServersNames = store => {
  return { servers : store.SyncData.guilds,currServ : store.ChangeGuild.guild }
}

const SelectServer = (props) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };


    
    return (
        <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            {
            props.currServ.id === "" ? 
            "Choisir un serveur" : 
            props.servers.find(c => c.id === props.currServ.id).name
            }
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.servers.map((value,index) => (
          <MenuItem key={index} onClick={() => {handleClose();
            store.dispatch({ type : ACTIONS.SET_CURRENT_GUILD, payload : {id :value.id,url : store.getState().router.location.pathname }})
          }} >{value.name}</MenuItem>
        ))}
        {props.servers.length === 0 && 
          <MenuItem onClick={handleClose} >
           Aucun serveur disponible
            </MenuItem>
        }
      </Menu>
    </div>
    )
}

export default connect(ServersNames)(SelectServer)