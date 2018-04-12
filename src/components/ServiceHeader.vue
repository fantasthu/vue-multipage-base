<template>
  <mt-header :title="title" :fixed="true">
      <mt-button icon="back" @click="chatBack" slot="left" v-show="back"></mt-button>
      <mt-button icon="more" slot="right" v-show="more"></mt-button>
  </mt-header>
</template>

<script>
import { Header, Button } from 'mint-ui'
export default {
  name: 'serviceheader',
  components: { Header, Button },
  props: ['title', 'more', 'back'],
  data() {
    return {
      back: require('../assets/img/icon_oneway.png')
    }
  },
  created() {},
  mounted() {},
  methods: {
    chatBack() {
      this.$emit('chatBack')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.mint-header {
  height: 88px;
  background: #fff;
  .mint-header-title {
    font-size: 36px;
    color: #000;
  }
  .mintui-back {
    font-size: 32 px;
    color: #000;
  }
  .mintui-more {
    font-size: 32 px;
    color: #000;
  }
}
.mint-header.is-fixed {
}
</style>
