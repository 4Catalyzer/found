const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/client'],

  output: {
    path: '/',
    filename: 'bundle.js',
  },

  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }],
  },

  plugins: [new HtmlWebpackPlugin()],

  devtool: 'module-source-map',

  devServer: {
    historyApiFallback: true,
  },
};
