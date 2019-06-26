## 9.对象的扩展
#### 属性的简洁表示法
```
const foo = 'bar';
const baz = {foo};
baz // {foo: "bar"}

// 等同于
const baz = {foo: foo};
```
方法也可以简写:
```
const o = {
  method() {
    return "Hello!";
  }
};

// 等同于

const o = {
  method: function() {
    return "Hello!";
  }
};
```
简洁写法的属性名总是字符串，这会导致一些看上去比较奇怪的结果。如果某个方法的值是一个 Generator 函数，前面需要加上星号。
```
const obj = {
  class () {}
};

// 等同于

var obj = {
  'class': function() {}
};
```
#### 属性名表达式
* ES5:如果使用字面量方式定义对象（使用大括号），只能使用方法一（标识符）定义属性。
* ES6:允许字面量定义对象时，用方法二（表达式）作为对象的属性名，即把表达式放在方括号内。
```
let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};
```
表达式还可以用于定义方法名。
```
let obj = {
  ['h' + 'ello']() {
    return 'hi';
  }
};
```
> 属性名表达式与简洁表示法，不能同时使用，会报错。属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串[object Object]
```
const keyA = {a: 1};
const keyB = {b: 2};

const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
};

myObject // Object {[object Object]: "valueB"}
```
#### 方法的 name 属性
对象方法也是函数，因此也有name属性。
> 如果对象的方法使用了取值函数（getter）和存值函数（setter），则name属性不是在该方法上面，而是该方法的属性的描述对象的get和set属性上面，返回值是方法名前加上get和set。
```
const obj = {
  get foo() {},
  set foo(x) {}
};

obj.foo.name
// TypeError: Cannot read property 'name' of undefined

const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');

descriptor.get.name // "get foo"
descriptor.set.name // "set foo"
```
bind方法创造的函数，name属性返回bound加上原函数的名字；Function构造函数创造的函数，name属性返回anonymous。如果对象的方法是一个 Symbol 值，那么name属性返回的是这个 Symbol 值的描述。
```
const key1 = Symbol('description');
const key2 = Symbol();
let obj = {
  [key1]() {},//属性表达式可以和方法的简写一起用
  [key2]() {},
};
obj[key1].name // "[description]"
obj[key2].name // ""
```
#### 属性的可枚举性和遍历
* 对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。
有四个操作会忽略enumerable为false的属性。
1. for...in循环：只遍历对象自身的和继承的可枚举的属性。（引入“可枚举”（enumerable）这个概念的最初目的，就是让某些属性可以规避掉for...in操作，避免内部属性（继承自原型）被遍历）
2. Object.keys()：返回对象自身的所有可枚举的属性的键名。
3. JSON.stringify()：只串行化对象自身的可枚举的属性。
4. Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。（ES6新增）
ES6 规定，所有 Class 的原型的方法都是不可枚举的。

>  如果指定的属性在指定的对象或其原型链中，则in 运算符返回true。

* 属性的遍历
1. for...in
> for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
2. Object.keys(obj)
> Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
3. Object.getOwnPropertyNames(obj)
> Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
4. Object.getOwnPropertySymbols(obj)
> Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。
5. Reflect.ownKeys(obj)
> Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

首先遍历所有数值键，按照数值升序排列。其次遍历所有字符串键，按照加入时间升序排列。最后遍历所有 Symbol 键，按照加入时间升序排列。

#### super 关键字
关键字super，指向当前对象的原型对象。super.foo等同于Object.getPrototypeOf(this).foo（属性）或Object.getPrototypeOf(this).foo.call(this)（方法）
> super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。目前，只有对象方法的简写法可以让 JavaScript 引擎确认，定义的是对象的方法。
#### 对象的扩展运算符（总的来说，还略有点懵逼）
扩展运算符（...）。ES2018 将这个运算符引入了对象。对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。
```
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }变量z是解构赋值所在的对象。它获取等号右边的所有尚未读取的键（a和b），将它们连同值一起拷贝过来。(解构赋值的拷贝是浅拷贝)
```
对象的解构赋值要求等号右边是一个对象，且扩展运算符必须是最后一个参数，否则会报错。
```
let { x, ...y, ...z } = someObject; // 句法错误
```
扩展运算符的解构赋值，不能复制继承自原型对象的属性。单纯的解构赋值，可以读取对象o继承的属性
```
const o = Object.create({ x: 1, y: 2 });
o.z = 3;

let { x, ...newObj } = o;
let { y, z } = newObj;
x // 1
y // undefined
z // 3
```
使用解构赋值，扩展运算符后面必须是一个变量名，而不能是一个解构赋值表达式
```
let { x, ...{ y, z } } = o;//err
```
数组是特殊的对象，所以对象的扩展运算符也可以用于数组。如果扩展运算符后面是一个空对象，则没有任何效果,不存在。如果扩展运算符后面不是对象，则会自动将其转为对象。对象的扩展运算符等同于使用Object.assign()方法。
```
{...1} // {};自动转为数值的包装对象Number{1}。由于该对象没有自身属性，所以返回一个空对象。
let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);
```
完整克隆一个对象，还拷贝对象原型的属性
```
// 写法一
const clone1 = {
  __proto__: Object.getPrototypeOf(obj),
  ...obj
};

// 写法二
const clone2 = Object.assign(
  Object.create(Object.getPrototypeOf(obj)),
  obj
);

// 写法三
const clone3 = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
)
```
如果用户自定义的属性，放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉。可以用于修改对象属性。扩展运算符的参数对象之中，如果有取值函数get，这个函数是会执行的。
## 10.对象新增方法
#### Object.is()
* ES5:相等运算符（==）和严格相等运算符（===）。它们都有缺点，前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0
* ES6:在所有环境中，只要两个值是一样的，它们就应该相等。（“Same-value equality”（同值相等）算法）
#### Object.assign()
Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。第一个参数是目标对象，后面的参数都是源对象。参数不是对象，则会先转成对象，非首参数无法转换会跳过，首参数会报错。undefined和null无法转成对象，所以如果它们作为首个参数，就会报错。

其他类型的值（即数值、字符串和布尔值）不在首参数（在首参数也不会，亲测），也不会报错。但是，除了字符串会以数组形式，拷贝入目标对象，其他值都不会产生效果。因为只有字符串的包装对象，会产生可枚举属性。它们的原始值都在包装对象的内部属性[[PrimitiveValue]]上面，这个属性是不会被Object.assign拷贝的。
```
Object(true) // {[[PrimitiveValue]]: true}
Object(10)  //  {[[PrimitiveValue]]: 10}
Object('abc') // {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}
```
#### Object.getOwnPropertyDescriptors()
#### __proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()
#### Object.keys()，Object.values()，Object.entries()
#### Object.fromEntries()
