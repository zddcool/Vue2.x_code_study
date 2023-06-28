/* @flow */

import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'

import modules from './modules/index'
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
import { isUnaryTag, canBeLeftOpenTag } from './util'

/**
 * 解析模板时和平台相关的基本配置
 * expectHTML: true,
  modules, // 对模板中 class style 的解析
  directives, // 包括 v-model v-html v-text 指令
  isPreTag, // 是否是Pre标签
  isUnaryTag, // 是否是单标签，比如 img input iframe
  mustUseProp, // 需要使用props绑定的属性
  canBeLeftOpenTag, // 可以不闭合的标签，比如 tr td等
  isReservedTag, // 是否时保留标签，html标签和svg标签
  getTagNamespace, // 获取命名空间 svg 和 math
  staticKeys // 静态关键词，include staticStyle and staticClass
 */
export const baseOptions: CompilerOptions = {
  expectHTML: true,
  modules,
  directives,
  isPreTag,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
}
