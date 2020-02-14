import createApp from './create-app'

// renderer.renderToString()执行时，内部会调用此函数
export default context => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()
    router.push(context.url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      context.meta = app.$meta()
      resolve(app)
    }, reject)
  })
}
