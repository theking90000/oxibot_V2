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



type val = {
    name : string,
    value : any 
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
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
      background : theme.palette.background.default
    }
  }),
);



export default function Selector(props : 
    { 
        selected : val[],
        canAdd? : boolean,
        canRemove? : boolean,
        availables : val[]
        onChange : (type : 'ADD' | 'REMOVE', value : val ) => void;
        }) {
    
        const [selected, ModifySelected] = React.useState(props.selected);

        const [availables, ModifyAvailables] = React.useState(props.availables);

        const [isMenuOpen,SetMenuOpen] = React.useState(false)

        const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

        const [DisplayEd,setDisplayEd] = React.useState(props.availables)

        const classes = useStyles();

        var chipAdd;

        const handleDelete = (data : val) => {
            ModifySelected((state) => state.filter((datax) => datax !== data))
            ModifyAvailables((state) => {state.push(data);return state})
            setDisplayEd((state) => {state.push(data);return state})
            props.onChange('REMOVE', data)
        }

        const handleAdd = (data : val) => {
            ModifyAvailables((state) => state.filter((datax) => datax !== data))
            ModifySelected((state) => {state.push(data);return state})
            setDisplayEd((state) => state.filter((datax) => datax !== data))
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
        const { t, i18n } = useTranslation();

            return(
                <div>
                   <Box component="ul" className={classes.root}>
                    {selected.map((value,index) => (
                      <li key={index}>
                      {props.canRemove && <Chip
                        label={value.name}
                        onDelete={()=>handleDelete(value)}
                        className={classes.chip}
                      />}
                      {!props.canRemove && <Chip
                        label={value.name}   
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
                                    {DisplayEd[0] && <List className={classes.List}>
                                        {DisplayEd.map((value,index) => (
                                            <ListItem 
                                            onClick={(e) => {handleAdd(value)}} 
                                            key={index}
                                            className={classes.ListItem}
                                            >
                                                {value.name}
                                            </ListItem>
                                        ))}
                                    </List>}
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