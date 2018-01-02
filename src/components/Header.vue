<template>
  <div class="header">
    {{msg}}
  </div>
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      msg: 'this is header',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
