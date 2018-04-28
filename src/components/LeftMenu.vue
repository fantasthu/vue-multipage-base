<template>
  <div class="left-menu flex-v">
    <div class="logo">
      <img src="../assets/img/icon_oneway.png" alt="">
    </div>
    <div class="list">
      <div class="item">
        <img src="../assets/img/chat.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'leftmenu',
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
  }
}
</style>
