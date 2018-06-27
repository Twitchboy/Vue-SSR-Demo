import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
import { createStore } from './store'
//将 Vue Router 当前的 $route 同步到 Vuex store 作为其 state 的一部分。
// vuex 管理 router，路由的 state 改变了会触发进行一些路由的操作， 路由的一些操作，也会同步到 state 中
import { sync } from 'vuex-router-sync'

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
    const router = createRouter()
    const store = createStore()

    // 同步路由状态(route state)到 store
    sync(store, router)

    const app = new Vue({
      // 注入 router、store 到根 Vue 实例
      router,
      store,
      // 根实例简单的渲染应用程序组件。
      render: h => h(App)
    })
    console.log('some thing')
    return { app, router, store }
}
