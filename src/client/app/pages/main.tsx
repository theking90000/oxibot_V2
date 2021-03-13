import * as React from "react";
import { connect } from 'react-redux'
import AppBar from "../Componements/appBar"
import { makeStyles, Theme,createStyles } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next"
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button"
import SelectServer from "../Componements/selectServer"

const syncDataToProps = store => {
    return { syncdata : store.SyncData }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

const MainPage = props => {

    const classes = useStyles();

    const {t,i18n} = useTranslation();


        return (
           <AppBar drawer={false} >   
            <div>
                <Container maxWidth="sm">
                    <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                        {t('MainPageBotName')}
                    </Typography>
                    <Typography variant="h5" align="center" color="textPrimary" gutterBottom>
                        {t('MainPageDescription')}
                    </Typography>
                    <div>
                      <Grid container spacing={2} justify="center">
                        {props.syncdata.guilds[0] &&
                        <React.Fragment>
                          <Grid item>
                            <Typography variant="h6" align="center" color="textPrimary" gutterBottom>
                              {t('MainPageManageServer')}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <SelectServer />
                          </Grid>
                        </React.Fragment>}
                        {!props.syncdata.guilds[0] && 
                        <React.Fragment>
                          <Grid item>
                            
                          </Grid>
                        </React.Fragment>}

                      </Grid>
                    </div>
                </Container>
            </div>
            </AppBar> 
        )
    
}

export default connect(syncDataToProps)(MainPage)