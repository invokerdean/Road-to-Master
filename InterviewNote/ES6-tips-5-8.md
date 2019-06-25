## 5.RegExp扩展
#### RegExp 构造函数
ES5:
```
var regex = new RegExp('xyz', 'i');//√
var regex = new RegExp(/xyz/i);//√

var regex = new RegExp(/xyz/, 'i');
// Uncaught TypeError: Cannot supply flags when constructing one RegExp from another
```
ES6:
若第一个参数是正则表达式，且指定了第二个参数，则会覆盖原有修饰符
#### 字符串的正则方法
字符串对象共有 4 个方法，可以使用正则表达式：match()、replace()、search()和split()。ES6 将这 4 个方法，在语言内部全部调用RegExp的实例方法，
#### u 修饰符
u修饰符，含义为“Unicode 模式”，用来正确处理大于\uFFFF的 Unicode 字符。也就是说，会正确处理四个字节的 UTF-16 编码。
```
/^\uD83D/u.test('\uD83D\uDC2A') // false
/^\uD83D/.test('\uD83D\uDC2A') // true
```
用法：
```
var s = '𠮷';

/^.$/.test(s) // false
/^.$/u.test(s) // true

/\u{61}/.test('a') // false
/\u{61}/u.test('a') // true

/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true

/^\S$/.test('𠮷') // false,\S是预定义模式，匹配所有非空白字符
/^\S$/u.test('𠮷') // true

/[a-z]/i.test('\u212A') // false
/[a-z]/iu.test('\u212A') // true识别非规范的K
```
#### RegExp.prototype.unicode 属性
```
const r1 = /hello/;
const r2 = /hello/u;

r1.unicode // false
r2.unicode // true
```
表示是否设置了u修饰符
#### y 修饰符
“粘连”（sticky）修饰符。y修饰符的作用与g修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。不同之处在于，g修饰符只要剩余位置中存在匹配就可，而y修饰符确保匹配必须从剩余的第一个位置开始，这也就是“粘连”的涵义。其本质是要求必须在lastIndex指定的位置发现匹配，否则返回null。
> 实际上，y修饰符号隐含了头部匹配的标志^
```
/b/y.exec('aba')
// null
```
上面代码由于不能保证头部匹配，所以返回null。y修饰符的设计本意，就是让头部匹配的标志^在全局匹配中都有效。
y修饰符的一个应用，是从字符串提取 token（词元），y修饰符确保了匹配之间不会有漏掉的字符。
> 特别的，单单一个y修饰符对match方法，只能返回第一个匹配，必须与g修饰符联用，才能返回所有匹配。
#### RegExp.prototype.sticky 属性
表示是否设置了y修饰符。
#### RegExp.prototype.flags 属性
返回正则表达式的修饰符
#### s 修饰符：dotAll 模式
正则表达式中，点（.）是一个特殊字符，代表任意的单个字符，但是有两个例外。一个是四个字节的 UTF-16 字符，这个可以用u修饰符解决；另一个是行终止符（line terminator character）。所谓行终止符，就是该字符表示一行的终结。以下四个字符属于“行终止符”。

U+000A 换行符（\n）
U+000D 回车符（\r）
U+2028 行分隔符（line separator）
U+2029 段分隔符（paragraph separator）

