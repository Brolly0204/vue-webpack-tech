const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.vue', '.jsx', '.json']
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
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      }
    ]
  },
  devtool: isDev ? 'eval-cheap-module-source-map' : '',
  devServer: {
    host: '0.0.0.0',
    port: '8000',
    // stats: 'errors-warnings',
    stats: {
      colors: true,
      modules: false
    },
    overlay: {
      errors: true
    },
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(isDev ? 'development' : 'production')
      }
    }),
    new CleanWebpackPlugin()
  ]
}

if (!isDev) {
  config.output.filename = 'bundle.[chunkhash:8].js'
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  )
  config.optimization = {
    // 压缩js 压缩css
    minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin({})],
    splitChunks: {
      chunks: 'all',
      minSize: 30000, // 至少要大于 30kb 才会打包
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendor'
        },
        common: {
          priority: -20,
          reuseExistingChunk: true,
          name: 'common'
        }
      }
    }
  }
}

module.exports = config
