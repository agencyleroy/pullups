var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    // progress: true,
    host: "0.0.0.0",
    contentBase: './app',
    port: 8080,
  },
  entry: [
    path.resolve(__dirname, 'app/main.jsx')
  ],
  output: {
    path: __dirname + '/build/app',
    publicPath: '/',
    filename: './assets/js/app.js'
  },
  module: {
    loaders:[
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loaders: [
          'style-loader?sourceMap',
          // 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'css-loader?importLoaders=1',
          'postcss-loader',
          'resolve-url-loader',
          'sass-loader?sourceMap'
        ]
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loaders: [
          'style-loader?sourceMap',
          'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'postcss-loader'
        ]
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url-loader?limit=10000&name=./assets/img/[hash].[ext]&publicPath=../../'
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        loader: 'url-loader?limit=10000&name=./assets/fonts/[hash].[ext]&publicPath=../../'
      },
      {
        test: /\.(mp4|ogv|webm).*$/,
        loader: 'url-loader?limit=10000&name=./assets/videos/[hash].[ext]&publicPath=../../'
      },
      { test: /\.csv$/, include: path.resolve(__dirname, '/'), exclude: /node_modules/, loader: 'dsv-loader' },
      { test: /\.yaml$/, include: path.resolve(__dirname, '/'), exclude: /node_modules/, loader: 'json-loader!yaml-loader' },
      { test: /\.json$/, include: path.resolve(__dirname, '/'), exclude: /node_modules/, loader: 'json-loader' },
      { test: /\.jsx?$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'babel-loader' },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    autoprefixer,
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({ url: 'http://0.0.0.0:8080' }),
  ]
};
