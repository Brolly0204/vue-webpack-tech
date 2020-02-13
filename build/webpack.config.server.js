const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const baseConfig = require('./webpack.config.base')
const { resolve } = require('./util')

// **注意**
// 在server端打包配置中，不要使用mini-css-extract-plugin 因为它依赖document

const isDev = process.env.NODE_ENV === 'development'
const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      VUE_ENV: JSON.stringify('server')
    }
  }),
  // 这是将服务器的整个输出
  // 构建为单个 JSON 文件的插件。
  // 默认文件名为 `vue-ssr-server-bundle.json`
  new VueSSRServerPlugin()
]

const config = merge(baseConfig, {
  entry: resolve('client/server-entry'),
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server-entry.js',
    path: resolve('server-build')
  },
  target: 'node',
  externals: [nodeExternals()],
  mode: isDev ? 'development' : 'production',
  devtool: 'source-map',
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
  plugins: [...defaultPlugins]
})

module.exports = config
