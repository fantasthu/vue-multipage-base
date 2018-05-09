<template>
  <div class="left-menu flex-v">
    <div class="logo">
      <img src="../assets/img/icon_oneway.png" alt="">
    </div>
    <div class="list">
      <div class="item" @click="menuClick(1)">
        <img src="../assets/img/chat-line.png" v-show="chooseIndex!==1" alt="">
        <img src="../assets/img/chat.png" v-show="chooseIndex===1" alt="">
      </div>
      <div class="item" @click="menuClick(2)">
        <img src="../assets/img/file-line.png" v-show="chooseIndex!==2" alt="">
        <img src="../assets/img/file.png" v-show="chooseIndex===2" alt="">
      </div>
      <div class="item" @click="menuClick(3)">
        <img src="../assets/img/book-line.png" v-show="chooseIndex!==3" alt="">
        <img src="../assets/img/book.png" v-show="chooseIndex===3" alt="">
      </div>
    </div>
    <div class="content" v-show="chooseIndex!==1">
      <LeftWorkOrder v-show="chooseIndex === 2"></LeftWorkOrder>
      <LeftKnowledge v-show="chooseIndex === 3"></LeftKnowledge>
    </div>
  </div>
</template>

<script>
import LeftWorkOrder from './LeftWorkOrder'
import LeftKnowledge from './LeftKnowledge'
export default {
  name: 'leftmenu',
  components: { LeftWorkOrder, LeftKnowledge },
  props: {},
  data() {
    return {
      chooseIndex: 1
    }
  },
  created() {},
  mounted() {},
  methods: {
    menuClick(index) {
      // alert(typeof index)
      // if (index === 2 && this.chooseIndex !== index) {
      //   this.$root.eventBus.$emit('updatePcWorkOrder')
      // }
      // if (index === 3 && this.chooseIndex !== index) {
      //   this.$root.eventBus.$emit('updatePcKnowledge')
      // }
      this.chooseIndex = index
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// 手机端
@media (max-width: 768px) {
  .left-menu {
  }
}

//pc端
@media screen and (min-width: 768px) {
  .left-menu {
    width: 118px;
    overflow: hidden;
    background: #353535;
    align-items: center;
    .logo {
      margin-top: 24px;
      img {
        width: 70px;
        height: 70px;
      }
    }
    .list {
      .item {
        img {
          width: 50px;
          height: 45px;
          margin-top: 60px;
        }
      }
    }
    .content {
      position: absolute;
      left: 118px;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 10000;
    }
  }
}
</style>
