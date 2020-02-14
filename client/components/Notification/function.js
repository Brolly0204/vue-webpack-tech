import Vue from 'vue'
import Component from './func-notification'

const instances = []

function removeInstance(instance) {
  if (!instance) return
  const index = instances.findIndex(inst => inst.id === instance.id)
  instances.splice(index, 1)
  const len = instances.length
  if (len <= 1) return
  const removeHeight = instance.height
  for (let i = index; i < len; i++) {
    const verticalOffset = instances[i].verticalOffset
    instances[i].verticalOffset = parseInt(verticalOffset) - removeHeight - 16
  }
}

const NotificationConstructor = Vue.extend(Component)

let seed = 1
const notify = options => {
  if (Vue.prototype.$isServer) return

  const { autoClose = 3000, ...rest } = options
  const instance = new NotificationConstructor({
    propsData: { ...rest },
    data() {
      return {
        autoClose
      }
    }
  })

  instance.id = `notification_${seed++}`
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.visible = true
  // 动画完成后
  instance.$on('closed', () => {
    removeInstance(instance)
    document.body.removeChild(instance.$el)
    instance.$destroy()
  })

  // 点击关闭时
  instance.$on('close', () => {
    instance.visible = false
  })

  let verticalOffset = 0
  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16
  })
  verticalOffset += 16
  instance.verticalOffset = verticalOffset

  instances.push(instance)
  return instance
}

export default notify
