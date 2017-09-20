console.log('main1');

process.nextTick(function() {
    console.log('process.nextTick1');
});

setTimeout(function() {
    console.log('setTimeout1');
    process.nextTick(function() {
        console.log('process.nextTick2');
    });
}, 0);

setTimeout(function() {
    console.log('setTimeout2');
}, 0);

setImmediate(function(){
    console.log('setImmediate1');
});

setImmediate(function(){
    console.log('setImmediate延迟执行1');
    setImmediate(function(){
        console.log('setImmediate延迟执行3');
    });
    //进入下次循环
    process.nextTick(function () {
        console.log('强势插入');
    });
});

setImmediate(function(){
    console.log('setImmediate2');
});

new Promise(function(resolve, reject) {
    console.log('promise');
    resolve();
}).then(function() {
    console.log('promise then');
});

console.log('main2');