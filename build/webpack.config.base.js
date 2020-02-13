const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { resolve } = require('./util')

const config = {
  entry: resolve('client/client-entry.js'),
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: resolve('dist'),
    publicPath: '/public/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.jsx', '.json'],
    alias: {
      '@': resolve('client'),
      vue2: 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      // https://webpack.docschina.org/concepts/loaders/
      // https://vue-loader.vuejs.org/zh/guide/custom-blocks.html#example
      // vue模板自定义块 指定自定义loader
      // {
      //   resourceQuery: /blockType=docs/,
      // loader: path.resolve(__dirname, './docs-loader')
      //   loader: require.resolve('./docs-loader')
      // },
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
  },
  plugins: [new VueLoaderPlugin()]
}

module.exports = config
