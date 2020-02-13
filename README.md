# Vue SSR工程搭建


## 构建Bundle Renderer
### server-entry.js
```js
// file: client/server-entry.js
import createApp from './create-app'

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
```

### client-entry.js

```js
// file: client/client-entry.js
import createApp from './create-app'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#app')
})
```

### createApp

```js
// file: client/create-app.js
import createRouter from './config/router'
import createStore from './store'
export default () => {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return {
    app,
    store,
    router
  }
}
```
createRouter
```js
// file: client/config/router
import routes from './routes'
export default () => {
  return new Router({
    routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  })
}

```
createStore

```js
// file: client/store/index.js
import Vuex from 'vuex'

export default () => {
  const store = new Vuex.Store({
    state: {
      firstName: 'Brolly',
      lastName: 'Lee'
    },
    getters: {
      fullName(state) {
        return `${state.firstName} ${state.lastName}`
      }
    }
  })
  return store
}
```

### 构建配置
利用VueSSRServerPlugin生成客户端清单 (client manifest) 和服务器 bundle(server bundle)

#### 客户端构建
```js
// webpack.config.client.js
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
module.exports = merge(baseConfig, {
  entry: resolve('client/client-entry.js'),
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: resolve('dist'),
    publicPath: 'http://localhost:8000/'
  },
  // 这是将客户端的整个输出
  // 构建为单个 JSON 文件的插件。
  // 默认文件名为 `vue-ssr-client-manifest.json`
  plugins: [
    new VueSSRServerPlugin()
  ]
})

```

#### 服务端构建
```js
// webpack.config.server.js
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
module.exports = merge(baseConfig, {
  entry: resolve('client/server-entry'),
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server-entry.js',
    path: resolve('server-build')
  },
  target: 'node', // 构建目标环境
  externals: [nodeExternals()], // 不需要将node模块打包进来，node环境下直接require模块即可
  // 这是将服务器的整个输出
  // 构建为单个 JSON 文件的插件。
  // 默认文件名为 `vue-ssr-server-bundle.json`
  plugins: [
    new VueSSRServerPlugin()
  ]
})
```

renderer 现在具有了服务器和客户端的构建信息，因此它可以自动推断和注入资源预加载 / 数据预取指令(preload / prefetch directive)，以及 css 链接 / script 标签到所渲染的 HTML。

```js
const renderer = createBundleRenderer(serverBundle, {
  inject: false, 手动插入渲染资源
  // template, // （可选）页面模板
  clientManifest // （可选）客户端构建 manifest
})
```
### 构建clientManifest.json和serverBundle.json
webpack.config.client.js => clientManifest(构建出来的默认名：vue-ssr-client-manifest.json)

webpack.config.server.js => serverBundle(构建出来的默认名：vue-ssr-server-bundle.json)

### koa路由 development环境
server/routers/dev-ssr.js

### koa路由 production环境

```js
// server/routers/ssr.js
const { createBundleRenderer } = require('vue-server-renderer')
// producttion环境下 clientManifest和serverBundle预先build构建好了
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

// 接入Koa路由渲染
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

```

### server渲染中间件
```js
// server/routers/server-render.js
const ejs = require('ejs')

module.exports = async (ctx, renderer, template) => {
  ctx.headers['content-type'] = 'text/html'
  const context = { url: ctx.url }

  try {
    const appString = await renderer.renderToString(context)
    // renderToString执行 调用 client/server-entry.js里的方法
    // 并挂载meta信息 context.meta = app.$meta()
    const { title } = context.meta.inject()
    // 手动注入资源
    const html = ejs.render(template, {
      appString,
      styles: context.renderStyles(),
      scripts: context.renderScripts(),
      title: title.text()
    })
    ctx.body = html
  } catch (err) {
    console.log('error', err)
    throw err
  }
}
```

### Koa SSR服务器
```js
// server/server.js

const Koa = require('koa')
const path = require('path')
const send = require('koa-send')

const app = new Koa()
const isDev = process.env.NODE_ENV === 'development'

// 注册ssr服务路由
let pageRouter
if (isDev) {
  pageRouter = require('./routers/dev-ssr')
} else {
  pageRouter = require('./routers/ssr')
}
// pageRouter
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`)
})
```


参考：[Bundle Renderer](https://ssr.vuejs.org/zh/guide/bundle-renderer.html#%E4%BD%BF%E7%94%A8%E5%9F%BA%E6%9C%AC-ssr-%E7%9A%84%E9%97%AE%E9%A2%98)

## 注意问题
在server端打包配置中，不要使用mini-css-extract-plugin 因为它需要依赖document
