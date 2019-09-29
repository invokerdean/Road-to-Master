#### 互娱
1. 为什么选Vue，跟其他框架比有什么优势
2. 双向绑定原理
3. 事件驱动模型（事件调度）
4. 同步异步的区别

#### 云音乐（react,webpack）
1. 项目难点：回答图片视频上传，（有点含糊，忘记了）
2. 实现一个map函数
3. a.map.call(1,fn)返回什么(0<undefined->false?)
4. 原型继承手写
5. 
```
function delay(time){
  return new Promise(function(resolve,reject){
    setTimeout(resolve,time)
  })
}
```
6. Promise并行then=>用Promise.all(p1,p2).then(fn)
7. 串行:
```
p1.then(()=>delay(2)).then(fn)
```
6.瀑布流，懒加载实现
