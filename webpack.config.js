const path = require('path')

module.exports = {
    entry : "./src/client/index.tsx",
    output : {
        filename : "bundle.js",
        path : path.resolve(__dirname, 'dist', 'client')
    },
    module : {
        rules :[
            {
                test: /\.tsx?$/,
                use : 'ts-loader',
                exclude : /node_modules/
            }
        ]
    },
    resolve : {
        extensions : ['.tsx','.ts','.js']
    },
    mode: 'development'
}