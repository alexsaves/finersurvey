const path = require('path');

var paths = {
    APP_SRC: './staticsrc/js/',
    DIST: './static/app/'
};

module.exports = {
    entry: paths.APP_SRC + 'index.jsx',
    output: {
        // `filename` provides a template for naming your bundles (remember to use `[name]`)
        filename: '[name].bundle.js',
        // `chunkFilename` provides a template for naming code-split bundles (optional)
        chunkFilename: '[name].chunk.js',
        // `path` is the folder where Webpack will place your bundles
        path: path.resolve(__dirname, paths.DIST),
        // `publicPath` is where Webpack will load your bundles from (optional)
        publicPath: '/static/app/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader', "eslint-loader"]
            }
        ]
    }
};