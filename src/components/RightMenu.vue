<template>
  <div class="right-menu flex-v">
    <right-menu-tabs></right-menu-tabs>
    <right-user-info></right-user-info> 
  </div>
</template>

<script>
import RightMenuTabs from '../components/RightMenuTabs.vue'
import RightUserInfo from '../components/RightUserInfo.vue'
export default {
  name: 'rightmenu',
  components: { RightMenuTabs, RightUserInfo },
  props: {},
  data() {
    return {}
  },
  created() {
    this.$root.eventBus.$on('toChangeTab', index => {
      console.log('rightmenu =>created =>index', index)
      // this.reloadMessageScroll()
    })
  },
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
    // max-width: 600px;
    // width: 600px;
    border-left: 2px solid #e5e5e5;
  }
}
</style>
