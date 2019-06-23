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
