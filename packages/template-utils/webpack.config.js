const path = require('path');

module.exports = [
  'source-map'
].map(devtool => ({
  mode: 'development',
  entry: './src/lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dsplay-template-utils.js',
    library: 'webpackNumbers',
    libraryTarget: 'umd',
  },
  devtool,
  optimization: {
    runtimeChunk: true,
  },
}));