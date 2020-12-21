// 引入https模块，由于我们爬取的网站采用的是https协议
const https = require('https');

// 引入cheerio模块，使用这个模块可以将爬取的网页源代码进行装载，然后使用类似jquery的语法去操作这些元素

// 在cheerio不是内置模块，需要使用包管理器下载安装

const cheerio = require('cheerio');

// 这里以爬取拉钩网为例

var url = "https://www.lagou.com/";

// 使用https模块中的get方法，获取指定url中的网页源代码

https.get(url, function (res) {

    var html = '';

    // 每当我们从指定的url中得到数据的时候,就会触发res的data事件,事件中的chunk是每次得到的数据,data事件会触发多次,因为一个网页的源代码并不是一次性就可以下完的

    res.on("data", function (chunk) {

        html += chunk;

    });

    // 当网页的源代码下载完成后, 就会触发end事件

    res.on("end", function () {

        //这里我们对下载的源代码进行一些处理

        doSomeThing(html);



    });
    

});

function doSomeThing(html) {

    // 使用cheerio模块装载我们得到的页面源代码,返回的是一个类似于jquery中的$对象

    var $ = cheerio.load(html);

    //使用这个$对象就像操作jquery对象一般去操作我们获取得到的页面的源代码

    var $menu_box = $(".menu_box");

    // 将我们需要的文字信息存储在一个数组中

    var result = [];

    $menu_box.each(function (i, item) {

        var obj = {};

        var h2 = $(item).find("h2").text().trim();

        obj.name = h2;

        var $as = $(item).find("a");

        obj.subName = [];

        $as.each(function (i, item) {

            obj.subName.push($(item).text());

        });

        result.push(obj);

    });

    //最后我们输出这个结果

    console.log(result);

}