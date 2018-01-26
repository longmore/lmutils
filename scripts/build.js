const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const rm = require('rimraf');

const pkg = require('../package.json');
const conf = require('./webpack.conf');

const rootPath = path.resolve(__dirname, '../');

let building = ora('building...');
rm(path.resolve(rootPath, 'build', `${pkg.name}.min.js`), err => {
    if (err) {
        throw (err);
    }
    webpack(conf, (err, stats) => {
        if (err) {
            throw (err);
        }
        building.stop();
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');

        console.log(chalk.cyan('  Build complete.\n'));
    });
});