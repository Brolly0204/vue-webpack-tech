const path = require('path')
const fs = require('fs')
const Router = require('@koa/router')
const { createBundleRenderer } = require('vue-server-renderer')
const serverRender = require('./server-render')

// producttion环境下 clientManifest和serverBundle预先编译好了

// clientManifest
const clientManifest = require('../../dist/vue-ssr-client-manifest.json')

// serverBundle
const serverBundle = path.join(
  __dirname,
  '../../server-build/vue-ssr-server-bundle.json'
)

const renderer = createBundleRenderer(serverBundle, {
  inject: false,
  clientManifest
})

// template
const template = fs.readFileSync(
  path.join(__dirname, '../server.template.ejs'),
  'utf-8'
)

const pageRouter = new Router()

pageRouter.get('*', async ctx => {
  await serverRender(ctx, renderer, template)
})

module.exports = pageRouter
