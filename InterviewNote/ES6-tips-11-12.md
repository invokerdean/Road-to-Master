## 11.Symbol
#### 概述
ES5 的对象属性名都是字符串，这容易造成属性名的冲突。ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。
> Symbol 值通过Symbol函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。Symbol函数前不能使用new命令，否则会报错。
Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。如果 Symbol 的参数是一个对象，就会调用该对象的toString方法，将其转为字符串。Symbol 值不能与其他类型的值进行运算，会报错。但是，Symbol 值可以显式转为字符串。也可以转为布尔值，但是不能转为数值。
```
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'

let sym = Symbol();
Boolean(sym) // true
!sym  // false

Number(sym) // TypeError
sym + 2 // TypeError
```
#### Symbol.prototype.description
```
const sym = Symbol('foo');
sym.description // "foo"
```
#### 作为属性名的 Symbol
```
let mySymbol = Symbol();
// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });
```
> 注意，Symbol 值作为对象属性名时，不能用点运算符。点运算符后面总是字符串，所以不会读取mySymbol作为标识名所指代的那个值，导致a的属性名实际上是一个字符串，而不是一个 Symbol 值。同理，在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。
#### 实例：消除魔术字符串
魔术字符串指的是，在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或者数值。常用的消除魔术字符串的方法，就是把它写成一个变量。这里就很适合改用 Symbol 值。
#### 属性名的遍历
Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。但是，它也不是私有属性，有一个Object.getOwnPropertySymbols方法，返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。另一个新的 API，Reflect.ownKeys方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。
> 由于以 Symbol 值作为名称的属性，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。
#### Symbol.for()，Symbol.keyFor()
* Symbol.for方法接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。
> Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。比如，如果你调用Symbol.for("cat")30 次，每次都会返回同一个 Symbol 值，但是调用Symbol("cat")30 次，会返回 30 个不同的 Symbol 值。
```
Symbol.for("bar") === Symbol.for("bar")
// true

Symbol("bar") === Symbol("bar")
// false
```
* Symbol.keyFor方法返回一个已登记的 Symbol 类型值的key。
```
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```
> Symbol.for为 Symbol 值登记的名字，是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值。
#### 实例：模块的 Singleton 模式
Singleton 模式指的是调用一个类，任何时候返回的都是同一个实例。很容易想到，可以把实例放到顶层对象global。但是，这里有一个问题，全局变量是可写的，任何文件都可以修改。会使得加载mod.js的脚本都失真。为了防止这种情况出现，我们就可以使用 Symbol以保证global[FOO_KEY]不会被无意间覆盖，但还是可以被改写。

#### 内置的 Symbol 值
ES6 提供了 11 个内置的 Symbol 值
###### Symbol.hasInstance
对象的Symbol.hasInstance属性，指向一个内部方法。当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。比如，foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)。实例的Symbol.hasInstance方法，会在进行instanceof运算时自动调用
```
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass() // true
```
###### Symbol.isConcatSpreadable
对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。
```
let arr1 = ['c', 'd'];
['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable] // undefined

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']
```
数组的默认行为是可以展开,Symbol.isConcatSpreadable默认等于undefined。该属性等于true时，也有展开的效果。类似数组的对象正好相反，默认不展开。
###### Symbol.species
对象的Symbol.species属性，指向一个构造函数。创建衍生对象时，会使用该属性。
```
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}

const a = new MyArray();
const b = a.map(x => x);

b instanceof MyArray // false:a.map(x => x)生成的衍生对象，就不是MyArray的实例，而直接就是Array的实例。
b instanceof Array // true
```
```
class T1 extends Promise {
}

class T2 extends Promise {
  static get [Symbol.species]() {
    return Promise;
  }
}

new T1(r => r()).then(v => v) instanceof T1 // true
new T2(r => r()).then(v => v) instanceof T2 // false
```
上面代码中，T2定义了Symbol.species属性，T1没有。结果就导致了创建衍生对象时（then方法），T1调用的是自身的构造方法，而T2调用的是Promise的构造方法。
总之，Symbol.species的作用在于，实例对象在运行过程中，需要再次调用自身的构造函数时，会调用该属性指定的构造函数
###### Symbol.match
Symbol.match属性，指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。
###### Symbol.replace
对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值。
###### Symbol.search
对象的Symbol.search属性，指向一个方法，当该对象被String.prototype.search方法调用时，会返回该方法的返回值
###### Symbol.split
对象的Symbol.split属性，指向一个方法，当该对象被String.prototype.split方法调用时，会返回该方法的返回值
###### Symbol.iterator
对象的Symbol.iterator属性，指向该对象的默认遍历器方法.对象进行for...of循环时，会调用Symbol.iterator方法，返回该对象的默认遍历器
###### Symbol.toPrimitive
对象的Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。

Symbol.toPrimitive被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式。

