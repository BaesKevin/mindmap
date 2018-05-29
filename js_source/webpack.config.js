const path = require('path');

// module.exports = {
//     mode: "development",
//     entry: {
//         index: "./js/index.js",
//         mindmap: "./js/mindmap.js"
//     },
//     stats: "verbose",
//     devtool: "source-map",
//     output: {
//         filename: "./../../backend/src/main/resources/static/assets/js/[name].js"
//     },
//     optimization: {
//         minimize: false
//       }
// };

module.exports = {
    mode: "production",
    entry: {
        index: "./js/index.js",
        mindmap: "./js/mindmap.js"
    },
    output: {
        filename: "./../../backend/src/main/resources/static/assets/js/[name].min.js"
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            }
        ]
    }
};