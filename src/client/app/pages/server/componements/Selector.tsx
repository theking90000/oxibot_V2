import * as React from "react";
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import {FixedSizeList} from "react-window"
import { Divider } from "@material-ui/core";


type val = {
    name : string,
    elem? : JSX.Element,
    value : any 
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    selector : {
      width : "250px",
      height : "290px",
      display : "flex",
      flexDirection : "column",
      alignItems : "center",
    },
    List : {
      width : "100%",
      fontSize : theme.typography.h6.fontSize,
      overflowY : 'auto',
      cursor : "pointer",
    },
    ListItem : {
      background : theme.palette.background.paper,
      borderColor : theme.palette.primary.dark,
      borderTop : "1px solid",
      borderBottom : "1px solid",
      padding : "2px",
      "&:hover" : {
        background : theme.palette.background.default
      }
    }
  }),
);



export default function Selector(props : 
    { 
        selected : val[],
        canAdd? : boolean,
        canRemove? : boolean,
        availables : val[]
        onChange? : (type : 'ADD' | 'REMOVE', value : val, ) => void;
        onChangeCancelable? : (type : 'ADD' | 'REMOVE', value : val, cancel :(b : boolean) => void) => void;
        }) {
    
        const [selected, ModifySelected] = React.useState(props.selected);

        const [availables, ModifyAvailables] = React.useState(props.availables);

        const [isMenuOpen,SetMenuOpen] = React.useState(false)

        const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

        const [DisplayEd,setDisplayEd] = React.useState(props.availables)

        const classes = useStyles();

        var chipAdd;

        const handleDelete = async (data : val) => { 
          if(props.onChangeCancelable){
            if(await new Promise(async promise => {
              props.onChangeCancelable("REMOVE", data,(boolean) => {

                promise(boolean);
              })}))return
          }  
            ModifySelected((state) => state.filter((datax) => datax !== data))
            ModifyAvailables((state) => {state.push(data);return state})
            setDisplayEd((state) => {state.push(data);return state})
            if(props.onChange)
            props.onChange('REMOVE', data)
        }

        const handleAdd = async (data : val) => {
          if(props.onChangeCancelable){
            if(await new Promise(async promise => {
              props.onChangeCancelable("ADD", data,(boolean) => {

                promise(boolean);
              })})) return
          }  
            ModifyAvailables((state) => state.filter((datax) => datax !== data))
            ModifySelected((state) => {state.push(data);return state})
            setDisplayEd((state) => state.filter((datax) => datax !== data))
            if(props.onChange)
            props.onChange('ADD', data)
        }

        
        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
          SetMenuOpen((state) => !state)
        }

        const handleClickAway =() => {
          SetMenuOpen(false)
        }

        const handleSearch = (e) => {
          const d = []
          for (const group of availables){
            if(~group.name.indexOf(e.target.value) || e.target.value === "") d.push(group)
          }
          setDisplayEd(d)

        }

        const children = props_=> {
          const { index, style } = props_;
          const value = DisplayEd[index]
          return (
          <ListItem 
            style={style}
            onClick={(e) => {handleAdd(value)}} 
            className={classes.ListItem}
            >
                {value.elem || value.name}
            </ListItem>)
        }

        const { t, i18n } = useTranslation();

            return(
                <div>
                   <Box component="ul" className={classes.root}>
                    {selected.map((value,index) => (
                      <li key={index}>
                      {props.canRemove && <Chip
                        label={value.elem || value.name}
                        onDelete={()=>handleDelete(value)}
                        className={classes.chip}
                      />}
                      {!props.canRemove && <Chip
                        label={value.elem || value.name}
                        className={classes.chip}
                      />}
                    </li>  
                    ))}
                    
                    {props.canAdd &&<li >
                       <Chip 
                          label={<AddCircleOutlineIcon />}
                          className={classes.chip}
                          onClick={handleClick}
                          ref={c => chipAdd = c}
                          />
                      <React.Fragment>
                      <Popper
                        placement="bottom"
                        open={isMenuOpen}
                        anchorEl={anchorEl}    
                        transition
                        style={{zIndex : 9999}}                       
                      >
                        {({ TransitionProps }) => (
                          <ClickAwayListener onClickAway={handleClickAway}>
                            <Paper 
                            elevation={3}
                            className={classes.selector}
                            >
                                    <div>
                                    <TextField 
                                    autoFocus
                                    label={availables[0] ? t('SelectorSearch') : t('SelectorSearchNoMatch')} 
                                    onChange={handleSearch}
                                    disabled={!availables[0]} />
                                    </div>
                                    {DisplayEd[0] && 
                                    <FixedSizeList 
                                    width="100%" 
                                    height={290} 
                                    itemCount={DisplayEd.length} 
                                    className={classes.List} 
                                    itemSize={45}
                                    >
                                        {children}
                                    </FixedSizeList>}
                                </Paper>
                            </ClickAwayListener>
                        )}
                          </Popper>
                          </React.Fragment>
                      </li>}
                    </Box>
                </div>            
            )

}