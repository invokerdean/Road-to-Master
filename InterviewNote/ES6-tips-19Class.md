#### 简介
ES6 的类，完全可以看作构造函数的另一种写法。
```
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```
> 定义“类”的方法的时候，前面不需要加上function这个关键字，直接把函数定义放进去了就可以了。另外，方法之间不需要逗号分隔，加了会报错。

构造函数的prototype属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面。在类的实例上面调用方法，其实就是调用原型上的方法。Object.assign方法可以很方便地一次向类添加多个方法。
```
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}
// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```
prototype对象的constructor属性，直接指向“类”的本身，这与 ES5 的行为是一致的。

类的内部所有定义的方法，都是不可枚举的（non-enumerable）。这一点与 ES5 的行为不一致。
```
//ES6
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []

//ES5
var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function() {
  // ...
};

Object.keys(Point.prototype)
// ["toString"]
```
###### constructor 方法
constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
> 类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别
###### 类的实例
实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。类的所有实例共享一个原型对象。可以通过实例的__proto__属性为“类”添加方法。但依旧不建议在生产中使用该属性，避免对环境产生依赖。
###### 取值函数（getter）和存值函数（setter）
与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。存值函数和取值函数是设置在属性的Descriptor 对象上的。
###### 属性表达式
类的属性名，可以采用表达式。
```
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```
###### Class 表达式 § ⇧
与函数一样，类也可以使用表达式的形式定义。
```
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```
> 这个类的名字是Me，但是Me只在 Class 的内部可用，指代当前类。在 Class 外部，这个类只能用MyClass引用。
如果类的内部没用到的话，可以省略Me，也就是可以写成下面的形式。
```
const MyClass = class { /* ... */ };
```
采用 Class 表达式，可以写出立即执行的 Class。
```
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```
* 类和模块的内部，默认就是严格模式
* 类不存在变量提升（hoist），这一点与 ES5 完全不同。这种规定的原因与下文要提到的继承有关，必须保证子类在父类之后定义。
* name属性总是返回紧跟在class关键字后面的类名。
* 如果某个方法之前加上星号,就表示该方法是一个 Generator 函数。
```
class Foo {
  constructor(...args) {
    this.args = args;
  }
  * [Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}

for (let x of new Foo('hello', 'world')) {
  console.log(x);
}
// hello
// world
```
* 类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。
> 一个比较简单的解决方法是，在构造方法中绑定this，这样就不会找不到print方法了。另一种解决方法是使用箭头函数。箭头函数内部的this总是指向定义时所在的对象。还有一种解决方法是使用Proxy，获取方法的时候，自动绑定this。(略过)
#### 静态方法
如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
> 如果静态方法包含this关键字，这个this指的是类，而不是实例。

父类的静态方法，可以被子类继承。
```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'
```
静态方法也是可以从super对象上调用的。
#### 实例属性的新写法
实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。这时，不需要在实例属性前面加上this
#### 静态属性
静态属性指的是 Class 本身的属性，即Class.propName，而不是定义在实例对象（this）上的属性。目前，只有这种写法可行
```
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
```
#### 私有方法和私有属性
ES6 不提供，只能通过变通方法模拟实现。
* 一种做法是在命名上加以区别。(加下划线)在类的外部，还是可以调用到这个方法。
* 另一种方法就是索性将私有方法移出模块，因为模块内部的所有方法都是对外可见的。
* 还有一种方法是利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值。一般情况下无法获取到它们，因此达到了私有方法和私有属性的效果。但是也不是绝对不行，Reflect.ownKeys()依然可以拿到它们。

> 提案：私有属性在属性名之前，使用#表示。井号#是属性名的一部分，使用时必须带有#一起使用，所以#x和x是两个不同的属性。这种写法不仅可以写私有属性，还可以用来写私有方法。私有属性也可以设置 getter 和 setter 方法。私有属性不限于从this引用，只要是在类的内部，实例也可以引用私有属性。
#### new.target 属性
该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。
```
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
```
上面代码确保构造函数只能通过new命令调用。
> 子类继承父类时，new.target会返回子类。
```
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
```
——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

## 继承
#### 简介
#### Object.getPrototypeOf()
#### super 关键字
#### 类的 prototype 属性和__proto__属性
#### 原生构造函数的继承
#### Mixin 模式的实现
