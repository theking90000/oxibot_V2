import Captcha from "../../modules/captcha"
import { getModule } from "../../modules/ModuleManager"
import { site_base_url ,callbacks_url,recaptcha,appid,hcaptcha } from "../../../../config.js"
import { selectUser } from "../../cache/user"
import client from "../.."

export default async function (unique_id : string) {
try{
    const module = getModule("Captcha") as Captcha
    const infos = module.findByCaptchaId(unique_id)

    if(!infos || infos.data.valided)return {ok : false,html : ""}
    const settings = module.getData(infos.guildID)
    const guild = await client.guilds.fetch(infos.guildID)
    const user = await guild.members.fetch(infos.userID)
    const info = user ? {
        name : user.user.tag,
        userID : user.user.id,
        guildID : guild.id,
        avatar : user.user.displayAvatarURL({dynamic : true,size : 256}),
        guildname : guild.name,
        guild_icon : guild.iconURL({ dynamic : true,size : 256})
    } : {}
    const captcha_key = settings.CaptchaType.value.selected === "ReCaptcha" ? recaptcha.site_key : hcaptcha.site_key
   const text = `<!DOCTYPE html><html lang="fr"><head>
    <!-- OxibotV2 by theking90000 https://github.com/theking90000/oxibot_V2 -->
    <meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <title>OxiBot</title>
    <style> 
        html, 
        body {
        min-height: 100%;
        margin: 0;
        padding: 0;
        background-color: #212121;
        }
        #app {
        width: 100%;
        min-height: 100%; 
        }
        .noscript {
        color : #ffffff;
        text-align: center;
        margin-top: 2em;
        } 
    </style>
        <script>
                window.appdata = ${JSON.stringify({
                    site_base_url,
                    callbacks_url,
                    appid,
                    captcha_id : infos.data.captcha_id,
                    auth : settings.requireAuth.value,
                    customMessage : settings.customMessage.value,
                    CaptchaType : settings.CaptchaType.value.selected,
                    captcha_key,
                    info,
                })}   
        </script>
    </head>
    <body>
    <noscript>
        <h1 class="noscript">
            You need to enable javascript to run this app !
        </h1>
    </noscript>
    <div id="app">

    </div>
    <script src="/captcha.js"></script>
    </body>
    </html>` 

return {html : text, ok : true}
            }catch(e){
                console.error(e)
                return {ok : false,html :""}
            }
}