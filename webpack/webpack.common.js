const webpack = require('webpack');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const NodeExternals = require('webpack-node-externals');

const dist = resolve('dist');
const banner = readFileSync(resolve('webpack/file-header.txt')).toString();

module.exports = {
  target: 'node',
  entry: {
    index: resolve('index.js'),
  },
  output: {
    filename: '[name].js',
    path: dist,
    libraryTarget: 'commonjs',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner,
    }),
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node\n',
      raw: true,
    }),
  ],
  externals: [
    NodeExternals(),
  ],
};
