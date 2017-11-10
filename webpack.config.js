const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup.js',
    vendors: './src/vendors.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [{
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      }],
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
  ],
};
