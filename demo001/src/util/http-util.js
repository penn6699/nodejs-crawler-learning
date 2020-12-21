// 引入https模块，由于我们爬取的网站采用的是https协议
const https = require('https');


const createOption=function(path,method){
    return {
        host:'49.87.18.58',//这里放代理服务器的ip或者域名
        port:'9999',//这里放代理服务器的端口号
        method:method ||'get',//get post
        path:path||'',     //这里是访问的路径
        headers:{
         //这里放期望发送出去的请求头
        }
    }
}

export function get(url){

    return new Promise( (resolve, reject) =>{
        https.get(createOption(url,'get'), function (res) {

            let html = '';
            // 每当我们从指定的url中得到数据的时候,就会触发res的data事件,事件中的chunk是每次得到的数据,data事件会触发多次,因为一个网页的源代码并不是一次性就可以下完的
            res.on("data", function (chunk) {
                html += chunk;
            });
        
            // 当网页的源代码下载完成后, 就会触发end事件
            res.on("end", function () {
                resolve(html)
            });
            res.on('error', (err) => {
                reject(err);
            });
        
        });
    });
}

