<template>
  <div class="customer-service">
    <!-- 此处是图片lightBox -->
    <div :class="{'showFullImgBox': showFullImgUrl!==''}" v-show="showFullImgUrl" @click.stop="closeFullImg">
      <img :class="{showFullImgUrl: showFullImgUrl}" :src="showFullImgUrl" alt="" >    
    </div>
    <!-- 此处是聊天界面 -->
    <div class="s-container flex-h">
      <left-menu v-show="showLeftMenu"></left-menu>
      <session v-if="showSession" :userList.sync="userList"></session>
      <chat v-show="showChat" @sendWaiterMsgToUser="sendWaiterMsgToUser"></chat>
      <right-menu></right-menu>
      <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        :closeOnClickModal="false"
        position="center">
        <div class="login">
            <div class="title">客服登录</div>
            <div class="input-container">
              <div class="input-ctr username flex-v flex-cc">
                <div class="name">用户名</div>
                <div class="flex-h flex-cc input-text">
                  <input type="text" class="text flex-1" v-model="username">
                </div>
              </div>
              <div class="input-ctr password flex-v flex-cc">
                <div class="name">密码</div>
                <div class="flex-h flex-cc input-text">
                  <input type="password" class="text" v-model="password">
                </div>
                <div class="login-remind" style="position: absolute;bottom: 78px;left: 24px;color: red;">{{loginRemid}}</div>
              </div>
              <div class="submit-ctr">
                <div class="tologin" @click="toLogin">
                  登录
                </div>
              </div>
            </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script>
import Chat from '../components/Chat.vue'
import Session from '../components/Session.vue'
import LeftMenu from '../components/LeftMenu.vue'
import RightMenu from '../components/RightMenu.vue'
import socketio from 'socket.io-client'
import axios from 'axios'
import { formatTime } from '../service/tools'
import { Popup, Field } from 'mint-ui'

