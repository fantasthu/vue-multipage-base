<template>
  <div class="aboutpage">
    {{msg}}
  </div>
</template>

<script>
export default {
  name: 'about',
  data() {
    return {
      msg: 'this is aboutpage'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.aboutpage {
}
</style>
