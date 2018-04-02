var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');


// TODO:https-saml
// PRODUCTION  产品发布路径
// const outPath = path.resolve(__dirname, '../../smo/deploys/saml/src/main/webapp');

// 模拟登陆发布页面
const outPath = path.resolve(__dirname, '../../hdwx/deploys/manager/src/main/webapp');


module.exports = {
    entry: {
         front:['./src/index.js']
    },
	// #TODO:https-saml
    // PRODUCTION 产品发布：这个配置是发布路径的配置，部署成ROOT的格式
    // output: { path: outPath, filename: 'js/[name].js', publicPath: "/" },
    // 这个配置是发布到front模拟登陆的页面
    output: { path: outPath, filename: 'js/[name].js', publicPath: "/manager/" },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            use: [{ loader: 'babel-loader' }],
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader'] }),
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
        }, {
            test: /\.(jpg|png|gif)$/,
            use: ['file-loader?name=images/[name].[ext]'],
        }, {
            test: /\.(eot|woff|woff2|ttf|svg)$/,
            use: ['file-loader?name=fonts/[name].[ext]'],
        }],
    },
    plugins: [
        new ExtractTextPlugin({ filename: 'css/[id].css' }),
        new HtmlWebpackPlugin({
            chunks:['front'],
            filename:'index.html',
            template: path.join(__dirname,"/index-tmpl.html")
        }),
		// TODO:https-saml
        // new CopyWebpackPlugin([{ from: 'lib/*', to: './' }]),

		// 模拟front环境
        new CopyWebpackPlugin([{ from: __dirname + '/lib', to: outPath + '/lib/'}]),
        // new CopyWebpackPlugin([{from: __dirname + '/lib', to:'lib'}]),
    ],
    externals: { //全局引用
    },
    devtool: "#source-map"
};
