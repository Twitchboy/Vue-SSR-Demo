import { createApp } from './app'
// 客户端特定引导逻辑……


const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// 路由器必须要提前解析路由配置中的异步组件，才能正确地调用组件中可能存在的路由钩子。
router.onReady(() => {
  // 这里假定 App.vue 模板中根元素具有 `id="app"`
  app.$mount('#app')
})
