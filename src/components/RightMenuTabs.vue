<template>
    <div class="tabs flex-h">
      <div :class="['tab flex-1 flex-h flex-cc', activeIndex==index?'active':'']" v-for ="(item,index) in tabs" @click.stop="changeTab(index)">{{item.name}}</div>
    </div>
</template>

<script>
export default {
  name: 'rightmenutabs',
  components: {},
  props: {},
  data() {
    return {
      activeIndex: 0,
      tabs: [{ name: '用户信息' }, { name: '工单' }, { name: '知识库' }]
    }
  },
  created() {},
  mounted() {},
  methods: {
    changeTab(index) {
      if (this.activeIndex !== index) {
        this.activeIndex = index
        this.$root.eventBus.$emit('toChangeTab', index)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// 手机端
@media (max-width: 768px) {
  .tabs {
    display: none;
  }
}

//pc端
@media screen and (min-width: 768px) {
  .tabs {
    width: 100%;
    height: 115px;
    line-height: 115px;
    border-bottom: 2px solid #e5e5ee;
    justify-content: space-between;
    .tab {
      font-size: 28px;
      color: #b2b2b2;
      letter-spacing: 0;
    }
    .active {
      color: #353535;
    }
  }
}
</style>
