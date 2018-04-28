<template>
  <div class="right-menu flex-v">
      <div class="tabs flex-h">
        <div class="tab flex-1">用户信息</div>
        <div class="tab flex-1">工单</div>
        <div class="tab flex-1">知识库</div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'rightmenu',
  components: {},
  props: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// 手机端
@media (max-width: 768px) {
  .right-menu {
  }
}

//pc端
@media screen and (min-width: 768px) {
  .right-menu {
    max-width: 600px;
    .tabs {
      .tab {
      }
    }
  }
}
</style>
