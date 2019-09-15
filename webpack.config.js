const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'js', 'client', 'index.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
