/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

// 每一个类型的实例都会有一个唯一标识
let uid = 0

export function initMixin (Vue: Class<Component>) {
  // _init method 定义在 Vue 的原型对象上，即每个 Vue 实例 都可调用此方法
  Vue.prototype._init = function (options?: Object) {
    // this 当前 Vue 实例
    const vm: Component = this
    // a uid
    vm._uid = uid++

    // 测试性能测试
    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      // 对组件实例化
      initInternalComponent(vm, options)
    } else {
      // mergeOptions 合并options
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm) // 初始化生命周期的一些状态变量，标记生命周期的变量
    initEvents(vm) // 初始化事件的 容器
    initRender(vm) // 初始化创建元素的方法
    callHook(vm, 'beforeCreate') // 调用生命周期函数
    initInjections(vm) // resolve injections before data/props // 初始化注入器
    initState(vm) // 重点：初始化状态数据 props methods data computed watch
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created') // 调用生命周期函数

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      // 组件的挂载，将组件挂载到 el 描述的元素上
      // 会先调用 扩展的 $mount 方法，生成 render
      // 再调用原始 $mount 方法，获得元素，再调用 mountComponent 方法
      // 这两个方法都定义再 platforms/web 
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

// 合并构造器及构造器父级上定义的`options
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  // 有super属性，说明Ctor是通过Vue.extend()方法创建的子类
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}
