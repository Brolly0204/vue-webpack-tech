const ejs = require('ejs')

module.exports = async (ctx, renderer, template) => {
  ctx.headers['content-type'] = 'text/html'
  const context = { url: ctx.url }

  try {
    // renderToString执行时 内部会调用 client/server-entry.js里导出的方法并传入context
    const appString = await renderer.renderToString(context)

    // 并挂载meta信息 context.meta = app.$meta()
    const { title } = context.meta.inject()
    // 手动注入资源
    // https://ssr.vuejs.org/zh/guide/build-config.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE-client-config
    const html = ejs.render(template, {
      appString,
      styles: context.renderStyles(),
      scripts: context.renderScripts(),
      title: title.text()
    })
    ctx.body = html
  } catch (err) {
    // 错误页面处理
    console.log('error', err)
    ctx.body = 404
  }
}
