import * as React from "react";

import Container from "@material-ui/core/Container"
import LoaderBar from "../Componements/loading"
import Typography from '@material-ui/core/Typography';
import { Button } from "@material-ui/core";

export default function loading(props){
    
    const [reloadP,setReloadP] = React.useState(false)

    React.useEffect(() => {
    const t = setTimeout(handleReload,5000)
    return () => clearTimeout(t)
    }, [])
    const handleReload = () => setReloadP(true)
    const handleClick = () => window.location.reload()

    return(
        <div>
        <LoaderBar />
        <Container >
            <Typography align="center" variant="h1" color="primary" >
            Chargement 
            
            {reloadP && 
                <div>
                <Typography align="center" variant="h2" color="primary" >
                    Une erreur est peut etre survenue !
                    <div>
                    <Button onClick={handleClick} >Recharger la page</Button>
                    </div>
                </Typography>
                </div>
            }
            
            </Typography>
            
        </Container>
        </div>
    )

}