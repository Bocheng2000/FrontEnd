const merge = require('webpack-merge')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const base = require('./webpack.base.config')
const dev = {
  devtool: "source-map",
  devServer: {
    hot: true,
    publicPath: '/dist/',
    historyApiFallback: {
      index: './index.html'
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
module.exports = merge(base, dev)