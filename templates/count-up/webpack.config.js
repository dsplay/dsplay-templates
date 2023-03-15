const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const createConfig = (target) => ({
  entry: './src/lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dsplay-react-template-utils.' + target + '.js',
    library: 'dsplayReactTemplateUtils',
    libraryTarget: target,
    umdNamedDefine: target === 'umd',
    globalObject: 'this',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        'src/lib/jsconfig.json',
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
    // Don't bundle react or react-dom      
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  }
});

module.exports = [
  createConfig('umd'),
  createConfig('commonjs'),
  createConfig('commonjs2'),
  createConfig('var'),
  createConfig('amd'),
  createConfig('system'),
];

