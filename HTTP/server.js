const http =require('http')

http.createServer(function(req,res){
	console.log('request come',req.url)

	res.end('123')
}).listen(8888)

console.log('server listening on 8888')