<template>
  <div>
    <h2>用户🆔：{{ id }}</h2>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        id: this.$route.params.id
      }
    }
  }
</script>

<style scoped>

</style>
