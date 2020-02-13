const Router = require('@koa/router')
const send = require('koa-send')
const path = require('path')

const staticRouter = new Router({
  prefix: '/public'
})

staticRouter.get('/*', async ctx => {
  const ctxPath = ctx.path.replace(staticRouter.opts.prefix, '')
  await send(ctx, ctxPath, {
    root: path.join(__dirname, '../../dist')
  })
})

module.exports = staticRouter
