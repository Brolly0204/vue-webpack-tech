const webpack = require('webpack')
const VueSSRServerPlugin = require('vue-server-renderer/client-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const { resolve } = require('./util')

const isDev = process.env.NODE_ENV === 'development'

const defaultPlugins = [
  // https://ssr.vuejs.org/zh/guide/build-config.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE-client-config
  // 生成 `vue-ssr-client-manifest.json`
  new VueSSRServerPlugin(),
  new HtmlWebpackPlugin({
    template: resolve('public/index.html')
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(isDev ? 'development' : 'production')
    }
  })
]

let config
// development
if (isDev) {
  config = merge(baseConfig, {
    entry: resolve('client/client-entry.js'),
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
      path: resolve('dist'),
      publicPath: 'http://localhost:8000/'
    },
    mode: isDev ? 'development' : 'production',
    devtool: 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(jsx?|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[local]_[hash:base64:8]'
                }
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.styl(us)?$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
                // modules: {
                //   localIdentName: '[local]_[hash:base64:8]'
                // }
              }
            },
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
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      // stats: 'errors-warnings',
      stats: {
        colors: true,
        modules: false
      },
      overlay: {
        warnings: true,
        errors: true
      },
      historyApiFallback: true,
      hot: true
    },
    plugins: [...defaultPlugins]
  })
} else {
  // production
  config = merge(baseConfig, {
    output: {
      filename: '[name]_[hash:8].js',
      chunkFilename: '[name]_[chunkhash:8].js',
      path: resolve('dist'),
      publicPath: '/public/'
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
              options: {
                importLoaders: 1
              }
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
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
              }
            },
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
      ...defaultPlugins,
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name]_[hash:8].css'
      })
    ]
  })
}

module.exports = config
