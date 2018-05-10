<template>
  <div class="right-menu flex-v">
    <right-menu-tabs></right-menu-tabs>
    <right-user-info v-show="tab == 0" :tab="tab" :name="name" :shortname="shortname" :whichProgramme="whichProgramme" :openId="openId" :remarkId="remarkId" :isPush="isPush"></right-user-info>
    <rightUserWorkList v-show="tab == 1" :tab="tab" :openId="openId" :name="name" ></rightUserWorkList>
    <rightKnowledge v-show="tab == 2"></rightKnowledge>
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
      tab: 0,
      name: '',
      shortname: '',
      whichProgramme: 0,
      openId: '',
      width: 0,
      remarkId: '',
      isPush: 0
    }
  },
  created() {
    this.$root.eventBus.$on('toChangeTab', index => {
      console.log('rightmenu =>created =>index', index)
      this.tab = index
      if (index === 0) {
        // this.$root.eventBus.$emit('getUserInfo')
        this.$root.eventBus.$emit('getList')
      }
      if (index === 1) {
        this.$root.eventBus.$emit('getWorkList')
      }
      if (index === 2) {
        this.$root.eventBus.$emit('getKnowledgeList')
      }
    })
    /**
     * 获取右侧用户信息和订单
     */
    this.$root.eventBus.$on(
      'getCurrentUsrInfo',
      (name, whichProgramme, openId, remarkId, isPush) => {
        this.name = name
        if (name.length > 6) {
          this.shortname = name.substr(0, 6) + '...'
        } else {
          this.shortname = name
        }
        this.whichProgramme = whichProgramme
        this.openId = openId
        this.remarkId = remarkId || ''
        this.isPush = isPush
        this.$root.eventBus.$emit('getList', this.tab, openId)
      }
    )
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
    display: none;
  }
}

//pc端
@media screen and (min-width: 768px) {
  .right-menu {
    // max-width: 600px;
    width: 460px;
    border-left: 2px solid #e5e5e5;
    position: relative;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