export default {
  name: 'about',
  components: { Chat, Session, Popup, Field, LeftMenu, RightMenu },
  data() {
    return {
      username: '',
      password: '',
      socket: {},
      showSession: true,
      showChat: true,
      showLeftMenu: true,
      userList: [],
      currentUserAllMsg: [],
      waiterOpenId: '',
      waiterInfo: {},
      popupVisible: true,
      loginRemid: '',
      platForm: '',
      showFullImgUrl: '',
      iNotifyMsg: null,
      currentPageIsActive: true
    }
  },
  created() {
    // this.$root.eventBus.$off('sho2wCurrentImg')
    window.onfocus = () => {
      this.currentPageIsActive = true
      this.stopNotice()
    }
    window.onblur = () => {
      this.currentPageIsActive = false
    }
    // 初始化消息提醒, 播放声音
    this.initNoticeMsg()
    // 判断是否需要登录
    this.getLoginStatus()
    let imgFlag = false
    this.$root.eventBus.$on('showCurrentImg', msgPicUrl => {
      if (!imgFlag) {
        imgFlag = true
        setTimeout(() => {
          this.showFullImgUrl = msgPicUrl
          imgFlag = false
        }, 500)
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
    /**
     * 添加cookie
     */
    addCookie(objName, objValue, objHours) {
      var str = objName + '=' + escape(objValue)
      // 为0时不设定过期时间，浏览器关闭时cookie自动消失
      if (objHours > 0) {
        var date = new Date()
        var ms = objHours * 3600 * 1000
        date.setTime(date.getTime() + ms)
        str += '; expires=' + date.toGMTString()
      }
      document.cookie = str
    },
    /**
     * 获取指定名称的cookie的值  this.getCookie('waiterOpenId')
     */
    getCookie(objName) {
      var arrStr = document.cookie.split('; ')
      for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split('=')
        if (temp[0] === objName) {
          return unescape(temp[1])
        }
      }
    },
    /**
     * 关闭全屏预览图片
     */
    closeFullImg() {
      this.showFullImgUrl = ''
    },
    /**
     * socket 连接
     */
    startSocket() {
      let wtoi = document.querySelector('.wtoi')
      if (wtoi.innerHTML) {
        this.waiterOpenId = wtoi.innerHTML
      } else {
        this.waiterOpenId = this.getCookie('waiterOpenId') || ''
      }
      this.socket = socketio.connect('cs.velo.top')
      // 判断是显示pc端的chat还是mobile端的chat
      this.$root.eventBus.$on('toChat', params => {
        if (params.from === 'm-session') {
          this.showSession = false
          this.showChat = true
        } else if (params.from === 'p-session') {
          this.showSession = true
          this.showChat = true
        }
        // 点击用户列表进入对话框, 改变当前接受消息对象
        if (params.openId) {
          this.socket.emit('receiveThisUserMsg', params.openId)
        }
      })
      this.$root.eventBus.$on('toSession', params => {
        if (params.from === 'chat') {
          this.showSession = true
          this.showChat = false
          this.socket.emit('backToUserListFreshUserList', {
            currentUserOpenId: params.currentUserOpenId
          })
        }
      })
      // 初始化
      this.socket.on('init', data => {
        this.socket.emit('getWaiterInfoByOpenId', this.waiterOpenId)
      })
      // 发送客服消息
      this.socket.on('sendWaiterInfo', waiterInfo => {
        this.waiterInfo = waiterInfo[0]
        this.$root.eventBus.$emit('waiterInfo', waiterInfo[0])
      })
      // 获取左侧的用户列表
      this.socket.on('userList', userList => {
        userList.forEach((item, index) => {
          if (item.name.length > 3) {
            item.name = item.name.substr(0, 3) + '...'
          }
          item.formatTime = formatTime(item.msgTime, 6)
          item.headImg = item.headImg
            ? item.headImg
            : 'http://cs.velo.top/customerService/commonAccount/noHeadImg.jpeg'
        })
        this.userList = userList
        this.$root.eventBus.$emit('userList', userList)
      })
      // 接收发送的消息
      this.socket.on('userMsg', obj => {
        if (!this.currentPageIsActive) {
          this.startNotice()
        }
        this.$root.eventBus.$emit('userMsg', obj)
      })
      // 如果发送超过五条toast提示
      this.socket.on('waiterMsgIsOver', obj => {
        this.$toast('您发的消息超过5条, 请等待用户回复之后再发送 !')
      })
      // 接收到当前用户的所有msg
      this.socket.on('userAllMsg', obj => {
        this.currentUserAllMsg = obj.userAllMsg
        obj.userAllMsg.forEach((item, index) => {
          item.headImg = item.headImg
            ? item.headImg
            : 'http://cs.velo.top/customerService/commonAccount/noHeadImg.jpeg'
          item.formatTime = formatTime(item.msgTime, 6)
        })
        this.$root.eventBus.$emit('userAllMsg', obj)
      })
    },
    /**
     * 调用函数, 选中用户列表第一个
     */
    pcSetFirstItem() {
      let sessionItems = document.querySelector('.session .list .item')
      sessionItems.click()
      console.log('sessionItems', sessionItems)
    },
    /**
     *获取客服的openId
     */
    getWaiterOpenId() {
      this.waiterOpenId = this.getCookie('waiterOpenId') || ''
      console.log('this.waiterOpenId', this.waiterOpenId)
      if (!this.waiterOpenId) {
        return
      }
      if (this.waiterOpenId.trim() === '') {
        this.showSession = false
        this.showChat = false
        this.popupVisible = true
      } else {
        this.showSession = true
        this.showChat = true
        this.popupVisible = false
      }
      console.log(' this.showSession ', this.showSession)
    },
    /**
     * 登录逻辑优化
     */
    toLogin() {
      console.log('this.name', this.username, this.password)
      axios
        .post('http://cs.velo.top/customerService/commonAccount/pcLogin', {
          userName: this.username,
          passWord: this.password
        })
        .then(_ => {
          this.waiterOpenId = _.data.obj.waiterOpenId

          if (this.waiterOpenId) {
            // 登录成功
            console.log(
              'this.waiterOpenId',
              this.waiterOpenId,
              typeof this.waiterOpenId
            )
            // localStorage.setItem('waiterOpenId', this.waiterOpenId)
            this.addCookie('waiterOpenId', this.waiterOpenId)
            console.log(
              'localStorage.setItem-waiterOpenId',
              _.data.obj.waiterOpenId
            )
            this.showSession = true
            this.showChat = true
            this.popupVisible = false
            this.startSocket()
            setTimeout(() => {
              this.pcSetFirstItem()
            }, 1000)
          } else {
            // 登录失败
            this.loginRemid = '密码或账号错误'
            console.log('密码或账号错误')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    /**
     * 获取登录状态
     */
    getLoginStatus() {
      // this.waiterOpenId = localStorage.getItem('waiterOpenId') || ''
      this.waiterOpenId = this.getCookie('waiterOpenId')
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        this.popupVisible = false
        this.showSession = true
        this.showChat = true
      } else {
        if (this.waiterOpenId ? this.waiterOpenId.trim().length > 0 : 0) {
          this.popupVisible = false
          this.showSession = true
          this.showChat = true
        } else {
          this.popupVisible = true
          this.showSession = false
          this.showChat = false
        }
      }
    },
    /**
     * 客服发送消息
     */
    sendWaiterMsgToUser(waiterMsgObj) {
      console.log('waiterMsgObj', waiterMsgObj)
      this.socket.emit('sendWaiterMsgToUser', waiterMsgObj)
    },
    /**
     * 获取屏幕宽度
     */
    getScreenWidth() {
      const that = this
      let width = window.document.documentElement.clientWidth
      this.$root.eventBus.showWidth = width
      let wtoi = document.querySelector('.wtoi')
      // pc端
      if (width > 768) {
        this.platForm = 'pc'
        console.log('pc端')
        if (this.getCookie('waiterOpenId')) {
          this.startSocket()
          setTimeout(() => {
            this.pcSetFirstItem()
          }, 500)
        }
        // this.$root.eventBus.$emit('pcSize', '')
        // pc端初次进入默认选中第一个item
        that.showSession = true
        that.showChat = true
        that.showLeftMenu = true
      } else if (width < 768) {
        if (!wtoi.innerHTML) {
          // 不在微信端
          if (!this.getCookie('waiterOpenId')) {
            return
          }
        }
        this.platForm = 'mobile'
        this.startSocket()
        console.log('移动端')
        that.showSession = true
        that.showChat = false
        that.showLeftMenu = false
      }
      window.onresize = function(e) {
        width = window.document.documentElement.clientWidth
        that.$root.eventBus.showWidth = width
        // wtoi如果有值则在微信端
        let wtoi = document.querySelector('.wtoi')
        // pc端
        if (width > 768) {
          that.showSession = true
          that.showChat = true
          that.showLeftMenu = true
          // 告知chat组件重新定义message滚动
          that.$root.eventBus.$emit('pcChatHandler')
        } else if (width < 768) {
          if (!wtoi.innerHTML) {
            // 不在微信端
            if (!this.getCookie('waiterOpenId')) {
              return
            }
          }
          if (that.showChat && !that.showSession) {
            that.showChat = true
            that.showSession = false
            that.showLeftMenu = false
          } else {
            that.showSession = true
            that.showChat = false
            that.showLeftMenu = false
          }
        }
      }
    },
    initNoticeMsg() {
      this.iNotifyMsg = new Notify()
      this.iNotifyMsg.init({
        effect: 'flash',
        interval: 500,
        message: '有消息拉！',
        audio: {
          file: [
            'http://cs.velo.top/customerService/commonAccount/dialogue/QQ.mp3'
          ]
        },
        notification: {
          title: '',
          body: ''
        }
      })
    },
    startNotice() {
      this.iNotifyMsg.setFavicon('!').player()
      this.iNotifyMsg.setTitle('有新消息！')
    },
    stopNotice() {
      // this.iNotifyMsg.faviconClear()
      this.iNotifyMsg.setFavicon('')
      this.iNotifyMsg.setTitle('velo客服')
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
  user-select: text;
}
body {
  padding-top: constant(safe-area-inset-top);
  padding-left: constant(safe-area-inset-left);
  padding-right: constant(safe-area-inset-right);
  padding-bottom: constant(safe-area-inset-bottom);
  user-select: text;
}
.customer-service {
  .showFullImgBox {
    // display: none;
    position: fixed;
    top: 0px;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    overflow: scroll;
    background: rgba(0, 0, 0, 0.75);
    z-index: 10;
    .showFullImgUrl {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 100%;
      // transform: translateY(-50%);
      z-index: 9;
    }
  }
  height: 100%;
  .s-container {
    height: 100%;
    .login {
      width: 525px;
      padding: 35px;
      background: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
      border-radius: 5px;
      .title {
        margin-top: 1px;
        margin-bottom: 36px;
        font-family: PingFangSC-Semibold;
        font-size: 36px;
        color: rgba(0, 0, 0, 0.87);
        letter-spacing: 2.77px;
      }
      .input-container {
        .input-ctr {
          .login-remind {
            position: absolute;
            bottom: 80px;
            left: 24px;
            color: red;
          }
          margin-bottom: 18px;
          .name {
            width: 100%;
            font-family: PingFang-SC-Regular;
            font-size: 22px;
            color: rgba(0, 0, 0, 0.87);
            letter-spacing: 1.5px;
          }
          .input-text {
            width: 100%;
            .text {
              background: #f1f1f1;
              border-radius: 5px;
              width: 100%;
              height: 60px;
              padding-left: 18px;
              line-height: 60px;
              margin-top: 12px;
            }
          }
        }
        .submit-ctr {
          padding-top: 18px;
          margin-bottom: 1px;
          .tologin {
            width: 100%;
            height: 60px;
            line-height: 60px;
            text-align: center;
            background: #f9e77f;
            border-radius: 5px;
            font-family: PingFang-SC-Regular;
            font-size: 24px;
            color: rgba(0, 0, 0, 0.87);
            letter-spacing: 2px;
          }
        }
      }
    }
  }
}
</style>
