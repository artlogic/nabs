'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
});
