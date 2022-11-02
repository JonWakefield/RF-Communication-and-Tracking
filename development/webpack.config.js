const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'ify-loader'
            }
        ]
    },
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'static/dist'), 
        filename: 'main.js'
    },
    mode: 'development'
}