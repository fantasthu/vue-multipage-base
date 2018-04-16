<template>
  <div class="customer-service">
    <div class="s-container flex-h">
      <session v-show="showSession" :userList.sync="userList"></session>
      <chat v-show="showChat" @sendWaiterMsgToUser="sendWaiterMsgToUser"></chat>
      <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        :closeOnClickModal="false"
        position="center">
        <div class="login">
            <div class="title">登录</div>
            <div class="input-container">
              <!-- <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field> -->
              <!-- <mt-field label="密码" placeholder="请输入密码" v-model="username"></mt-field> -->
              <mt-button type="default" size="large">default</mt-button>
            </div>
        </div>
</mt-popup>
    </div>
  </div>
</template>

<script>
import Chat from '../components/Chat.vue'
import Session from '../components/Session.vue'
import socketio from 'socket.io-client'
import { formatTime } from '../service/tools'
import { Popup, Field } from 'mint-ui'

export default {
  name: 'about',
  components: { Chat, Session, Popup, Field },
  data() {
    return {
      socket: {},
      showSession: true,
      showChat: true,
      userList: [
        {
          headImg:
            'http://thirdwx.qlogo.cn/mmopen/vi_32/dPP0YeN7pX4Q9IxNSx7KuK0NoL5icHiciclibspkbMUdyj1tFFUW8pKmTaDAhL2BY0rWmF9O5qRdOwtvtYe43Gq61g/132',
          idx: 5,
          isWaiter: 'no',
          msg: '1221',
          formatTime: '2018-04-13 17:19:59',
          name: '政',
          openId: 'owGUi0lMm9Ki5UVJPIUFfIEg7XXY',
          sessionId: 'owGUi0lMm9Ki5UVJPIUFfIEg7XXY1523677906924',
          whichProgramme: 'vip'
        }
      ],
      currentUserAllMsg: [],
      waiterOpenId: '',
      waiterInfo: {},
      popupVisible: false
    }
  },
  created() {
    let wtoi = document.querySelector('.wtoi')
    this.waiterOpenId = wtoi.innerHTML
    this.socket = socketio.connect('cs.velo.top/')

    this.$root.eventBus.$on('toChat', params => {
      if (params.from === 'chat') {
        this.showSession = true
        this.showChat = false
        this.socket.emit('backToUserListFreshUserList', {
          currentUserOpenId: params.currentUserOpenId
        })
      } else {
        this.showSession = false
        this.showChat = true
      }
      // 点击用户列表进入对话框, 改变当前接受消息对象
      if (params.openId) {
        console.log('on-tochart', params.openId)
        this.socket.emit('receiveThisUserMsg', params.openId)
      }
    })

    this.socket.on('init', data => {
      console.log('链接状态-init', data)
      this.socket.emit('getWaiterInfoByOpenId', this.waiterOpenId)
    })
    this.socket.on('sendWaiterInfo', waiterInfo => {
      console.log('index---waiterInfo', waiterInfo)
      this.waiterInfo = waiterInfo[0]
      this.$root.eventBus.$emit('waiterInfo', waiterInfo[0])
    })
    this.socket.on('userList', userList => {
      console.log('node推送userList', userList)
      userList.forEach((item, index) => {
        item.formatTime = formatTime(item.msgTime, 6)
        item.headImg = item.headImg
          ? item.headImg
          : 'http://cs.velo.top/customerService/commonAccount/noHeadImg.jpeg'
      })
      this.userList = userList
    })
    this.socket.on('userMsg', obj => {
      this.$root.eventBus.$emit('userMsg', obj)
      this.userList.map((item, index) => {
        if (item.openId === obj[0].openId) {
          item.hasBeenRead = 0
          item.msg = obj[0].msg
          console.log('item------', item)
          console.log('obj------', obj)
        }
        return item
      })
      console.log('接收用户发送的消息', obj)
    })

    this.socket.on('userAllMsg', obj => {
      this.currentUserAllMsg = obj.userAllMsg
      obj.userAllMsg.forEach((item, index) => {
        item.headImg = item.headImg
          ? item.headImg
          : 'http://cs.velo.top/customerService/commonAccount/noHeadImg.jpeg'
        item.formatTime = formatTime(item.msgTime, 6)
      })
      this.$root.eventBus.$emit('userAllMsg', obj)
      console.log('接收当前用户的所有消息', obj)
    })
  },
  mounted() {
    this.$nextTick(() => {
      // 判断屏幕修改设置宽度值
      this.getScreenWidth()
    })
  },
  methods: {
    sendWaiterMsgToUser(waiterMsgObj) {
      console.log('waiterMsgObj', waiterMsgObj)
      this.socket.emit('sendWaiterMsgToUser', waiterMsgObj)
    },
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
