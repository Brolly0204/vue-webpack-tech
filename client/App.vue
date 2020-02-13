<template>
  <div id="app">
    <div id="cover" />
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from './layout/header'
import Footer from './layout/footer'

export default {
  name: 'App',
  metaInfo: {
    title: 'Brolly \'s Todo App'
  },
  components: {
    Header,
    Footer
  },
  data() {
    return {
      text: 'Hello vue.js!'
    }
  }
}
</script>

<style lang="stylus" scoped>
#app
  position absolute
  top 0
  bottom 0
  left 0
  right 0

  #cover
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    background-color #999
    opacity 0.9
    z-index -1
</style>
