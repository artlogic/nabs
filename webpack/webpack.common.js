const webpack = require('webpack');
const { resolve, join } = require('path');
const { readFileSync } = require('fs');
const NodeExternals = require('webpack-node-externals');

const src = resolve('src');
const dist = resolve('dist');
const banner = readFileSync(resolve('webpack/file-header.txt')).toString().concat('\n');

module.exports = {
  target: 'node',
  entry: {
    index: src,
    nabs: join(src, 'nabs.js'),
  },
  output: {
    filename: '[name].js',
    path: dist,
    library: '',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner,
      raw: true,
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
