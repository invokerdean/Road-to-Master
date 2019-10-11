//1.时间戳
// function throttle(fn,delay){
//     var prev=Date.now();
//     return function(){
//         var args=arguments;
//         console.log(arguments);
//         var context=this;
//         var now=Date.now();
//         console.log(now);
//         if(now-prev>=delay){
//             fn.apply(context,args);
//             prev=Date.now();
//         }
//     }
// }

//2.定时器
// function throttle(fn,delay){
//     var timer=null;
//     return function(){
//         var args=arguments;
//         var context=this; 
//         //如果此时没有定时器
//         if(!timer){
//             setTimeout(function(){ 
//                 console.log(timer);
//                 fn.apply(context,args);
//                 timer=null;
//             },delay);
//         }
//     }
// }

//3.时间戳+定时器
// function throttle(fn,delay){
//     var timer=null;
//     var startTime=Date.now();
//     return function(){
//         var curTime=Date.now();
//         var remaining=delay-(curTime-startTime);
//         var context=this;
//         clearTimeout(timer);
//         if(remaining<=0){
//             fn.apply(context);
//             console.log('立即执行');
//             startTime=Date.now();
//         }else{
//             setTimeout(function(){
//                 fn.apply(context);
//                 console.log(remaining+'ms后执行');
//                 startTime=Date.now();
//             },remaining);
//         }
//     }
// }

//4.标记法
function throttle(fn,wait){
    var canRun=true;
    return function(){
        if(!canRun){
            return;
        }
        canRun=false;
        setTimeout(function(){
            fn.apply(this,arguments);
            canRun=true;
        },wait)
    }
}
function handle(){
    console.log('done');
}
var de=throttle(handle,1000);
de();
setTimeout(de,500);
setTimeout(de,1000);
//函数节流：使得一定时间内只触发一次函数。原理是通过判断是否到达一定时间来触发函数。