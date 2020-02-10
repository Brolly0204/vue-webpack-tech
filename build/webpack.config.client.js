const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const { resolve } = require('./util')

const isDev = process.env.NODE_ENV === 'development'

let config
// development
if (isDev) {
  config = merge(baseConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
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
            'vue-style-loader',
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
    plugins: []
  })
} else {
  // production
  config = merge(baseConfig, {
    output: {
      filename: '[name]_[hash:8].js',
      chunkFilename: '[name]_[chunkhash:8].js',
      path: resolve('dist'),
      publicPath: './'
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
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
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
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
    optimization: {
      runtimeChunk: {
        name: entrypoint => `runtime_${entrypoint.name}`
      },
      // 压缩js 压缩css
      minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin({})],
      splitChunks: {
        chunks: 'all',
        // minSize: 30000, // 至少要大于 30kb 才会拆分
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
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name]_[hash:8].css'
      })
    ]
  })
}

config.plugins.push(
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(isDev ? 'development' : 'production')
    }
  })
)

module.exports = config
