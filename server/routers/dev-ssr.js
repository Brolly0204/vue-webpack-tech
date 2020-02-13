const webpack = require('webpack')
const Router = require('@koa/router')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const MemoryFS = require('memory-fs')
const { createBundleRenderer } = require('vue-server-renderer')
const serverRender = require('./server-render')

const serverConfig = require('../../build/webpack.config.server.js')

const serverCompiler = webpack(serverConfig)

// https://webpack.js.org/api/node/#custom-file-systems
// 自定义文件系统
const mfs = new MemoryFS()
serverCompiler.outputFileSystem = mfs

let bundle
// https://webpack.js.org/api/node/#compiler-instance
// Compiler
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  // stats对象
  // https://webpack.js.org/api/node/#stats-object
  // console.log(stats)
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.warn(warn))

  // https://ssr.vuejs.org/zh/guide/build-config.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE-server-config
  // 默认文件名为 `vue-ssr-server-bundle.json`
  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('new bundle generated')
})

const handleSSR = async ctx => {
  if (!bundle) {
    ctx.body = '你等一会儿，别急...'
    return
  }

  // clientManifest
  const { data: clientManifest } = await axios.get(
    'http://127.0.0.1:8000/vue-ssr-client-manifest.json'
  )
  // template
  const template = fs.readFileSync(
    path.join(__dirname, '../server.template.ejs'),
    'utf-8'
  )
  const renderer = createBundleRenderer(bundle, {
    inject: false, // 手动注入资源 不自动注入资源
    clientManifest
  })
  await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
