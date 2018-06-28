<template>
  <div>
    <h1>Vuex 下，先预先获取数据</h1>
    {{ items }}
    <p>
      item: {{ getItem().text }}
    </p>
    <p>动态注册模块：{{fooCount}}</p>
  </div>
</template>

<script>
import { mapState, mapGetters, createNamespacedHelpers } from 'vuex'
import fooStoreModule from '../store/modules/foo.js';
import titleMinxin from '../title-mixin.js'

  export default {
    name: 'vuexItem',
    mixins: [titleMinxin],

    title () {
      return this.getItem().mixinText
    },
    // 静态函数, 以便外部可以任意调用
    asyncData ({ store, route }) {
      // 模块动态注册，需要才加载进来
      store.registerModule('foo', fooStoreModule)

      // 触发 action 后，会返回 Promise, 确保所有都执行完
      return Promise.all([
        store.dispatch('fetchItem', route.params.id),
        store.dispatch('foo/inc')
      ])
    },
    // 重要信息：当多次访问路由时，
    // 避免在客户端重复注册模块。
    destroyed () {
      // 卸载模块
      this.$store.unregisterModule('foo')
    },
    computed: {
      // fooCount () {
      //   return this.$store.state.foo.count
      // },
      ...mapState({
        items: "items",
        fooCount: state => state.foo.count
      }),
    },
    methods: {
      ...mapGetters({
        getItemById: 'getItemById'
      }),
      getItem () {
        const item = this.getItemById()
        return item(this.$route.params.id)
      }
    }
  }
</script>

<style scoped>

</style>
