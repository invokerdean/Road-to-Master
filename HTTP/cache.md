## cache更新前端策略
服务器资源文件打包后进行hash计算，添加到url中，如果服务器更新了文件，那么hash就会改变，反映到页面上就是url改变了，就会引起缓存更新，即请求最新版文件

## nodeweb服务器使用cache-control
>'Cache-Control':'public,max-age:20,...'

## no-cache和no-store区别
no-cache是可以缓存文件，但是每次需要向服务器验证是否可以使用缓存
no-store是禁止缓存

## 验证头
1. Etag：数据签名，根据内容产生唯一的签名（例如hash计算v） 配合头部信息If-Match(或者If-Non-Match)使用，对比资源的签名判断是否使用缓存
2. Last-Modified:配合头部信息If-Modified-Since(或者If-Unmodified-Since)使用，对比上次修改时间验证资源是否需要更新
