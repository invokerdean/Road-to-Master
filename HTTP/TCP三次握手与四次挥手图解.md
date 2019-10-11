* 三次握手：
1. 第一次握手：起初两端都处于 CLOSED 关闭状态，Client 将标志位 SYN 置为 1，随机产生一个值 seq = x，并将该数据包发送给 Server，Client 进入 SYN-SENT 状态，等待 Server 确认。
2. 第二次握手：Server 收到数据包后由标志位 SYN = 1 得知 Client 请求建立连接，Server 将标志位 SYN 和 ACK 都置为 1，ack = x + 1，随机产生一个值 seq = y，并将该数据包发送给Client以确认连接请求，Server 进入 SYN-RCVD 状态，此时操作系统为该 TCP 连接分配 TCP 缓存和变量。
3. 第三次握手：Client 收到确认后，检查 seq 是否为 x + 1，ACK 是否为 1，如果正确则将标志位 ACK 置为 1，ack = y + 1，并且此时操作系统为该 TCP 连接分配 TCP 缓存和变量，并将该数据包发送给 Server，Server 检查 ack 是否为 y + 1，ACK 是否为 1，如果正确则连接建立成功，Client 和 Server 进入 established 状态，完成三次握手，随后 Client 和 Server 就可以开始传输数据。

![avatar](https://user-gold-cdn.xitu.io/2019/3/12/169721e7c852b2c9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

>SYN意为建立连接，三次握手前两次双方都在试图建立连接，因此都有SYN，ACK为确认消息，除第一次外都需要有，seq=x为序列号，用于与ack=x+1的回复对应

* 四次挥手：


1. 第一次挥手：Client 的应用进程先向其 TCP 发出连接释放报文段（FIN = 1，序号 seq = u），并停止再发送数据，主动关闭 TCP 连接，进入 FIN-WAIT-1（终止等待1）状态，等待 Server 的确认。
2. 第二次挥手：Server 收到连接释放报文段后即发出确认报文段，（ACK = 1，确认号 ack = u + 1，序号 seq = v），Server 进入 CLOSE-WAIT（关闭等待）状态，此时的 TCP 处于半关闭状态，Client 到 Server 的连接释放。

> 注：Client 收到 Server 的确认后，进入 FIN-WAIT-2（终止等待2）状态，等待 Server 发出的连接释放报文段。

3. 第三次挥手：Server 已经没有要向 Client 发出的数据了，Server 发出连接释放报文段（FIN = 1，ACK = 1，序号 seq = w，确认号 ack = u + 1），Server 进入 LAST-ACK（最后确认）状态，等待 Client 的确认。
4. 第四次挥手：Client 收到 Server 的连接释放报文段后，对此发出确认报文段（ACK = 1，seq = u + 1，ack = w + 1），Client 进入 TIME-WAIT（时间等待）状态。此时 TCP 未释放掉，需要经过时间等待计时器设置的时间 2MSL 后，Client 才进入 CLOSED 状态。

![avatar](https://user-gold-cdn.xitu.io/2019/3/12/1697220a338c7f9b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
