<template>
  <div class="right-menu flex-v">
    <right-menu-tabs></right-menu-tabs>
    <right-user-info v-if="tab == 0"></right-user-info>
    <rightUserWorkList v-if="tab == 1"></rightUserWorkList>
    <rightKnowledge v-if="tab == 2"></rightKnowledge>
  </div>
</template>

<script>
import RightMenuTabs from '../components/RightMenuTabs.vue'
import RightUserInfo from '../components/RightUserInfo.vue'
import RightUserWorkList from '../components/RightUserWorkList.vue'
import RightKnowledge from '../components/RightKnowledge.vue'
export default {
  name: 'rightmenu',
  components: {
    RightMenuTabs,
    RightUserInfo,
    RightUserWorkList,
    RightKnowledge
  },
  props: {},
  data() {
    return {
      tab: 0
    }
  },
  created() {
    this.$root.eventBus.$on('toChangeTab', index => {
      console.log('rightmenu =>created =>index', index)
      this.tab = index
      if (index === 1) {
        this.$root.eventBus.$emit('getWorkList')
      }
      if (index === 2) {
        this.$root.eventBus.$emit('toKnowledge')
      }
      console.log(typeof index)

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
    .search {
      position: relative;
      height: 116px;
      img {
        position: absolute;
        left: 46px;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 26px;
        height: 26px;
      }
      input {
        height: 60px;
        border: 1px solid #e5e5e5;
        margin: 0 18px;
        padding-left: 70px;
        font-family: PingFang-SC-Medium;
        font-size: 22px;
        color: #353535;
        letter-spacing: 1.83px;
        border-radius: 100px;
      }
    }
  }
}

//pc端
@media screen and (min-width: 768px) {
  .right-menu {
    // max-width: 600px;
    width: 600px;
    border-left: 2px solid #e5e5e5;
    position: relative;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
