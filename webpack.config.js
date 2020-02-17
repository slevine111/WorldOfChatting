const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'js', 'client', 'index.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: { 'react-native-sqlite-storage': 'react-native-sqlite-storage' }
}
