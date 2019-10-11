function debounce(fn,wait){
    var timeout=null;
    return function(){
        console.log(timeout);
        if(timeout!==null){
            window.clearTimeout(timeout);
        }
        timeout=setTimeout(fn,wait);
    }
}
function handle(){
    console.log('done');
}
var de=debounce(handle,1000);
de();
de();
de();
//window.addEventListener('scroll',de);
//函数防抖：将几次操作合并为一此操作进行。原理是维护一个计时器，规定在delay时间后触发函数，但是在delay时间内再次触发
//的话，就会取消之前的计时器而重新设置。这样一来，只有最后一次操作能被触发。