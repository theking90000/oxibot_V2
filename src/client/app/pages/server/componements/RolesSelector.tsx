import  CircularProgress  from "@material-ui/core/CircularProgress";
import * as React from "react"
import { useTranslation } from "react-i18next";
import { connect } from "react-redux"
import { fetch_data } from "../../../../reducers/Roles";
import SelectorC from "./Selector";

function mapStateToProps(state) {
    const roles = state.Roles.find(c => c.id === state.ChangeGuild.guild.id)
    if (roles)
        return { roles: roles.roles};
    else
        fetch_data({guild : state.ChangeGuild.guild.id})

    return { roles: null }
}

type role = {
    id : string,
    color : string,
    position : string,
    name : string,
}

function Selector(props: { onChangeALL? :(data)=>void, onChange : (type : "ADD" | "REMOVE",role : role) => void,roles : role[], max? : number, min? : number, default? : string[] }){

    if(!props.roles){
        return (<div><CircularProgress /></div>)
    }

    const [selected , setSelected] = React.useState(props.default || []);

    const {t,i18n} = useTranslation(); 

    const handleChange = (type,data,cancel) => {
        if(type === "ADD"){
            if(props.max && props.max <= selected.length)
               return cancel(true)
            setSelected((s) => [...s,data.value]);
        }
        if(type === "REMOVE"){
            if(props.min && props.min >= selected.length)
                return cancel(true);

            setSelected((s) => s.filter(x => x !== data.value))
        }
        props.onChange(type, props.roles.find(x=> x.id === data.value))
        if (props.onChangeALL) props.onChangeALL(
          type === "ADD"
            ? [...selected, data.value]
            : selected.filter((x) => x !== data.value)
        );
        cancel(false)
    }
    
    return(
        <div>
            {t("RoleSelectorTitle")}
           <SelectorC  
           availables={props.roles.filter(x => !(props.default &&props.default.includes(x.id)) ).map(role => ({
               name : role.name,
               value : role.id,
               elem : (<span style={{color :  role.color === "#000000" ? "rgb(153, 170, 181)" : 
               role.color}} >{role.name}</span>)
           }))}
           onChangeCancelable={handleChange}
           selected={props.default ? props.default.filter(x => props.roles.find(c => c.id === x)).map(default_  =>{
            const role = props.roles.find(c => c.id === default_)
            return {name : role.name,
            value : role.id,
            elem : (<span style={{color : role.color === "#000000" ? "rgb(153, 170, 181)" : 
            role.color}} >{role.name}</span>)
            }
            }) : []}
            canAdd={true}
            canRemove={true}
           />
        </div>
    )
}

export default connect(mapStateToProps)(Selector);