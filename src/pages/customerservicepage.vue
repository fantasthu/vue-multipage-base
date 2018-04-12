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
    this.$root.eventBus.$on('toChat', index => {
      this.showSession = false
      this.showChat = true
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
      that.$root.eventBus.showWidth =
        window.document.documentElement.clientWidth
      if (that.$root.eventBus.showWidth > 768) {
        that.showSession = true
        that.showChat = true
      } else if (that.$root.eventBus.showWidth < 768) {
        that.showSession = true
        that.showChat = false
      }
      window.onresize = function(e) {
        const width = window.document.documentElement.clientWidth
        that.$root.eventBus.showWidth = width
        if (width > 768) {
          that.showSession = true
          that.showChat = true
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
<style lang="scss" scoped>
.customer-service {
}
</style>
