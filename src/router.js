import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Hello from './components/Hello.vue';

// 使用工厂模式
export default function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: Hello
      },
      {
        path: '/hello/:id',
        component: Hello
      },
      {
        path: '/asynchello/:id',
        component: () => import('./components/AsyncHello.vue')
      },
      {
        path: '/item/:id',
        component: () => import('./components/vuexItem.vue')
      }
    ]
  })
}
