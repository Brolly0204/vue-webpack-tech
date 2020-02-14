import Notification from './Notification.vue'

export default {
  extends: Notification,
  data() {
    return {
      verticalOffset: 0,
      autoClose: 3000,
      visible: false
    }
  },
  computed: {
    style() {
      return {
        position: 'fixed',
        right: '20px',
        bottom: `${this.verticalOffset}px`
      }
    }
  },
  mounted() {
    this.createTimer()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    createTimer() {
      if (this.autoClose > 0) {
        this.timer = setTimeout(() => {
          this.visible = false
        }, this.autoClose)
      }
    },
    clearTimer() {
      if (this.timer) {
        window.clearTimeout(this.timer)
      }
    },
    afterEnter() {
      this.height = this.$el.offsetHeight
    }
  }
}
