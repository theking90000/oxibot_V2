import * as React from "react";

import Container from "@material-ui/core/Container"
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { store } from "../../app/app"
import { push } from 'connected-react-router'

const callbacks_url = [
    'http://localhost:3000/'
]
const appid = "691920074357080116"

export default function Login(props){
    

    React.useEffect(() => {

    })

    const handleClick = (e) => {
        let url = `https://discord.com/api/oauth2/authorize?client_id=${appid}&redirect_uri=${encodeURIComponent(callbacks_url[0])}&response_type=token&scope=identify%20guilds`
        window.location.href = url

        console.log(e)
    }

    return(
        <div>
        <Container >
            <Typography variant="h2" align="center"  color="primary" >
            Veuillez vous connecter
            </Typography>
            <Box justifyContent="center" display="flex" >
            <Button onClick={handleClick} >
            Se connecter
            </Button>
            </Box>
        </Container>
        </div>
    )

}