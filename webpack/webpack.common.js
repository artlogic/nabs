'use strict';

const webpack = require('webpack');
const { resolve } = require('path');
const NodeExternals = require('webpack-node-externals');

const src = resolve('src');
const dist = resolve('dist');

module.exports = {
  target: 'node',
  entry: {
    nabs: src,
  },
  output: {
    filename: '[name].js',
    path: dist,
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
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
  ],
  externals: [
    NodeExternals(),
  ],
};