s修饰符，使得.可以匹配任意单个字符。这被称为dotAll模式，即点（dot）代表一切字符。所以，正则表达式还引入了一个dotAll属性，返回一个布尔值，表示该正则表达式是否处在dotAll模式。
#### 后行断言
* “先行断言”指的是，x只有在y前面才匹配，必须写成/x(?=y)/
* “先行否定断言”指的是，x只有不在y前面才匹配，必须写成/x(?!y)/
* “后行断言”：x只有在y后面才匹配，必须写成/(?<=y)x/
* “后行否定断言”：x只有不在y后面才匹配，必须写成/(?<!y)x/。
“后行断言”的实现，需要先匹配/(?<=y)x/的x，然后再回到左边，匹配y的部分。
```
/(?<=(\d+)(\d+))$/.exec('1053') // ["", "1", "053"]右边先，贪婪模式
/^(\d+)(\d+)$/.exec('1053') // ["1053", "105", "3"]左边先，贪婪模式
```
“后行断言”的反斜杠引用，也与通常的顺序相反，必须放在对应的那个括号之前。(这个没太懂)
#### Unicode 属性类
\p{...}和\P{...}，允许正则表达式匹配符合 Unicode 某种属性的所有字符。
\p{UnicodePropertyName=UnicodePropertyValue}
对于某些属性，可以只写属性名，或者只写属性值。
> 使用的时候一定要加上u修饰符
\p{UnicodePropertyName}
\p{UnicodePropertyValue}
```
const regexGreekSymbol = /\p{Script=Greek}/u;
regexGreekSymbol.test('π') // true

const regex = /^\p{Decimal_Number}+$/u;
regex.test('𝟏𝟐𝟑𝟜𝟝𝟞𝟩𝟪𝟫𝟬𝟭𝟮𝟯𝟺𝟻𝟼') // true
```
#### 具名组匹配
ES2018 引入了具名组匹配（Named Capture Groups），允许为每一个组匹配指定一个名字,“具名组匹配”在圆括号内部，模式的头部添加“问号 + 尖括号 + 组名”（?<year>）,如果具名组没有匹配，那么对应的groups对象属性会是undefined。并且对应键名在groups是始终存在的。
```
const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj.groups.year; // 1999
const month = matchObj.groups.month; // 12
const day = matchObj.groups.day; // 31
 ```
解构赋值：
```
let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar');
one  // foo
two  // bar
```
字符串替换时，使用$<组名>引用具名组。
 ```
 let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;

'2015-01-02'.replace(re, '$<day>/$<month>/$<year>')
// '02/01/2015'
 ```
 > replace() 方法返回一个由替换值（replacement）替换一些或所有匹配的模式（pattern）后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。
  
如果要在正则表达式内部引用某个“具名组匹配”，可以使用\k<组名>的写法。
```
const RE_TWICE = /^(?<word>[a-z]+)!\k<word>$/;
RE_TWICE.test('abc!abc') // true
RE_TWICE.test('abc!ab') // false

const RE_TWICE = /^(?<word>[a-z]+)!\1$/;//数字引用：\1
RE_TWICE.test('abc!abc') // true
RE_TWICE.test('abc!ab') // false

const RE_TWICE = /^(?<word>[a-z]+)!\k<word>!\1$/;
RE_TWICE.test('abc!abc!abc') // true
RE_TWICE.test('abc!abc!ab') // false
```
#### String.prototype.matchAll
如果一个正则表达式在字符串里面有多个匹配，现在一般使用g修饰符或y修饰符，在循环里面逐一取出。目前有一个提案，增加了String.prototype.matchAll方法，可以一次性取出所有匹配。不过，它返回的是一个遍历器（Iterator），而不是数组。相对于返回数组，返回遍历器的好处在于，如果匹配结果是一个很大的数组，那么遍历器比较节省资源
## 6.数值扩展
#### 二进制和八进制表示法
ES6 提供了二进制和八进制数值的新的写法，分别用前缀0b（或0B）和0o（或0O）表示。
```
0b111110111 === 503 // true
0o767 === 503 // true
```
如果要将0b和0o前缀的字符串数值转为十进制，要使用Number方法。
#### Number.isFinite(), Number.isNaN()
Number.isFinite()用来检查一个数值是否为有限的（finite），即不是Infinity。如果参数类型不是数值，Number.isFinite一律返回false。
它们与传统的全局方法isFinite()和isNaN()的区别在于，传统方法先调用Number()将非数值的值转为数值，再进行判断，而这两个新方法只对数值有效，Number.isFinite()对于非数值一律返回false, Number.isNaN()只有对于NaN才返回true，非NaN一律返回false。
#### Number.parseInt(), Number.parseFloat()
ES6 将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。这样做的目的，是逐步减少全局性方法，使得语言逐步模块化。
#### Number.isInteger()
JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。如果参数不是数值，Number.isInteger返回false
```
Number.isInteger(25) // true
Number.isInteger(25.0) // true
```
JavaScript 采用 IEEE 754 标准，数值存储为64位双精度格式，数值精度最多可以达到 53 个二进制位（1 个隐藏位与 52 个有效位）。如果数值的精度超过这个限度，第54位及后面的位就会被丢弃，这种情况下，Number.isInteger可能会误判。
```
Number.isInteger(3.0000000000000002) // true
```
类似的情况还有，如果一个数值的绝对值小于Number.MIN_VALUE（5E-324），即小于 JavaScript 能够分辨的最小值，会被自动转为 0。这时，Number.isInteger也会误判。
```
Number.isInteger(5E-324) // false

Number.isInteger(5E-325) // true
```
#### Number.EPSILON
ES6 在Number对象上面，新增一个极小的常量Number.EPSILON。根据规格，它表示 1 与大于 1 的最小浮点数之间的差。
对于 64 位浮点数来说，大于 1 的最小浮点数相当于二进制的1.00..001，小数点后面有连续 51 个零。这个值减去 1 之后，就等于 2 的 -52 次方。
Number.EPSILON实际上是 JavaScript 能够表示的最小精度。误差如果小于这个值，就可以认为已经没有意义了，即不存在误差了。
引入一个这么小的量的目的，在于为浮点数计算，设置一个误差范围。我们知道浮点数计算是不精确的。

