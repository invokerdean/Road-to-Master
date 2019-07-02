#### Iterator（遍历器）的概念
Iterator 的遍历过程是这样的。

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的next方法，直到它指向数据结构的结束位置。

每一次调用next方法，都会返回数据结构的当前成员的信息,即返回一个包含value和done两个属性的对象。其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。
 ```
 //模拟实现
 function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++]} :
        {done: true};
    }
  };
}
```
#### 默认 Iterator 接口
Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即for...of循环.当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。ES6 规定，默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”,该对象的根本特征就是具有next方法。

原生具备 Iterator 接口的数据结构如下。调用这个接口，就会返回一个遍历器对象。除此之外，其他数据结构（主要是对象）的 Iterator 接口，都需要自己在Symbol.iterator属性上面部署，这样才会被for...of循环遍历:
* Array
* Map
* Set
* String
* TypedArray
* 函数的 arguments 对象
* NodeList 对象

```
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }//返回自身作为遍历器对象

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    }
    return {done: true, value: undefined};
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}
```
> 对于类似数组的对象（存在数值键名和length属性），部署 Iterator 接口，有一个简便方法，就是Symbol.iterator方法直接引用数组的 Iterator 接口。普通对象部署数组的Symbol.iterator方法，并无效果。如果Symbol.iterator方法对应的不是遍历器生成函数（即会返回一个遍历器对象），解释引擎将会报错
#### 调用 Iterator 接口的场合
1. 解构赋值:对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。
2. 扩展运算符（...）也会调用默认的 Iterator 接口
3. yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。
4. 数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。
* for...of
* Array.from()
* Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
* Promise.all()
* Promise.race()

#### 字符串的 Iterator 接口
可以覆盖原生的Symbol.iterator方法，达到修改遍历器行为的目的。
```
var str = new String("hi");

[...str] // ["h", "i"]

str[Symbol.iterator] = function() {
  return {
    next: function() {
      if (this._first) {
        this._first = false;
        return { value: "bye", done: false };
      } else {
        return { done: true };
      }
    },
    _first: true
  };
};

[...str] // ["bye"]
str // "hi"
```
#### Iterator 接口与 Generator 函数
Symbol.iterator方法的最简单实现，还是使用下一章要介绍的 Generator 函数。
```
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
}
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法
let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// "hello"// "world"
```

#### 遍历器对象的 return()，throw()
遍历器对象除了具有next方法，还可以具有return方法和throw方法。如果你自己写遍历器对象生成函数，那么next方法是必须部署的，return方法和throw方法是否部署是可选的。
 
* return方法的使用场合是，如果for...of循环提前退出（通常是因为出错，或者有break语句），就会调用return方法。
* throw方法主要是配合 Generator 函数使用，一般的遍历器对象用不到这个方法
```
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false };
        },
        return() {
          file.close();
          return { done: true };
        }
      };
    },
  };
}
```
#### for...of 循环
###### 数组
数组原生具备iterator接口（即默认部署了Symbol.iterator属性），for...of循环本质上就是调用这个接口产生的遍历器
```
const arr = ['red', 'green', 'blue'];

for(let v of arr) {
  console.log(v); // red green blue
}

const obj = {};
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr);

for(let v of obj) {
  console.log(v); // red green blue
}
```
JavaScript 原有的for...in循环，只能获得对象的键名，不能直接获取键值。ES6 提供for...of循环，允许遍历获得键值。如果要通过for...of循环，获取数组的索引，可以借助数组实例的entries方法和keys方法;

> for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。这一点跟for...in循环也不一样。
```
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}
```
###### Set 和 Map 结构
Set 结构遍历时，返回的是一个值，而 Map 结构遍历时，返回的是一个数组
###### 计算生成的数据结构
* entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。
* keys() 返回一个遍历器对象，用来遍历所有的键名。
* values() 返回一个遍历器对象，用来遍历所有的键值。
###### 类似数组的对象
类似数组的对象包括字符串、DOM NodeList 对象、arguments对象等
> 并不是所有类似数组的对象都具有 Iterator 接口，一个简便的解决方法，就是使用Array.from方法将其转为数组。
```
let arrayLike = { length: 2, 0: 'a', 1: 'b' };

// 报错
for (let x of arrayLike) {
  console.log(x);
}

// 正确
for (let x of Array.from(arrayLike)) {
  console.log(x);
}
```
对于字符串来说，for...of循环还有一个特点，就是会正确识别 32 位 UTF-16 字符。
####### 对象
对于普通的对象，for...of结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。但是，这样情况下，for...in循环依然可以用来遍历键名。
一种解决方法是，使用Object.keys方法将对象的键名生成一个数组，然后遍历这个数组
```
for (var key of Object.keys(someObject)) {
  console.log(key + ': ' + someObject[key]);
}
```
另一个方法是使用 Generator 函数将对象重新包装一下。

###### 遍历方法对比
* ForEach：这种写法的问题在于，无法中途跳出forEach循环，break命令或return命令都不能奏效。
* for...in循环有几个缺点。
1. 数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等。
2. for...in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
3. 某些情况下，for...in循环会以任意顺序遍历键名。总之，for...in循环主要是为遍历对象而设计的，不适用于遍历数组。
* for...of:
1. 有着同for...in一样的简洁语法，但是没有for...in那些缺点。（只遍历自身可遍历的属性）
2. 不同于forEach方法，它可以与break、continue和return配合使用。
3. 提供了遍历所有数据结构的统一操作接口。
