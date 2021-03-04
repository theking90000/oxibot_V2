import * as React from "react";
import { connect } from 'react-redux'
import AppBar from "../Componements/appBar"


const syncDataToProps = store => {
    return { syncdata : store.SyncData }
}

class MainPage extends React.Component {
    render() {
        return (
           <AppBar drawer={false} >
            SALTU
            <div>
                cla
            </div>
            </AppBar> 
        )
    }
}

export default connect(syncDataToProps)(MainPage)