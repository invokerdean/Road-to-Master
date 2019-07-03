#### 简介
Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。
* 语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。
* 形式上，Generator 函数是一个普通函数，但是有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态

调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象。下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。换言之，Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，因此等于为 JavaScript 提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。
```
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }//如果没有return语句，则value属性的值为undefined

hw.next()
// { value: undefined, done: true }//以后再调用next方法，返回的都是这个值。
```
> yield和return区别在于每次遇到yield，函数暂停执行，下一次再从该位置继续向后执行，而return语句不具备位置记忆的功能。一个函数里面，只能执行一次（或者说一个）return语句，但是可以执行多次（或者说多个）yield表达式。

> yield表达式只能用在 Generator 函数里面，用在其他地方都会报错。yield表达式如果用在另一个表达式之中，必须放在圆括号里面。yield表达式用作函数参数或放在赋值表达式的右边，可以不加括号。


由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口。
```
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3
```
Generator 函数执行后，返回一个遍历器对象。该对象本身也具有Symbol.iterator属性，执行后返回自身。
#### next 方法的参数

#### for...of 循环
#### Generator.prototype.throw()
#### Generator.prototype.return()
#### next()、throw()、return() 的共同点
#### yield* 表达式
#### 作为对象属性的 Generator 函数
#### Generator 函数的this
#### 含义
#### 应用
