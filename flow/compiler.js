declare type CompilerOptions = {
  warn?: Function; // allow customizing warning in different environments; e.g. node
  modules?: Array<ModuleOptions>; // platform specific modules; e.g. style; class
  directives?: { [key: string]: Function }; // platform specific directives
  staticKeys?: string; // a list of AST properties to be considered static; for optimization
  isUnaryTag?: (tag: string) => ?boolean; // check if a tag is unary for the platform
  canBeLeftOpenTag?: (tag: string) => ?boolean; // check if a tag can be left opened
  isReservedTag?: (tag: string) => ?boolean; // check if a tag is a native for the platform
  preserveWhitespace?: boolean; // preserve whitespace between elements? (Deprecated)
  whitespace?: 'preserve' | 'condense'; // whitespace handling strategy
  optimize?: boolean; // optimize static content?

  // web specific
  mustUseProp?: (tag: string, type: ?string, name: string) => boolean; // check if an attribute should be bound as a property
  isPreTag?: (attr: string) => ?boolean; // check if a tag needs to preserve whitespace
  getTagNamespace?: (tag: string) => ?string; // check the namespace for a tag
  expectHTML?: boolean; // only false for non-web builds
  isFromDOM?: boolean;
  shouldDecodeTags?: boolean;
  shouldDecodeNewlines?:  boolean;
  shouldDecodeNewlinesForHref?: boolean;
  outputSourceRange?: boolean;

  // runtime user-configurable
  delimiters?: [string, string]; // template delimiters
  comments?: boolean; // preserve comments in template

  // for ssr optimization compiler
  scopeId?: string;
};

declare type WarningMessage = {
  msg: string;
  start?: number;
  end?: number;
};

declare type CompiledResult = {
  ast: ?ASTElement;
  render: string;
  staticRenderFns: Array<string>;
  stringRenderFns?: Array<string>;
  errors?: Array<string | WarningMessage>;
  tips?: Array<string | WarningMessage>;
};

declare type ModuleOptions = {
  // transform an AST node before any attributes are processed
  // returning an ASTElement from pre/transforms replaces the element
  preTransformNode: (el: ASTElement) => ?ASTElement;
  // transform an AST node after built-ins like v-if, v-for are processed
  transformNode: (el: ASTElement) => ?ASTElement;
  // transform an AST node after its children have been processed
  // cannot return replacement in postTransform because tree is already finalized
  postTransformNode: (el: ASTElement) => void;
  genData: (el: ASTElement) => string; // generate extra data string for an element
  transformCode?: (el: ASTElement, code: string) => string; // further transform generated code for an element
  staticKeys?: Array<string>; // AST properties to be considered static
};

declare type ASTModifiers = { [key: string]: boolean };
declare type ASTIfCondition = { exp: ?string; block: ASTElement };
declare type ASTIfConditions = Array<ASTIfCondition>;

declare type ASTAttr = {
  name: string;
  value: any;
  /**
   * 用于区分是静态属性还是动态属性，动态属性指是经Vue指令绑定的属性、事件等
   */
  dynamic?: boolean;
  /**
   * 在模板字符串中起始索引
   */
  start?: number;
  /**
   * 在模板字符串中终止索引
   */
  end?: number
};

declare type ASTElementHandler = {
  value: string;
  params?: Array<any>;
  modifiers: ?ASTModifiers;
  dynamic?: boolean;
  start?: number;
  end?: number;
};

declare type ASTElementHandlers = {
  [key: string]: ASTElementHandler | Array<ASTElementHandler>;
};

declare type ASTDirective = {
  name: string;
  rawName: string;
  value: string;
  arg: ?string;
  isDynamicArg: boolean;
  modifiers: ?ASTModifiers;
  start?: number;
  end?: number;
};

/**
 * 定义ASTNode的三种类型：1：标签，2：有表达式的纯文本，3：纯文本
 */
declare type ASTNode = ASTElement | ASTText | ASTExpression;

