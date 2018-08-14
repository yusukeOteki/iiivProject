const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

export default {
  mode: 'development',
  context: __dirname,
  entry: [
    './src/index.jsx',
  ],
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/dist`,
    // 出力ファイル名
    filename: 'main.js'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, enforce: 'pre', exclude: /node_modules/, loader: 'eslint-loader' },
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader') },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
			meta: {charset: 'utf-8'},
			favicon: './src/favicon.png',
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: './.eslintrc',
        },
      },
    }),
    new ExtractTextPlugin('css/bundle.css'),
  ],
  devServer: {
    contentBase: 'dist',
    open: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    }
  }
};
