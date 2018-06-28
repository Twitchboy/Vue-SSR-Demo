const Vue = require('vue')
const express = require('express')
const LRU = require('lru-cache')

const template = require('fs').readFileSync('./src/index.template.html', 'utf-8')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer = require('vue-server-renderer')
.createBundleRenderer(
  serverBundle,
  {
    runInNewContext: false, // 关闭每次渲染都要重新创建一个上下文，减少性能开销
    template,
    clientManifest // 客户端构建的 manifest
  }
)

// 使用 BundleRenderer 就不需要自己手动来获取了，通过 clientManifest 注入进来
// const createApp = require('./dist/main.server.js').default
const server = express();

server.use('/dist', express.static('./dist'))

//  micro-caching 的缓存策略，来大幅度提高应用程序处理高流量的能力。
// Node.js 中实现，
// LRU （Least recently used，最近最少使用）内存管理的一种算法，
// 算法根据数据的历史访问记录来进行淘汰数据，其核心思想是“如果数据最近被访问过，那么将来被访问的几率也更高“
const microCache = LRU({
  max: 100,
  maxAge: 30000 // 重要提示：条目在 1 秒后过期。
})

// 判断是否进行缓存
const isCacheable = req => {
  // 实现逻辑为，检查请求是否是用户特定(user-specific)。
  // 只有非用户特定(non-user-specific)页面才会缓存
  return true // 每个页面都缓存
}

server.get('*', (req, res) => {
  const cacheable = isCacheable(req)
  if (cacheable) {
    const hit = microCache.get(req.url) // 获取命中，当前页面是否被缓存过了
    if (hit) { //命中，直接读缓存
      console.log("======= hit page 页面级别缓存========")
      return res.end(hit)
    }
  }

  const context = {
    title: 'Vue ssr demo',
    meta: `
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
    `,
    url: req.url
  }

  // createApp(context).then(app => {
    renderer.renderToString(context, (err, html) => {
        if (err) {
          if (err.code === 404) {
            res.status(404).end('Page not found')
          } else {
            res.status(500).end('Internal Server Error')
          }
        } else {
          res.end(html)
          // 当前页面没有被缓存，给添加到缓存中
          if (cacheable) {
            microCache.set(req.url, html)
          }
        }
      })
  // })
})

server.listen(8080, () => {
  console.log('Server is running at http://127.0.0.1:8080')
})
