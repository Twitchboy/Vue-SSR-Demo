<template>
  <div>
    <h1>Vuex 下，先预先获取数据</h1>
    {{ items }}
    <p>
      item: {{ getItem().text }}
    </p>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'vuexItem',
    // 静态函数, 以便外部可以任意调用
    asyncData ({ store, route }) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('fetchItem', route.params.id)
    },
    computed: {
      ...mapState(['items'])
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
