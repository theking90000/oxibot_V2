import Switch  from "@material-ui/core/Switch";
import CircularProgress  from "@material-ui/core/CircularProgress";
import * as React from "react"
import { useTranslation } from "react-i18next"
import { update_data } from "../../../../reducers/Modules";
import { Button, Menu, MenuItem, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import RolesSelector from "./RolesSelector";
import AdvancedSettings from "./AdvancedSettings";

export default function (props : {module : string,id: string,meta?,name : string,value, type : string}) {
 
    const [tmpVal ,SettmpVal] = React.useState(props.value)

    const handleRoleChange = async (type , role)=> {
        var t = tmpVal;
        if(type === "ADD"){
            t=[...tmpVal,role.id]
            SettmpVal([...tmpVal,role.id])
        }
        if(type === "REMOVE"){
            t=tmpVal.filter(x => x !== role.id)
            SettmpVal(tmpVal.filter(x => x !== role.id))
        }
        await update_data({
            guild : props.id,
            path: props.name,
            name : props.module,
            type : props.type,
            value : t
        })
    }

    switch (props.type) {
      case "boolean": {
        return <Boolean {...props} />;
      }
      case "string": {
        return <String {...props} />;
      }
      case "number": {
        return <Number {...props} />;
      }
      case "choice": {
        return <Choice {...props} />;
      }
      case "role": {
        return (
          <div>
            <Typography>{props.name} </Typography>
            <RolesSelector
              max={props.meta && props.meta.max ? props.meta.max : null}
              min={props.meta && props.meta.min ? props.meta.min : null}
              default={props.value || []}
              onChange={handleRoleChange}
            />
          </div>
        );
      }
        case "AdvancedSetting": {
        return (<AdvancedSettings {...props} page={true}  />)
      }
      default: {
        return <div>error</div>;
      }
    }
}

export function Boolean(props){
    
    const {t,i18n} = useTranslation();
    const [value,setValue] = React.useState(props.value)

    const [timeout,SetTimeout] = React.useState(null)

    const send_data = async () => {
        
        await update_data({
            guild : props.id,
            path: props.name,
            name : props.module,
            type : props.type,
            value : !value
        })
        clearTimeout(timeout)
        SetTimeout(null)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setValue(checked)
      if (props.onChange) {
        return props.onChange(!checked);
      }
        clearTimeout(timeout)
        SetTimeout(setTimeout(send_data,2000))
    }

    return(
    <div style={{
        display:"flex",
        flexDirection : "row",
        justifyContent : "space-between",
        alignItems : "center"
    }}>
        <div>
        <Typography >
                {props.name}
            </Typography>
        <Switch 
        checked={value}
        onChange={handleChange}
        />
        </div>
        {timeout && <CircularProgress />}
    </div>
    )
}

export function String(props) {

    const {t,i18n} = useTranslation();
    const [timeout,SetTimeout] = React.useState(null)

    const send_data = async (val) => {
          await update_data({
            guild: props.id,
            path: props.name,
            name: props.module,
            type: props.type,
            value: val,
          });
        clearTimeout(timeout)
        SetTimeout(null)
    }

    const handleChange = (event) => {

      clearTimeout(timeout)
      if (props.onChange) {
        return props.onChange(event.target.value);
      }
        SetTimeout(setTimeout(()=>send_data(event.target.value),2000))
    }

    return(
        <div style={{
            display:"flex",
            flexDirection : "row",
            justifyContent : "space-between",
            alignItems : "center"
        }}><div style={{width : "100%"}}>
            <Typography >
                {props.name}
            </Typography>
            <TextField
            fullWidth
            defaultValue={props.value}
            onChange={handleChange}
            /></div>
            {timeout && <CircularProgress />}
        </div>

    )
}

export function Number(props) {

    const {t,i18n} = useTranslation();
    const [timeout,SetTimeout] = React.useState(null)
    const [value,setValue] = React.useState(props.value)

    const send_data = async (val) => {
         
          await update_data({
            guild: props.id,
            path: props.name,
            name: props.module,
            type: props.type,
            value: val,
          });
        clearTimeout(timeout)
        SetTimeout(null)
    }

    const handleChange = (event) => {
        if(isNaN(parseInt(event.target.value))) return
        const n = parseInt(event.target.value)
        if(props.meta && props.meta.min && n < props.meta.min) return;
        if(props.meta && props.meta.max && n > props.meta.max) return;
      setValue(n)
      if (props.onChange) {
        return props.onChange(n);
      }
        clearTimeout(timeout)
        SetTimeout(setTimeout(()=>send_data(n),2000))
        
    }

    return(
        <div style={{
            display:"flex",
            flexDirection : "row",
            justifyContent : "space-between",
            alignItems : "center"
        }}><div style={{width : "100%"}}>
            <Typography >
                {props.name}
            </Typography>
            <TextField
            type="number"
            fullWidth
            value={value}
            onChange={handleChange}
            /></div>
            {timeout && <CircularProgress />}
        </div>

    )
}
export function Choice(props) {
    const {t,i18n} = useTranslation();
    const [timeout,SetTimeout] = React.useState(null)
    const [value,setValue] = React.useState(props.value.selected)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const send_data = async (c) => {
       
          await update_data({
            guild: props.id,
            path: props.name,
            name: props.module,
            type: props.type,
            value: {
              selected: c,
            },
          });
        clearTimeout(timeout)
        SetTimeout(null)
    }

    const handleChange = (val) => {
      handleClose()
      setValue(val);
       if (props.onChange) {
         return props.onChange({
           selected: val,
         });
       }  
        clearTimeout(timeout)
        SetTimeout(setTimeout(()=>send_data(val),2000))
        
    }

    return(
        <div style={{
            display:"flex",
            flexDirection : "row",
            justifyContent : "space-between",
            alignItems : "center"
        }}><div style={{width : "100%"}}>
            <Typography >
                {props.name}
            </Typography>
            <Button  aria-haspopup="true" onClick={handleClick}>
                {value}
            </Button>
            <Menu 
            anchorEl={anchorEl}
            keepMounted
            open={anchorEl ? true : false}
            onClose={handleClose} >
                {props.value && props.value.availables 
                && props.value.availables.map((value,index) => (
                <MenuItem onClick={()=>handleChange(value)} key={index}>
                    {value}
                </MenuItem>
                ))}
                
            </Menu>
        </div>
        {timeout && <CircularProgress />}
        </div>

    )
}