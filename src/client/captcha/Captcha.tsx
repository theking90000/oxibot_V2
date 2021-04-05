import { Typography } from "@material-ui/core";
import * as React from "react"
import ReCAPTCHA from "react-google-recaptcha";
const HCaptcha = require('@hcaptcha/react-hcaptcha'); 

export default function (props : {captcha_id ,custommsg :string,sitekey :string, type:string })  {

    const [valid,setValid] = React.useState(false)
    const [Error,setError] = React.useState(null)


    const handleChange = async (token) => {
        const request = await fetch("/api/module/Captcha/verification", {
            headers : {
                "Authorization" : window.localStorage.oxibotV2_token,
                "Content-type" : "application/json"
            },
            body : JSON.stringify({
                captcha_id : props.captcha_id,
                captcha_token : token,
                captcha_type: props.type,
            }),
            method :"POST",
        })
        const json = await request.json()
        setValid(Boolean(json.success))
        if(json.error) setError(json.error)
    }
    return(
        <div style={{
            display : "flex",
            justifyContent : "center",
            flexDirection : "column",
            textAlign : "center"
        }}>
            <Typography variant="h3">
                {props.custommsg}
            </Typography>
            <div style={{display :  "flex" ,justifyContent : "center"}}>
           {props.type === "ReCaptcha"&& 
           <div style={{display : (!valid && !Error)  ?  "flex" : "none"}}>
           <ReCAPTCHA 
            sitekey={props.sitekey}
            onChange={handleChange}
            
            /></div>}
            {props.type === "hCaptcha"&& 
        <div style={{ display :  (!valid && !Error)  ?  "flex" : "none"}} >
            <HCaptcha
                sitekey={props.sitekey}
                onVerify={handleChange}
            /></div>}
            {valid && <div>
                
                </div>}
            {Error && <Typography variant="h4" color="error">
                {Error}
                </Typography>}
            </div>
        </div>
    )
}