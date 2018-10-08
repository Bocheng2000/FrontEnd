const merge = require('webpack-merge')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')

var base = require('./webpack.base.config')
const prod = {
	cache: false,
	devtool: false,
	plugins: [
		new CleanWebpackPlugin(['dist/*.js']),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: "vendor",
					chunks: "initial",
					minChunks: 2,
				},
			}
		},
	}
}
module.exports = merge(base, prod)
