const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const getEntry = require('./getEntry');

const pages = getEntry('./src/**/*.html');

const htmlplugins = [];
for (const chunkname in pages) {
  const conf = {
    filename: `${chunkname}.html`,
    template: pages[chunkname],
    inject: true,
    cache: false,
    minify: {
      removeComments: true,
      collapseWhitespace: false,
    },
    chunks: ['vendor', chunkname],
    hash: true,
  };
  const titleC = {};
  const title = titleC[chunkname];
  if (title) {
    conf.title = title;
  }
  htmlplugins.push(new HtmlWebpackPlugin(conf));
}
console.log('baseWebpackConfig.entry', baseWebpackConfig);

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach((name) => {
  console.log('name====>', name);

  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }),
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    ...htmlplugins,
    new FriendlyErrorsPlugin(),
  ],
});
