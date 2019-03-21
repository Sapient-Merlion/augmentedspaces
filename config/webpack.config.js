const path = require('path');
const config = require('./site.config');
const loaders = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

module.exports = {
  context: path.join(config.root, config.paths.src),
  entry: [
    'core-js/modules/es6.promise',
    'core-js/modules/es6.array.iterator',
    path.join(config.root, config.paths.src, 'scripts/index.js')
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    modules: ['./node_modules', './src']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].[hash].js'
  },
  mode: ['production', 'development'].includes(config.env) ? config.env : 'development',
  devtool: config.env === 'development' ? 'cheap-eval-source-map' : '',
  devServer: {
    contentBase: path.resolve(__dirname, '../'),
    inline: true,
    watchContentBase: true,
    publicPath: '/',
    hot: true,
    open: true,
    port: config.port,
    host: config.dev_host,
    compress: true
  },
  module: {
    rules: loaders
  },
  plugins
};
