import * as React from "react"
import Button from "@material-ui/core/Button"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux'
import { store } from "../app";
import { AvailableRessources } from "../../i18n"
import { useTranslation } from 'react-i18next';

export default props => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const HandleChangeL = (value : string) => {
        if(value === i18n.language) return handleClose()
        window.localStorage.setItem('oxibotV2_default_locales', value);
        window.location.reload()
    }

    const { t, i18n } = useTranslation();
    
    return (
        <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
         {t('SelectLanguage', {currentlang : t('name')})}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {AvailableRessources && AvailableRessources.sort(c => (c.lang === i18n.language ? -1 : 1)) && AvailableRessources.map((value,index) => (
            <MenuItem onClick={() => HandleChangeL(value.lang)} key={index} >
                {value.langname}
            </MenuItem>
        ))}
      </Menu>
    </div>
    )
}