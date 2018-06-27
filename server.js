const Vue = require('vue')
const express = require('express')

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

server.get('*', (req, res) => {
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
        }
      })
  // })
})

server.listen(8080, () => {
  console.log('Server is running at http://127.0.0.1:8080')
})
