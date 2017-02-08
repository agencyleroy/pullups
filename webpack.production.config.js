const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  entry: [
    path.resolve(__dirname, 'app/main.jsx'),
  ],
  output: {
    path: __dirname + '/build/public',
    // publicPath: '/',
    // filename: '/assets/js/app.[hash].js'
    filename: '/assets/js/app.js'
  },
  module: {
    loaders:[
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?importLoaders=1!postcss-loader!sass-loader'
        })
        // loaders: [
        //   'style-loader',
        //   'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
        //   'resolve-url-loader',
        //   'sass-loader'
        // ]
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader!postcss-loader'
        })
        // loaders: [
        //   'style-loader',
        //   'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        // ]
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url-loader?limit=10000&name=./assets/images/[hash].[ext]&publicPath=../../'
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        loader: 'url-loader?limit=10000&name=./assets/fonts/[hash].[ext]&publicPath=../../',
        include: path.resolve(__dirname, 'app')
      },
      {
        test: /\.(mp4|ogv|webm).*$/,
        loader: 'url-loader?limit=10000&name=./assets/videos/[hash].[ext]&publicPath=../../'
      },
      { test: /\.csv$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'dsv-loader' },
      { test: /\.yaml$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'json-loader!yaml-loader' },
      { test: /\.json$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'json-loader' },
      { test: /\.jsx?$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'babel-loader' },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', './app']
  },
  plugins: [
    autoprefixer,
    new ExtractTextPlugin({
      // filename: '/assets/css/[name].[hash].css',
      filename: '/assets/css/[name].css',
      disable: false,
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin([
      // { from: './app/assets/images', to: 'assets/images' },
      //
      { from: './app/index.html', to: 'index.html' }
    ]),
    new AssetsPlugin({
      path: path.join(__dirname, 'build', 'public')
    })
  ]
};
