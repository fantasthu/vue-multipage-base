<template>
  <div class="customer-service">
    <div class="s-container flex-h">
      <session v-show="showSession"></session>
      <chat v-show="showChat"></chat>
    </div>
  </div>
</template>

<script>
// import { Button, Cell, Field, Radio, MessageBox, Indicator } from 'mint-ui'
import Chat from '../components/Chat.vue'
import Session from '../components/Session.vue'
export default {
  name: 'about',
  components: { Chat, Session },
  data() {
    return {
      showSession: true,
      showChat: true
    }
  },
  created() {
    this.$root.eventBus.$on('toChat', params => {
      if (params.from === 'chat') {
        this.showSession = true
        this.showChat = false
      } else {
        this.showSession = false
        this.showChat = true
      }
    })
  },
  mounted() {
    this.$nextTick(() => {
      // 判断屏幕修改设置宽度值
      this.getScreenWidth()
    })
  },
  methods: {
    getScreenWidth() {
      const that = this
      let width = window.document.documentElement.clientWidth
      this.$root.eventBus.showWidth = width
      if (width > 768) {
        that.showSession = true
        that.showChat = true
      } else if (width < 768) {
        that.showSession = true
        that.showChat = false
      }
      window.onresize = function(e) {
        width = window.document.documentElement.clientWidth
        that.$root.eventBus.showWidth = width
        if (width > 768) {
          that.showSession = true
          that.showChat = true
          // 告知chat组件重新定义message滚动
          that.$root.eventBus.$emit('pcChatHandler')
        } else if (width < 768) {
          if (that.showChat && !that.showSession) {
            that.showChat = true
            that.showSession = false
          } else {
            that.showSession = true
            that.showChat = false
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
}
body {
  padding-top: constant(safe-area-inset-top);
  padding-left: constant(safe-area-inset-left);
  padding-right: constant(safe-area-inset-right);
  padding-bottom: constant(safe-area-inset-bottom);
}
.customer-service {
  height: 100%;
  .s-container {
    height: 100%;
  }
}
</style>
