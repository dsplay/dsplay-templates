const path = require('path');

const createConfig = (target) => ({
  entry: './src/lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dsplay-react-template-utils.' + target + '.js',
    library: 'dsplayReactTemplateUtils',
    libraryTarget: target,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
});

module.exports = [
  createConfig('umd'),
  createConfig('commonjs2'),
  createConfig('var'),
  createConfig('amd'),
];

