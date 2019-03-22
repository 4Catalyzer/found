const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/client',

  output: {
    path: '/',
    filename: 'bundle.js',
  },

  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }],
  },

  plugins: [new HtmlWebpackPlugin()],

  devtool: 'cheap-module-source-map',

  devServer: {
    historyApiFallback: true,
  },
};
