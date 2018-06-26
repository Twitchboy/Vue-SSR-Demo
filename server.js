const Vue = require('vue')
const express = require('express')
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./src/index.template.html', 'utf-8')
})
const createApp = require('./dist/main.server.js').default

const server = express();

server.use('/dist', express.static('./dist'))

server.get('*', (req, res) => {
  const context = {
    title: 'Vue ssr demo',
    meta: `
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
    `
  }

  const app = createApp(context)

  renderer.renderToString(app, context,(err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(8080, () => {
  console.log('Server is running at http://127.0.0.1:8080')
})
