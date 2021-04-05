import * as React from "react"

import Container from "@material-ui/core/Container"
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function Login(props : {appid,callback : string[]}){
    

    const handleClick = (e) => {
        let url = `https://discord.com/api/oauth2/authorize?client_id=${props.appid}&redirect_uri=${encodeURIComponent(props.callback[0])}&response_type=token&scope=identify%20guilds`
        window.location.href = url
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