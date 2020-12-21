'use strict'

// 引入模块
var https = require('https')
var fs = require('fs')
var path = require('path')
var cheerio = require('cheerio')

// 爬虫的 URL 信息
var opt = {
  hostname: 'movie.douban.com',
  path: '/top250',
  port: 443,
}

// 创建 http get 请求
https
  .get(opt, function (res) {
    var html = '' // 保存抓取到的 HTML 源码
    var movies = [] // 保存解析 HTML 后的数据，即我们需要的电影信息

    // 前面说过
    // res 是 Class: http.IncomingMessage 的一个实例
    // 而 http.IncomingMessage 实现了 stream.Readable 接口
    // 所以 http.IncomingMessage 也有 stream.Readable 的事件和方法
    // 比如 Event: 'data', Event: 'end', readable.setEncoding() 等

    // 设置编码
    res.setEncoding('utf-8')

    // 抓取页面内容
    res.on('data', function (chunk) {
      html += chunk
    })

    res.on('end', function () {
      // 使用 cheerio 加载抓取到的 HTML 代码
      // 然后就可以使用 jQuery 的方法了
      // 比如获取某个 class：$('.className')
      // 这样就能获取所有这个 class 包含的内容
      var $ = cheerio.load(html)

      // 解析页面
      // 每个电影都在 item class 中
      $('.item').each(function () {
        // 获取图片链接
        var movie = {
          title: $('.title', this).text(), // 获取电影名称
          star: $('.info .star em', this).text(), // 获取电影评分
          link: $('a', this).attr('href'), // 获取电影详情页链接
          picUrl: $('.pic img', this).attr('src'), // 获取电影图片链接
        }

        // 把所有电影放在一个数组里面
        movies.push(movie)
        // 下载图片
        downloadImg('img/', movie.picUrl)
      })

      // 保存抓取到的电影数据
      saveData('data/data.json', movies)
    })
  })
  .on('error', function (err) {
    console.log(err)
  })

/**
 * 保存数据到本地
 *
 * @param {string} path 保存数据的文件
 * @param {array} movies 电影信息数组
 */
function saveData(path, movies) {
  // 调用 fs.writeFile 方法保存数据到本地
  fs.writeFile(path, JSON.stringify(movies, null, 4), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('Data saved')
  })
}

/**
 * 下载图片
 *
 * @param {string} imgDir 存放图片的文件夹
 * @param {string} url 图片的 URL 地址
 */
function downloadImg(imgDir, url) {
  https
    .get(url, function (res) {
      var data = ''

      res.setEncoding('binary')

      res.on('data', function (chunk) {
        data += chunk
      })

      res.on('end', function () {
        // 调用 fs.writeFile 方法保存图片到本地
        fs.writeFile(
          imgDir + path.basename(url),
          data,
          'binary',
          function (err) {
            if (err) {
              return console.log(err)
            }
            console.log('Image downloaded:', path.basename(url))
          }
        )
      })
    })
    .on('error', function (err) {
      console.log(err)
    })
}
