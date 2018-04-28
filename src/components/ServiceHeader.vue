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
  props: {
    title: {
      default: ''
    },
    more: {
      default: false
    },
    back: {
      default: false
    }
  },
  data() {
    return {}
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
  height: 92px;
  background: #fff;
  .mint-header-title {
    font-size: 36px;
    color: #000;
    padding-top: 5px;
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
  // position: absolute;
}
</style>
