<template>
  <div id="app">
    <div id="cover" />
    <Header />
    <transition name="fade">
      <router-view />
    </transition>
    <button
      type="button"
      @click="notify"
    >
      click me
    </button>
    <!-- <Notification content="Lᵒᵛᵉᵧₒᵤ❤Ｉ乐乐 情人节快乐！赶快好起来~" /> -->
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
  },
  methods: {
    notify() {
      this.$notify({
        content: '我爱你乐乐',
        btn: 'close',
        autoClose: 2000
      })
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
