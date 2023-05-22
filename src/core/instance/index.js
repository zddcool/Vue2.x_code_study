import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
// Vue 构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 初始化
  this._init(options)
}

initMixin(Vue) // 挂载 _init 方法
stateMixin(Vue) // 挂载 状态 方法
eventsMixin(Vue) // 挂载 事件 方法
lifecycleMixin(Vue) // 挂载 生命周期 方法
renderMixin(Vue) // 挂载 与渲染有关的 方法

export default Vue