Number：该场合需要转成数值
String：该场合需要转成字符串
Default：该场合可以转成数值，也可以转成字符串
###### Symbol.toStringTag
对象的Symbol.toStringTag属性，指向一个方法。在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制[object Object]或[object Array]中object后面的那个字符串。
```
// 例一
({[Symbol.toStringTag]: 'Foo'}.toString())
// "[object Foo]"

// 例二
class Collection {
  get [Symbol.toStringTag]() {
    return 'xxx';
  }
}
let x = new Collection();
Object.prototype.toString.call(x) // "[object xxx]"
```
###### Symbol.unscopables
对象的Symbol.unscopables属性，指向一个对象。该对象指定了使用with关键字时，哪些属性会被with环境排除。
```
class MyClass {
  foo() { return 1; }
  get [Symbol.unscopables]() {
    return { foo: true };
  }
}

var foo = function () { return 2; };

with (MyClass.prototype) {
  foo(); // 2
}
```
通过指定Symbol.unscopables属性，使得with语法块不会在当前作用域寻找foo属性，即foo将指向外层作用域的变量。
## 12.Set 和 Map 数据结构
#### Set
类似于数组，但是成员的值都是唯一的，没有重复的值。Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。可以通过add()方法向 Set 结构加入成员
```
[...new Set(array)]//数组去重
```
Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是NaN等于自身。两个对象总是不相等的。let set = new Set();
```
set.add({});
set.size // 1

set.add({});
set.size // 2
```
Set 结构的实例有以下属性。

* Set.prototype.constructor：构造函数，默认就是Set函数。
* Set.prototype.size：返回Set实例的成员总数。

Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

* add(value)：添加某个值，返回 Set 结构本身。
* delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
* has(value)：返回一个布尔值，表示该值是否为Set的成员。
* clear()：清除所有成员，没有返回值。

Set 结构的实例有四个遍历方法，可以用于遍历成员。

* keys()：返回键名的遍历器
* values()：返回键值的遍历器
* entries()：返回键值对的遍历器
* forEach()：使用回调函数遍历每个成员

> 需要特别指出的是，Set的遍历顺序就是插入顺序。

由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致.Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。这意味着，可以省略values方法，直接用for...of循环遍历 Set。
```
for (let x of set) {
  console.log(x);
}
```
扩展运算符（...）内部使用for...of循环，所以也可以用于 Set 结构。数组的map和filter方法也可以间接用于 Set 了。
```
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}
```
使用 Set 结合扩展运算符可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。
> 如果想在遍历操作中，同步改变原来的 Set 结构，目前没有直接的方法，但有两种变通方法。一种是利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；另一种是利用Array.from方法。
#### WeakSet
WeakSet与 Set 有两个区别。首先，WeakSet 的成员只能是对象，而不能是其他类型的值。其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
> 因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

> 由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

任何具有 Iterable 接口的对象，都可以作为 WeakSet 的参数。WeakSet 没有size属性
WeakSet 结构有以下三个方法。

* WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
* WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
* WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。
#### Map
JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。Map 数据结构类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。
```
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```
作为构造函数，Map 也可以接受一个数组作为参数。实际上不仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构（详见《Iterator》一章）都可以当作Map构造函数的参数。Set和Map都可以用来生成新的 Map。
 
> 对同一个键多次赋值，后面的值将覆盖前面的值。如果读取一个未知的键，则返回undefined。
```
map
.set(1, 'aaa')
.set(1, 'bbb');

map.get(1) // "bbb"
new Map().get('asfddfsasadf')
// undefined
```
> 只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。对于简单类型，只要两个值严格相等，Map 将其视为一个键，比如0和-0就是一个键，undefined和null也是两个不同的键。虽然NaN不严格相等于自身，但 Map 将其视为同一个键
```
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```
###### 属性和方法
1. size 属性：size属性返回 Map 结构的成员总数。
2. set(key, value)：set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。set方法返回的是当前的Map对象，因此可以采用链式写法。
3. get(key)：get方法读取key对应的键值，如果找不到key，返回undefined。
4. has(key)：has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
5. delete(key)：delete方法删除某个键，返回true。如果删除失败，返回false。
6. clear()：clear方法清除所有成员，没有返回值。

Map 结构原生提供三个遍历器生成函数和一个遍历方法。
keys()：返回键名的遍历器。
values()：返回键值的遍历器。
entries()：返回所有成员的遍历器。
forEach()：遍历 Map 的所有成员。
> 与Set一样，Map 的遍历顺序就是插入顺序。Map 结构的默认遍历器接口（Symbol.iterator属性），就是entries方法。Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）。
```
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```
与Set相同，结合数组的map方法、filter方法，可以实现 Map 的遍历和过滤（Map 本身没有map和filter方法）。
（Map 转为 JSON 要区分两种情况。一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON。JSON 转为 Map，正常情况下，所有键名都是字符串。有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为 Map。这往往是 Map 转为数组 JSON 的逆操作。）
#### WeakMap
WeakMap与Map的区别有两点。首先，WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。其次，WeakMap的键名所指向的对象，不计入垃圾回收机制。
> 基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用WeakMap结构。当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除。WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。

WeakMap 与 Map 在 API 上的区别主要是两个，一是没有遍历操作（即没有keys()、values()和entries()方法），也没有size属性。因为没有办法列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关。二是无法清空，即不支持clear方法。

> WeakMap只有四个方法可用：get()、set()、has()、delete()。

WeakMap 应用的典型场合就是 DOM 节点作为键名。另一个用处是部署私有属性。


