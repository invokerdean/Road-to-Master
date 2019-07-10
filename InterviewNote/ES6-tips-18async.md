#### 含义
async 函数是什么？一句话，它就是 Generator 函数的语法糖。
> async函数就是将 Generator 函数的星号替换成async，将yield替换成await，仅此而已。
```
const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
//
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```
###### 优势
1. Generator 函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器。也就是说，async函数的执行，与普通函数一模一样，只要一行。
```
asyncReadFile();
```
#### 基本用法
#### 语法
#### async 函数的实现原理
#### 与其他异步处理方法的比较
#### 实例：按顺序完成异步操作
#### 顶层 await
