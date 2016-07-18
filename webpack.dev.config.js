'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
	cache: true,
	entry: {
		local: './src/js/local',
	},
	devtool: '#inline-source-map',
	output: {
		path: __dirname + '/dev/assets/js',
		filename: '[name].js',
		publicPath: __dirname + '/dev/assets/js',
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
            {   test: /\.hbs$/, 
                loader: 'handlebars-loader',
                include: [
                    __dirname + '/src/js/hbs',
                ]
            }
		]
	},
	plugins: []
};

