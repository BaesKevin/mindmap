const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        index: "./js/index.js",
        mindmap: "./js/mindmap.js"
    },
    devtool: "inline-source-map",
    output: {
        filename: "./../../backend/src/main/resources/static/assets/js/[name].js"
    },
    optimization: {
        minimize: false
      }
};
