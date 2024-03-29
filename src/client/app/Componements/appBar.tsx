import * as React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SelectServer from './selectServer';
import Button from "@material-ui/core/Button"
import { store } from '../app';
import { push } from "connected-react-router"
import {ACTIONS} from "../../reducers/ChangeGuild"
import { useTranslation } from 'react-i18next';
import SelectLang from './selectLang';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      background : "#212121"
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      backgroundColor : "#424242"
    },
    drawerPaper: {
      width: drawerWidth,

    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      maxWidth : "100%",
      height :"100%",
      overflow : "hidden",
      background : "#212121",
      padding : theme.spacing(3),
      marginLeft: -drawerWidth,
    },
    c :{
        marginLeft : 'auto'
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    Selectors : {
      display : "flex",
      flexDirection : "row-reverse"
    }
  }),
);



export default function PersistentDrawerLeft(props : {  
    children? : any,
    drawer? : boolean,
    name? : string,
    menu? : {
      name : string,
      action : (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
      icon? : JSX.Element
    }[],
    customLink? : JSX.Element[]
  }) {

    const [width, setWidth] = React.useState<number>(window.innerWidth);
    function handleWindowSizeChange() {
            setWidth(window.innerWidth);
        }
    React.useEffect(() => {
            window.addEventListener('resize', handleWindowSizeChange);

            setOpen((props.drawer && width >= 768) ? true : false)

            return () => {
                window.removeEventListener('resize', handleWindowSizeChange);
            }
        }, []);
    
 const handleDrawerCloseM = () => {
  setOpen((props.drawer && width >= 768) ? true : false)
 }

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { t, i18n } = useTranslation();
  console.log(t('MainTitle'))
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        style={{
            background: '#424242',
            color : 'white'
        }}
      >
        <Toolbar>
          {props.drawer && <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>}
          <Typography variant="h6" noWrap>
           {props.name || t("MainTitle")}
          </Typography>
          <Typography className={classes.c} variant="h6" noWrap>
            <div className={classes.Selectors} >
          <SelectServer />
          <SelectLang />
          </div>
          </Typography>
        </Toolbar>
      </AppBar>
       {props.drawer && <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Button onClick={() => store.dispatch(push('/'))} style={{marginRight : "auto"}} >
            {t('Back')}
          </Button>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {props.menu && props.menu.map((text, index) => (
            <ListItem button onClick={(e) => { handleDrawerCloseM();text.action(e)}} key={index}>
              {text.icon && <ListItemIcon> {text.icon}</ListItemIcon>}
              <ListItemText primary={text.name} />
            </ListItem>
          ))}
          {props.customLink && <React.Fragment>
            {props.customLink.map((value,index) =>(
              <React.Fragment key={index} >
                {value}
              </React.Fragment>
            ))}
          </React.Fragment>}
        </List>
      </Drawer>}
      <main 
      style={{
        width : "100%",
        height :"100%",
        background : "#212121"
      }}
        className={props.drawer ? clsx(classes.content, {[classes.contentShift]: open,}) : clsx(classes.content, {[classes.contentShift]: true,})} 
      >
        <div className={classes.drawerHeader}
          style={open ? {} : {background : "#212121"}}
        />
         { props.children }
      </main>
    </div>
  );
}