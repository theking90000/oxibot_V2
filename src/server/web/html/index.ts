import { site_base_url ,callbacks_url,appid } from "../../../../config.js"

export default async function (unique_id : string) {
    try{
        

const text = `<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- OxibotV2 by theking90000 https://github.com/theking90000/oxibot_V2 -->
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <title>OxiBot</title>
    <script>
        window.appdata = ${JSON.stringify({
            site_base_url,callbacks_url,appid
        })}
    </script>
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
</head>
<body>
    <noscript>
        <h1 class="noscript">
            You need to enable javascript to run this app !
        </h1>
    </noscript>
    <div id="app">

    </div>
    <script src="/bundle.js"></script>
</body>
</html>`
return text;
    }catch{
        
    }
    return null;
}