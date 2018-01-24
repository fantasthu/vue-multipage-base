<template>
  <div class="indexpage">
    <div class="banner">
      <div>查看规则</div>
    </div>
    <div class="kaquan"></div>
    <div class="hot-products">
      <div class="title"></div>
      <div class="products">
        <div class="item">
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'wx'
export default {
  name: 'indexpage',
  data() {
    return {
      msg: 'this is indexpage'
    }
  },
  created() {
    console.log('1212131231', wx)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indexpage {
  width: 100px;
}
</style>
