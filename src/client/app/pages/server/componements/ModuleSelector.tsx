import * as React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useTranslation } from "react-i18next";
import { store } from "../../../app";
import { push } from "connected-react-router";
import ViewModuleIcon from '@material-ui/icons/ViewModule';

export default (props : {
    cmds : {
        name : string,
        url : string,
    }[],
    guildid : string,
}) => {

    const [open, setOpen] = React.useState(false);

    const {t,i18n} = useTranslation()

    const handleClick = () => {
        setOpen(!open);
      };

      const handleURL = (url) => {
          store.dispatch(push(url))
      }

    return (
        <React.Fragment>
    <ListItem button onClick={handleClick}>
        <ListItemIcon><ViewModuleIcon /></ListItemIcon>
        <ListItemText primary={t('ModulesNameTitle')} />
        {open ? <ExpandLess /> : <ExpandMore />}
    </ListItem>

    <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            {props.cmds.map((cmd,index) => (
                <ListItem button key={index} onClick={() => handleURL(`/guild/${props.guildid}${cmd.url}`)}>
                 <ListItemText primary={cmd.name} />
            </ListItem>
            ))}
        </List>

    </Collapse>
    </React.Fragment>
    )
}