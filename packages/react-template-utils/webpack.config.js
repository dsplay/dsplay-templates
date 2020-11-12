const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const createConfig = (target) => ({
  entry: './src/lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dsplay-react-template-utils.' + target + '.js',
    library: 'dsplayReactTemplateUtils',
    libraryTarget: target,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/lib/jsconfig.json' },
      ],
    }),
  ],
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
  devtool: 'source-maps',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: {
    'react': 'commonjs react'
  },
});

module.exports = [
  createConfig('umd'),
  createConfig('commonjs2'),
  createConfig('var'),
  createConfig('amd'),
];

