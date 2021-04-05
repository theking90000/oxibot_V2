const path = require('path')

module.exports = {
    entry : {
        bundle : "./src/client/index.tsx",
        captcha : "./src/client/captcha/index.tsx"
    },
    output : {
        filename : "[name].js",
        path : path.resolve(__dirname, 'dist', 'client')
    },
    module : {
        rules :[
            {
                test: /\.tsx?$/,
                use : [{
                    loader: "babel-loader",
                    options: {
                      cacheDirectory: true,
                      presets: [["@babel/preset-env", { targets: { node: "8" } }]]
                    }},
                    'ts-loader'
                ],
                exclude : /node_modules/
            }
        ]
    },
    resolve : {
        extensions : ['.tsx','.ts','.js']
    },
    mode: 'development',
    watch : true
}