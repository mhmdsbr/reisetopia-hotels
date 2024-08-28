const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');

const pluginFolder = 'reisetopia-plugin';

module.exports = merge(config, {
    entry: {
        app: path.resolve(__dirname, 'src', 'reisetopia-plugin', 'javascript', 'app.js'),
    },

    output: {
        path: path.resolve(__dirname, 'public', 'assets'),
        publicPath: `/wp-content/plugins/${pluginFolder}/public/assets/`,
    },
});
