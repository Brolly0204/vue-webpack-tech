import Notification from './Notification.vue'
import notify from './function'

export default Vue => {
  Vue.component(Notification.name, Notification)
  Vue.prototype.$notify = notify
}