Number.EPSILON可以用来设置“能够接受的误差范围”。比如，误差范围设为 2 的-50 次方（即Number.EPSILON * Math.pow(2, 2)），即如果两个浮点数的差小于这个值，我们就认为这两个浮点数相等。
```
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```
#### 安全整数和 Number.isSafeInteger()
JavaScript 能够准确表示的整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值。
ES6 引入了Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限。Number.isSafeInteger()则是用来判断一个整数是否落在这个范围之内。
实际使用这个函数时，需要注意。验证运算结果是否落在安全整数的范围内，不要只验证运算结果，而要同时验证参与运算的每个值。
#### Math 对象的扩展
ES6 在 Math 对象上新增了 17 个与数学相关的方法。所有这些方法都是静态方法，只能在 Math 对象上调用。
* Math.trunc()方法用于去除一个数的小数部分，返回整数部分。对于非数值，Math.trunc内部使用Number方法将其先转为数值。对于空值和无法截取整数的值，返回NaN。
* Math.sign()方法用来判断一个数到底是正数、负数、还是零。
>参数为正数，返回+1；
参数为负数，返回-1；
参数为 0，返回0；
参数为-0，返回-0;对于非数值，会先将其转换为数值。如果参数是非数值，会自动转为数值。对于那些无法转为数值的值，会返回NaN。
* Math.cbrt()方法用于计算一个数的立方根。
* Math.clz32()方法将参数转为 32 位无符号整数的形式，然后返回这个 32 位值里面有多少个前导 0。clz32这个函数名就来自”count leading zero bits in 32-bit binary representation of a number“（计算一个数的 32 位二进制形式的前导 0 的个数）
> 对于小数，Math.clz32方法只考虑整数部分。
* Math.imul()方法返回两个数以 32 位带符号整数形式相乘的结果，返回的也是一个 32 位的带符号整数。大多数情况下，Math.imul(a, b)与a * b的结果是相同的
* Math.fround方法返回一个数的32位单精度浮点数形式。
> 数值精度是24个二进制位（1 位隐藏位与 23 位有效位），所以对于 -224 至 224 之间的整数（不含两个端点），返回结果与参数本身一致。
* Math.hypot方法返回所有参数的平方和的平方根
* Math.expm1(x)返回 ex - 1，即Math.exp(x) - 1。
* Math.log1p(x)方法返回1 + x的自然对数，即Math.log(1 + x)。如果x小于-1，返回NaN
* Math.log10(x)返回以 10 为底的x的对数。如果x小于 0，则返回 NaN。
* Math.log2(x)返回以 2 为底的x的对数。如果x小于 0，则返回 NaN
* Math.sinh(x) 返回x的双曲正弦（hyperbolic sine）
* Math.cosh(x) 返回x的双曲余弦（hyperbolic cosine）
* Math.tanh(x) 返回x的双曲正切（hyperbolic tangent）
* Math.asinh(x) 返回x的反双曲正弦（inverse hyperbolic sine）
* Math.acosh(x) 返回x的反双曲余弦（inverse hyperbolic cosine）
* Math.atanh(x) 返回x的反双曲正切（inverse hyperbolic tangent）
#### 指数运算符
ES2016 新增了一个指数运算符（**)这个运算符的一个特点是右结合，而不是常见的左结合。多个指数运算符连用时，是从最右边开始计算的。
```
// 相当于 2 ** (3 ** 2)
2 ** 3 ** 2
// 512
```
指数运算符可以与等号结合，形成一个新的赋值运算符（**=）。
```
let a = 1.5;
a **= 2;
// 等同于 a = a * a;

let b = 4;
b **= 3;
// 等同于 b = b * b * b;
```
V8 引擎的指数运算符与Math.pow的实现不相同，对于特别大的运算结果，两者会有细微的差异。
## 7.函数扩展
#### 函数参数的默认值
ES5:不能直接为函数的参数指定默认值，只能采用变通的方法。
```
 y = y || 'World'
 ```
 ES6:允许为函数的参数设置默认值，即直接写在参数定义的后面。
 ```
 function log(x, y = 'World') {
  console.log(x, y);
}
```
优点：
1. 简洁
2. 阅读代码的人，可以立刻意识到哪些参数是可以省略的，不用查看函数体或文档（如果非尾部的参数设置默认值，实际上无法只省略该参数，而不省略它后面的参数，除非显式输入undefined。）
3. 有利于将来的代码优化，即使未来的版本在对外接口中，彻底拿掉这个参数，也不会导致以前的代码无法运行。
> 注意，参数变量x是默认声明的，在函数体中，不能用let或const再次声明，否则会报错。使用参数默认值时，函数不能有同名参数。参数默认值是惰性求值的（每次都重新计算默认值表达式的值）。
```
function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined 5
foo({x: 1}) // 1 5
foo({x: 1, y: 2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined
```
只有当函数foo的参数是一个对象时，变量x和y才会通过解构赋值生成。如果函数foo调用时没提供参数，变量x和y就不会生成，从而报错。通过提供函数参数的默认值，就可以避免这种情况。
```
function fetch(url, { body = '', method = 'GET', headers = {} } = {}) {
  console.log(method);
}

fetch('http://example.com')
```
函数fetch没有第二个参数时，函数参数的默认值就会生效，然后才是解构赋值的默认值生效，变量method才会取到默认值GET(双重默认值）
总结：传参的时候，首先必须有定义，否则报错，只有undefined的时候会赋值为默认值，null不触发默认值

> 指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。这是因为length属性的含义是，该函数预期传入的参数个数。同理，后文的 rest 参数也不会计入length属性。

> 一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。
```
var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}

foo() // 3
x // 1
```
上面代码中，函数foo的参数形成一个单独作用域。这个作用域里面，首先声明了变量x，然后声明了变量y，y的默认值是一个匿名函数。这个匿名函数内部的变量x，指向同一个作用域的第一个参数x。函数foo内部又声明了一个内部变量x，该变量与第一个参数x由于不是同一个作用域，所以不是同一个变量，因此执行y后，内部变量x和外部全局变量x的值都没变。

应用：利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误。另外，可以将参数默认值设为undefined，表明这个参数是可以省略的。
#### rest 参数
ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。注意，rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。
> arguments对象不是数组，而是一个类似数组的对象。所以为了使用数组的方法，必须使用Array.prototype.slice.call先将其转为数组。rest 参数就不存在这个问题，它就是一个真正的数组，数组特有的方法都可以使用。
#### 严格模式
ES5 开始，函数内部可以设定为严格模式。ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
> 原因：函数内部的严格模式，同时适用于函数体和函数参数。但是，函数执行的时候，先执行函数参数，然后再执行函数体。这样就有一个不合理的地方，只有从函数体之中，才能知道参数是否应该以严格模式执行，但是参数却应该先于函数体执行。
#### name 属性
函数的name属性，返回该函数的函数名。
Function构造函数返回的函数实例，name属性的值为anonymous。bind返回的函数，name属性值会加上bound前缀。
#### 箭头函数
如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。
1. 函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
2. 不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
3. 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
4. 不可以使用yield命令，因此箭头函数不能用作 Generator 函数。
> this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。正是因为它没有this，所以也就不能用作构造函数。除了this，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments、super、new.target。

不适用场景：
由于箭头函数使得this从“动态”变成“静态”，下面两个场合不应该使用箭头函数。
1. 定义对象的方法，且该方法内部包括this。因为对象不构成单独的作用域，导致jumps箭头函数定义时的作用域就是全局作用域。
2. 第二个场合是需要动态this的时候，也不应使用箭头函数。
#### 尾调用优化
尾调用（Tail Call）是函数式编程的一个重要概念，指某个函数的最后一步是调用另一个函数。尾调用不一定出现在函数尾部，只要是最后一步操作即可
```
function f(x){
  return g(x);
}
```
> 函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用帧上方，还会形成一个B的调用帧。等到B运行结束，将结果返回到A，B的调用帧才会消失。如果函数B内部还调用函数C，那就还有一个C的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”（call stack）。

尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了.这就叫做“尾调用优化”（Tail call optimization），即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存。这就是“尾调用优化”的意义。
* 注意，只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”。

如果尾调用自身，就称为尾递归。递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误。

尾递归改写的可读性问题：
1. 在尾递归函数之外，再提供一个正常形式的函数。（函数柯里化）
2. 采用 ES6 的函数默认值。
> 在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈。
func.arguments：返回调用时函数的参数。
func.caller：返回调用当前函数的那个函数。
尾调用优化发生时，函数的调用栈会改写，因此上面两个变量就会失真。严格模式禁用这两个变量，所以尾调用模式仅在严格模式下生效。

蹦床函数（trampoline）可以将递归执行转为循环执行。
```
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
//将原来的递归函数，改写为每一步返回另一个函数。
function sum(x, y) {
  if (y > 0) {
    return sum.bind(null, x + 1, y - 1);
  } else {
    return x;
  }
}
trampoline(sum(1, 100000))
// 100001
```
尾递归优化实现（略）
#### 函数参数的尾逗号
ES2017 允许函数的最后一个参数有尾逗号（trailing comma）
## 数组的扩展
#### 扩展运算符
扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。
```
function push(array, ...items) {
  array.push(...items);
}

function add(x, y) {
  return x + y;
}

const numbers = [4, 38];
add(...numbers) // 42
```
扩展运算符后面还可以放置表达式。如果扩展运算符后面是一个空数组，则不产生任何效果。只有函数调用时，扩展运算符才可以放在圆括号中，否则会报错。
> 由于扩展运算符可以展开数组，所以不再需要apply方法，将数组转为函数的参数了。
* 应用:
1. 用于Math.max方法，可以简化求出一个数组最大元素的写法。
```
// ES5 的写法
Math.max.apply(null, [14, 3, 77])

// ES6 的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);
```
2. ES5 写法中，push方法的参数不能是数组，所以只好通过apply方法变通使用push方法。有了扩展运算符，就可以直接将数组传入push方法。
```
// ES5的 写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

// ES6 的写法
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
arr1.push(...arr2);
```
3. 数组伪深克隆（元素若为引用对象，则暴露出浅拷贝本质）
```
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```
4. 数组合并,这两种方法都是浅拷贝
```
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
```
5. 将字符串转为真正的数组。凡是涉及到操作四个字节的 Unicode 字符的函数，最好都用扩展运算符改写。
```
[...'hello']
// [ "h", "e", "l", "l", "o" ]

'x\uD83D\uDE80y'.length // 4
[...'x\uD83D\uDE80y'].length // 3
```
6. 任何定义了遍历器（Iterator）接口的对象（参阅 Iterator 一章），都可以用扩展运算符转为真正的数组。扩展运算符背后调用的是遍历器接口（Symbol.iterator）,因此只要具有 Iterator 接口的对象，都可以使用扩展运算符，比如 Map 结构。对没有 Iterator 接口的对象，使用扩展运算符，将会报错。
> 如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。
#### Array.from()
Array.from方法用于将两类对象转为真正的数组：
1. 类似数组的对象（array-like object），所谓类似数组的对象，本质特征只有一点，即必须有length属性。
> 因此，任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。
```
Array.from({ length: 3 });
// [ undefined, undefined, undefined ]
```
2. 可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。
> 对于还没有部署该方法的浏览器，可以用Array.prototype.slice.call方法替代。

Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
```
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]
```
如果map函数里面用到了this关键字，还可以传入Array.from的第三个参数，用来绑定this。

应用：Array.from()的一个应用是将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 Unicode 字符，可以避免 JavaScript 将大于\uFFFF的 Unicode 字符，算作两个字符的 bug。
#### Array.of()
Array.of方法用于将一组值，转换为数组。这个方法的主要目的是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。
```
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
```
模拟实现
```
function ArrayOf(){
  return [].slice.call(arguments);
}
```
#### 数组实例的 copyWithin()
在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。
> Array.prototype.copyWithin(target, start = 0, end = this.length),读取的不包括end这个点
```
[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]

// 将3号位复制到0号位
[].copyWithin.call({length: 5, 3: 1}, 0, 3)
// {0: 1, 3: 1, length: 5}
```
（第二段代码是类数组对象调用数组原生方法的典型案例）
#### 数组实例的 find() 和 findIndex()
1. 数组实例的find方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。
```
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10
```
2. findIndex方法的用法与find方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。
```
[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 2
```
这两个方法都可以接受第二个参数，用来绑定回调函数的this对象。
> indexOf方法无法识别数组的NaN成员，但是findIndex方法可以借助Object.is方法做到。Object.is(value1, value2);
#### 数组实例的 fill()
fill方法使用给定值，填充一个数组。
```
['a', 'b', 'c'].fill(7)// [7, 7, 7]
```
fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。
```
['a', 'b', 'c'].fill(7, 1, 2)// ['a', 7, 'c']
```
如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。
```
let arr = new Array(3).fill({name: "Mike"});
arr[0].name = "Ben";
arr
// [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]

let arr = new Array(3).fill([]);
arr[0].push(5);
arr
// [[5], [5], [5]]
```
#### 数组实例的 entries()，keys() 和 values()
entries()，keys()和values()——用于遍历数组。它们都返回一个遍历器对象，可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。也可以手动调用遍历器对象的next方法，进行遍历。
```
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
```
#### 数组实例的 includes()
返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似，该方法的第二个参数表示搜索的起始位置，默认为0

> indexOf方法有两个缺点，一是不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于-1，表达起来不够直观。二是，它内部使用严格相等运算符（===）进行判断，这会导致对NaN的误判。includes使用的是不一样的判断算法，没有这个问题。

模拟实现
```
(arr, value) => arr.some(el => el === value)
```
Map 结构的has方法，是用来查找键名的,Set 结构的has方法，是用来查找值的
#### 数组实例的 flat()，flatMap()
1. Array.prototype.flat()用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。即flat()方法将子数组的成员取出来，添加在原来的位置。flat()方法的参数写成一个整数，表示想要拉平的层数，默认为1。如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。如果原数组有空位，flat()方法会跳过空位。
2. flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。flatMap()只能展开一层数组。flatMap()方法还可以有第二个参数，用来绑定遍历函数里面的this。
```
arr.flatMap(function callback(currentValue[, index[, array]]) {//当前数组成员、当前数组成员的位置（从零开始）、原数组。
  // ...
}[, thisArg])
```
#### 数组的空位
数组的空位指，数组的某一个位置没有任何值.空位不是undefined，一个位置的值等于undefined，依然是有值的
```
Array(3) // [, , ,]

0 in [undefined, undefined, undefined] // true
0 in [, , ,] // false
```
ES5 对空位的处理，已经很不一致了，大多数情况下会忽略空位。
1. forEach(), filter(), reduce(), every() 和some()都会跳过空位。
2. map()会跳过空位，但会保留这个值
3. join()和toString()会将空位视为undefined，而undefined和null会被处理成空字符串。

ES6 则是明确将空位转为undefined。
```
Array.from(['a',,'b'])
// [ "a", undefined, "b" ]
```




