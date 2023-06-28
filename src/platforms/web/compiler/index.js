/* @flow */

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }

/**
 * `compile`和`compileToFunctions`两个方法的不同之处有以下几点。
 * 1、 `compile`返回的结果中`render`是字符串，`staticRenderFns`是字符串组成的数组，
 * 而`compileToFunctions`中把它们变成了函数。
 * 2、 `compile`返回的结果中，有模板生成的`ast`和搜集到的错误。
 * 而`compileToFunctions`对其结果进行了一些处理。
 */