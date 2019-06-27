## Symbol
#### 概述
ES5 的对象属性名都是字符串，这容易造成属性名的冲突。ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。
> Symbol 值通过Symbol函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。Symbol函数前不能使用new命令，否则会报错。

#### Symbol.prototype.description
#### 作为属性名的 Symbol
#### 实例：消除魔术字符串
#### 属性名的遍历
#### Symbol.for()，Symbol.keyFor()
#### 实例：模块的 Singleton 模式
#### 内置的 Symbol 值
