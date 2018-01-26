const webpack = require('webpack');
const path = require('path');
const pkg = require('../package.json');

const rootPath = path.resolve(__dirname, '../');

const conf = {
    entry: path.resolve(rootPath, 'src', 'index.js'),
    output: {
        filename: `${pkg.name}.min.js`,
        path: path.resolve(rootPath, 'build'),
        library: `${pkg.name}`,
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    }
};

module.exports = conf;