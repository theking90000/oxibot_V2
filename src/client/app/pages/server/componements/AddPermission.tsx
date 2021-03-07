import * as React from "react"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import { useTranslation } from "react-i18next"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField"
import Popper from "@material-ui/core/Popper";
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyle = makeStyles((theme : Theme) => createStyles({
    SearchPerms : {
        width : "100%",
        height : "80%",
        margin : theme.spacing(1),
        label : {
            background : theme.palette.background.default
        }
    },
    autoComplete : {
        width : "100%"
    }
}))




export default (props : { onAdd : (perms:string[]) => void, list : {name : string,desc : string}[] }) => {
    const {t,i18n} = useTranslation()
    const classes = useStyle()

    const list = props.list.map(x => x.name)

    const [options_, setOptions_] = React.useState(list)

    const [value,setValue] = React.useState([])

    React.useEffect(() => {
        setOptions_((state) => list)
    },[props.list])


    const HandleChange = (event,v) => {
        setValue(v)
    }

    const clickHandler = (event) => {

        if(value[0]){
            props.onAdd(value)
            setOptions_((state) =>  state.filter(c => !value.includes(c)))
            setValue([])
        }
    }

    return (
        <Box display="flex"  flexDirection="row"  >
                        
                        <Autocomplete
                            className={classes.autoComplete}
                            multiple
                            value={value}
                            onChange={HandleChange}
                            options={options_}
                            getOptionLabel={(option) => option}
                            filterSelectedOptions
                            freeSolo
                            renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label={t('EditGroupAddPermissionLabel')}
                                placeholder={t('EditGroupAddPermissionPlaceholder')}
                            />
                            )}
                        />

                        <Button  onClick={clickHandler} >
                            {t('EditGroupAddPermissionButton')}
                        </Button>
        </Box>
    )
}
