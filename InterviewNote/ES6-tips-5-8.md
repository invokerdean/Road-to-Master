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
