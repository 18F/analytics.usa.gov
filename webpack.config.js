const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'assets'),
  },
  watchOptions: {
    ignored: '/node_modules/',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.m?js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'eslint-loader',
        enforce: 'pre',
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
        },
      }),
    ],
  },
};