declare type ASTElement = {
  type: 1;
  tag: string;
  attrsList: Array<ASTAttr>;
  attrsMap: { [key: string]: any };
  rawAttrsMap: { [key: string]: ASTAttr };
  /**
   * 父元素的AST，值或为空
   */
  parent: ASTElement | void;
  /**
   * 子元素的AST数组
   */
  children: Array<ASTNode>;

  start?: number;
  end?: number;

  processed?: true;

  /**
   * 是否为静态元素
   */
  static?: boolean;
  /**
   * 是否为静态根元素
   */
  staticRoot?: boolean;
  /**
   * 静态内容是否在for循环
   */
  staticInFor?: boolean;
  /**
   * 当前元素已经处理过静态内容
   */
  staticProcessed?: boolean;
  /**
   * 元素需要动态编译
   */
  hasBindings?: boolean;

  text?: string;
  attrs?: Array<ASTAttr>;
  dynamicAttrs?: Array<ASTAttr>;
  props?: Array<ASTAttr>;
  /**
   * 没有属性
   */
  plain?: boolean;
  /**
   * 标签上有v-pre指令，标识该元素和子元素不用编译
   */
  pre?: true;
  /**
   * 标签的命名空间
   */
  ns?: string;

  /**
   * component元素的is属性值
   */
  component?: string;
  /**
   * 标签上有inline-template
   */
  inlineTemplate?: true;
  transitionMode?: string | null;
  /**
   * slot标签上的name属性值
   */
  slotName?: ?string;
  /**
   * slot属性的值
   */
  slotTarget?: ?string;
  slotTargetDynamic?: boolean;
  /**
   * 用于作用域插槽时template元素上，表示scope值
   */
  slotScope?: ?string;
  /**
   * 添加作用域插槽时template元素父级上 键值对，键是slotTarget，值是当前template元素
   */
  scopedSlots?: { [name: string]: ASTElement };

  ref?: string;
  /**
   * 是否包含在for循环内
   */
  refInFor?: boolean;

  /**
   * v-if的表达式
   */
  if?: string;
  /**
   * 标识当前元素已经处理过v-if
   */
  ifProcessed?: boolean;
  /**
   * v-else-if的表达式
   */
  elseif?: string;
  /**
   * v-else时为true
   */
  else?: true;
  /**
   * 与v-if相关的一组元素
   */
  ifConditions?: ASTIfConditions;

  /**
   * v-for="item in items"
   * v-for="(item, index) in items" 
   * v-for="(value, key, index) in object"
   * 要遍历的数据items 对象或数组或数字或字符串
   */
  for?: string;
  /**
   * 标识当前元素已经处理过v-for
   */
  forProcessed?: boolean;
  /**
   * 虚拟dom做diff时候的key，这里如果v-for在自定义元素上，则必须有key
   */
  key?: string;
  /**
   * 遍历数组时的元素item或遍历对象时的值value
   */
  alias?: string;
  /**
   * 遍历数组的索引index或遍历对象时的键key
   */
  iterator1?: string;
  /**
   * 遍历对象时的索引index
   */
  iterator2?: string;

  /**
   * 静态class
   */
  staticClass?: string;
  /**
   * 有数据绑定的class表达式
   */
  classBinding?: string;
  /**
   * 静态style
   */
  staticStyle?: string;
  /**
   * 有数据绑定的style表达式
   */
  styleBinding?: string;
  /**
   * 没有.native来修饰添加的事件
   */
  events?: ASTElementHandlers;
  /**
   * 通过.native来修饰添加的事件
   */
  nativeEvents?: ASTElementHandlers;

  transition?: string | true;
  transitionOnAppear?: boolean;

  /**
   * v-model定义双向数据绑定？
   */
  model?: {
    value: string;
    callback: string;
    expression: string;
  };

  /**
   * 存放普通指令相关信息
   */
  directives?: Array<ASTDirective>;

  /**
   * 为true时表示，该标签是style或包含脚本的script
   */
  forbidden?: true;
  /**
   * v-once
   */
  once?: true;
  /**
   * 标识当前元素已经处理过v-once
   */
  onceProcessed?: boolean;
  wrapData?: (code: string) => string;
  wrapListeners?: (code: string) => string;

  // 2.4 ssr optimization
  ssrOptimizability?: number;

  // weex specific
  appendAsTree?: boolean;
};

declare type ASTExpression = {
  type: 2;
  expression: string;
  text: string;
  tokens: Array<string | Object>;
  /**
   * 是否为静态元素
   */
  static?: boolean;
  // 2.4 ssr optimization
  ssrOptimizability?: number;
  start?: number;
  end?: number;
};

declare type ASTText = {
  type: 3;
  text: string;
  /**
   * 是否为静态元素
   */
  static?: boolean;
  /**
   * 是否为注释
   */
  isComment?: boolean;
  // 2.4 ssr optimization
  ssrOptimizability?: number;
  start?: number;
  end?: number;
};

// 单文件组件解析相关的声明
// SFC-parser related declarations

// an object format describing a single-file component
declare type SFCDescriptor = {
  template: ?SFCBlock;
  script: ?SFCBlock;
  styles: Array<SFCBlock>;
  customBlocks: Array<SFCBlock>;
  errors: Array<string | WarningMessage>;
}

declare type SFCBlock = {
  type: string;
  content: string;
  attrs: {[attribute:string]: string};
  start?: number;
  end?: number;
  lang?: string;
  src?: string;
  scoped?: boolean;
  module?: string | boolean;
};
