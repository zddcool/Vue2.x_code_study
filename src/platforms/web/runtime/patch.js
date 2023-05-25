/* @flow */

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'
/**
 * baseModules include directives and ref.
 * platformModules 是不同浏览器支持的属性、事件、类、css样式、动画等方面的声明、
 */

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)
// 比较: 属性 类 标签 指令 ref
export const patch: Function = createPatchFunction({ nodeOps, modules })
