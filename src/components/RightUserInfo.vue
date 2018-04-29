<template>
  <div>
    <div class="flex-v right-user-info">
      <div class="name ">昵称：司徒史蒂夫 <span>(xdfxdf)</span><div class="copyname">复制</div></div>
      <div class="identity">用户身份： VIP</div>
    </div>
    <right-order></right-order>
  </div>
</template>

<script>
import RightOrder from './RightOrder.vue'
export default {
  name: 'rightuserinfo',
  components: { RightOrder },
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
  .right-menu {
  }
}

//pc端
@media screen and (min-width: 768px) {
  .right-user-info {
    background: #f1f1f1;
    padding: 36px 42px;
    .name {
      font-size: 30px;
      color: #353535;
      letter-spacing: 0;
      span {
        font-size: 22px;
        color: #888888;
        letter-spacing: 2px;
        margin-left: 18px;
      }
      .copyname {
        border: 2px solid #b2b2b2;
        display: inline-block;
        margin-left: 24px;
        width: 64px;
        height: 32px;
        font-size: 22px;
        line-height: 32px;
        text-align: center;
        color: #888;
        vertical-align: middle;
      }
    }
    .identity {
      font-size: 24px;
      color: #888888;
      letter-spacing: 0;
      margin-top: 24px;
    }
  }
}
</style>
