import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

import createRouter from './config/router'
import createStore from './store'
import App from './App.vue'
import './assets/styles/global.styl'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueMeta)

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
