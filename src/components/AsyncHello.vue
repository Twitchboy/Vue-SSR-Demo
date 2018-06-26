<template>
  <div>
    <h2>动态组件-用户🆔：{{ id }}</h2>
  </div>
</template>

<script>
  export default {
    name: 'asyncHello',
    data () {
      return {
        id: this.$route.params.id
      }
    }
  }
</script>

<style scoped>

</style>
