'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
	cache: true,
	entry: {
		dnevnik: './src/js/dnevnik',
		mosreg: './src/js/mosreg'
	},
	output: {
		path: __dirname + '/production/assets/js',
		filename: '[name].js',
		publicPath: __dirname + '/production/assets/js',
		pathinfo: true
	},

	resolve: {
		modulesDirectories: ['node_modules'],
		extentions: ['', '.js'],
		alias: {
		}
	},

	module: {
		noParse: [
		],
		loaders: [
			{   test: /\.js$/, 
				loader: 'babel',
				include: [
					__dirname + '/src/js'
				], 
				query: {
					cacheDirectory: true,
					presets: ['es2015']
				}
			},
			{ 	test: /\.js$/, 
				include: [
					__dirname + '/src/js'
				], 
				loader: 'strip-loader?strip[]=console.log' 
			},
            {   test: /\.hbs$/, 
                loader: 'handlebars-loader',
                include: [
                    __dirname + '/src/js/hbs',
                ]
            }
		]
	},
	plugins: [     
		new webpack.DefinePlugin({
			'process.env': { 
				NODE_ENV : JSON.stringify('production') 
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings: false
			}
		})
	]
};

