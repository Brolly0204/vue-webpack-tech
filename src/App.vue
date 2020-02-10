<template>
  <div id="app">
    <div id="cover"></div>
    <Header />
    <Todo />
    <Footer />
  </div>
</template>

<script>
import Header from './todo/header'
import Footer from './todo/footer'
import Todo from './todo/todo'

export default {
  components: {
    Header,
    Footer,
    Todo
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