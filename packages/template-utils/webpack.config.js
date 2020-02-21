const path = require('path');

module.exports = {
  entry: './src/lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dsplay-template-utils.js',
    library: 'dsplayTemplateUtils',
    libraryTarget: 'umd',
  },
};
