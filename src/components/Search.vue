<template>
  <div class="flex-h flex-cc search">
      <img src="../assets/img/icon_search.png" alt="">
      <input type="text" class="search flex-1" @input="searchInput" @focus="searchFocus" :placeholder="placeholder">
  </div>
</template>

<script>
export default {
  name: 'search',
  components: {},
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    searchInput(e) {
      this.$emit('input', e.target.value)
    },
    searchFocus(e) {
      this.$emit('focus')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// 手机端
@media (max-width: 768px) {
  .search {
    position: relative;
    height: 110px;
    img {
      position: absolute;
      left: 84px;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 24px;
      height: 24px;
      z-index: 10;
    }
    input {
      height: 72px;
      margin: 0 42px;
      padding-left: 108px;
      font-family: PingFang-SC-Medium;
      font-size: 22px;
      color: #353535;
      letter-spacing: 1.83px;
      background: #f4f4f4;
      border-radius: 100px;
    }
  }
}

//pc端
@media screen and (min-width: 768px) {
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
      z-index: 10;
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
</style>
