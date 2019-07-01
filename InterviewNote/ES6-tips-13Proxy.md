## 13.Proxy
#### 概述
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

> Proxy 实际上重载（overload）了点运算符，即用自己的定义覆盖了语言的原始定义。
```
var proxy = new Proxy(target, handler);
```
target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。一个技巧是将 Proxy 对象，设置到object.proxy属性，从而可以在object对象上调用。Proxy 实例也可以作为其他对象的原型对象。


#### Proxy 实例的方法
###### get()
get方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。
```
let proto = new Proxy({}, {
  get(target, propertyKey, receiver) {
    console.log('GET ' + propertyKey);
    return target[propertyKey];
  }
});

let obj = Object.create(proto);
obj.foo // "GET foo"
```
> get方法可以继承。拦截操作定义在Prototype对象上面，所以如果读取obj对象继承的属性时，拦截会生效。

get方法的第三个参数总是指向原始的读操作所在的那个对象，一般情况下就是 Proxy 实例。

const proxy = new Proxy({}, {
  get: function(target, property, receiver) {
    return receiver;
  }
});
proxy.getReceiver === proxy // true

> 如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错。
```
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo
// TypeError: Invariant check failed
```
###### set()
set方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。

有时，我们会在对象上面设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用。结合get和set方法，就可以做到防止这些内部属性被外部读写。
```
const handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property
```
set方法的第四个参数receiver，指的是原始的操作行为所在的那个对象，一般情况下是proxy实例本身
```
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
const proxy = new Proxy({}, handler);
const myObj = {};
Object.setPrototypeOf(myObj, proxy);

myObj.foo = 'bar';
myObj.foo === myObj // true
proxy.foo === myObj // true
```
> 设置myObj.foo属性的值时，myObj并没有foo属性，因此引擎会到myObj的原型链去找foo属性。myObj的原型对象proxy是一个 Proxy 实例，设置它的foo属性会触发set方法。这时，第四个参数receiver就指向原始赋值行为所在的对象myObj。

如果目标对象自身的某个属性，不可写且不可配置，那么set方法将不起作用。
> 严格模式下，set代理如果没有返回true，就会报错。
###### apply()
apply方法拦截函数的调用、call和apply操作。apply方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。
```
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30

//直接调用Reflect.apply方法，也会被拦截。
Reflect.apply(proxy, null, [9, 10]) // 38
```
###### has()
has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。has方法可以接受两个参数，分别是目标对象、需查询的属性名。如果原对象不可配置或者禁止扩展，这时has拦截会报错。(Object.preventExtensions(obj);)
```
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false
```
> has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性。另外，虽然for...in循环也用到了in运算符，但是has拦截对for...in循环不生效。
###### construct()
construct方法用于拦截new命令，construct方法可以接受两个参数。
* target：目标对象
* args：构造函数的参数对象
* newTarget：创造实例对象时，new命令作用的构造函数（下面例子的p）
```
var p = new Proxy(function () {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
});

(new p(1)).value
// "called: 1"
// 10
```
construct方法返回的必须是一个对象，否则会报错。
###### deleteProperty()
deleteProperty方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。
###### defineProperty()
defineProperty方法拦截了Object.defineProperty操作。
```
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar' // 不会生效,既不能修改，也不能增加
```
> 如果目标对象不可扩展（non-extensible），则defineProperty不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（writable）或不可配置（configurable），则defineProperty方法不得改变这两个设置。
###### getOwnPropertyDescriptor()
getOwnPropertyDescriptor方法拦截Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined。
###### getPrototypeOf()
getPrototypeOf方法主要用来拦截获取对象原型。具体来说，拦截下面这些操作。
* Object.prototype.__proto__
* Object.prototype.isPrototypeOf()
* Object.getPrototypeOf()
* Reflect.getPrototypeOf()
* instanceof
getPrototypeOf方法的返回值必须是对象或者null，否则报错。另外，如果目标对象不可扩展（non-extensible）， getPrototypeOf方法必须返回目标对象的原型对象。
###### isExtensible()
isExtensible方法拦截Object.isExtensible操作。该方法只能返回布尔值，否则返回值会被自动转为布尔值。
> 这个方法有一个强限制，它的返回值必须与目标对象的isExtensible属性保持一致，否则就会抛出错误。
###### ownKeys()
ownKeys方法用来拦截对象自身属性的读取操作。具体来说，拦截以下操作。
* Object.getOwnPropertyNames()
* Object.getOwnPropertySymbols()
* Object.keys()
* for...in循环
> 使用Object.keys方法时，有三类属性会被ownKeys方法自动过滤，不会返回。1.目标对象上不存在的属性2.属性名为 Symbol 值3.不可遍历（enumerable）的属性
```
let target = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.for('secret')]: '4',
};

Object.defineProperty(target, 'key', {
  enumerable: false,
  configurable: true,
  writable: true,
  value: 'static'
});

let handler = {
  ownKeys(target) {
    return ['a', 'd', Symbol.for('secret'), 'key'];
  }
};

let proxy = new Proxy(target, handler);

Object.keys(proxy)
// ['a']
```
* ownKeys方法返回的数组成员，只能是字符串或 Symbol 值。如果有其他类型的值，或者返回的根本不是数组，就会报错。
* 如果目标对象自身包含不可配置的属性，则该属性必须被ownKeys方法返回，否则报错。
* 如果目标对象是不可扩展的（non-extensible），这时ownKeys方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错。
###### preventExtensions()
preventExtensions方法拦截Object.preventExtensions()。该方法必须返回一个布尔值，否则会被自动转为布尔值。
> 只有目标对象不可扩展时（即Object.isExtensible(proxy)为false），proxy.preventExtensions才能返回true，否则会报错。为了防止出现这个问题，通常要在proxy.preventExtensions方法里面，调用一次Object.preventExtensions。
###### setPrototypeOf()
setPrototypeOf方法主要用来拦截Object.setPrototypeOf方法。
> 该方法只能返回布尔值，否则会被自动转为布尔值。另外，如果目标对象不可扩展（non-extensible），setPrototypeOf方法不得改变目标对象的原型。
#### Proxy.revocable()
Proxy.revocable方法返回一个可取消的 Proxy 实例。Proxy.revocable方法返回一个对象，该对象的proxy属性是Proxy实例，revoke属性是一个函数，可以取消Proxy实例。一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。
```
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```
#### this 问题
在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。有些原生对象的内部属性，只有通过正确的this才能拿到，所以 Proxy 也无法代理这些原生对象的属性。
```
const target = {
  m: function () {
    console.log(this === proxy);
  }
};
const handler = {};

const proxy = new Proxy(target, handler);

target.m() // false
proxy.m()  // true
```
#### 实例：Web 服务的客户端
Proxy 对象可以拦截目标对象的任意属性，这使得它很合适用来写 Web 服务的客户端。
