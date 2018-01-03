<template>
  <div class="indexpage">
    {{msg}}
  </div>
</template>

<script>
export default {
  name: 'indexpage',
  data() {
    return {
      msg: 'this is indexpage'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indexpage {
  width: 100px;
}
</style>
