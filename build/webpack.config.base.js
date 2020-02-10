const { resolve } = require('./util')

const config = {
  entry: resolve('client/main.js'),
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: resolve('dist')
  },
  resolve: {
    extensions: ['.js', '.vue', '.jsx', '.json'],
    alias: {
      '@': resolve('client')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: '[name]_[hash:8].[ext]',
            outputPath: 'images/'
          }
        }
      }
    ]
  }
}

module.exports = config
