<template>
  <div class="chat flex-1">
    <service-header  @chatBack="chatBack" :back="true" class="service-header" :title='currentUserName'></service-header>
    <div class="pc-header">
      <div class="name">女神逗</div>
    </div>
    <div class="message" ref="wrapper">
      <ul class="message-list">

        <template v-for="(item,index) in currentUserAllMsg">
          <li class="item item-left flex-h"  v-if="item.isWaiter !== 'yes'">
            <div class="avatar"><img :src="item.headImg" alt=""></div>
            <div class="info">
              <div class="time">{{item.formatTime}}</div>
              <div class="content">
                <div class="text" v-if="item.msgType == 'text'">{{item.msg}}</div>
                <div class="image" v-if="item.msgType == 'image'"><img :src="item.msgPicUrl" alt=""></div>
              </div>
            </div>
          </li>

          <li class="item item-right flex-h" v-if="item.isWaiter == 'yes'">
            <div class="avatar"><img :src="item.headImg" alt=""></div>
            <div class="info">
              <div class="time">{{item.formatTime}}</div>
              <div class="content">
                <p class="text" v-if="item.msgType == 'text'">{{item.msg}}</p>
                <div class="image" v-if="item.msgType == 'image'"><img :src="item.msgPicUrl" alt=""></div>
              </div>
            </div>
          </li>
        </template>
        
        <!-- <li class="item item-left flex-h" v-for="(item,index) in currentUserAllMsg" :key="index" v-if="item.isWaiter !== 'yes'">
          <div class="avatar"><img :src="item.headImg" alt=""></div>
          <div class="info">
            <div class="time">{{item.formatTime}}</div>
            <div class="content">
              <div class="text">{{item.msg}}</div>
            </div>
          </div>
        </li>

        <li class="item item-right flex-h" v-for="(item,index) in currentUserAllMsg" :key="index" v-if="item.isWaiter == 'yes'">
          <div class="avatar"><img :src="item.headImg" alt=""></div>
          <div class="info">
            <div class="time">{{item.formatTime}}</div>
            <div class="content">
              <p class="text">{{item.msg}}</p>
            </div>
          </div>
        </li> -->

      </ul>
    </div>
    <div class="pc-input-container">
      <div class="to-input flex-h flex-cc">
        <form action="javascrpt:;">
          <textarea @keypress="enterHandler" v-model="inputData" type="text" class="text-input" ></textarea>
        </form>
        <div class="enter-hint">按下Enter发送</div>
      </div>
    </div>
    <div class="input-container">
      <div class="to-input">
        <form action="javascrpt:;">
          <input type="text" class="text-input" v-model="inputData" @focus="focus">
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Header, Button } from 'mint-ui'
import ServiceHeader from './ServiceHeader'
import Bscroll from 'better-scroll'
import { formatTime } from '../service/tools'

// import $ from 'jquery'
export default {
  name: 'chat',
  components: { Header, Button, ServiceHeader },
  props: {},
  data() {
    return {
      timerId: null,
      inputData: '',
      back: require('../assets/img/icon_oneway.png'),
      currentUserAllMsg: [],
      currentUserOpenId: '',
      waiterInfo: {},
      currentUserName: '',
      scroll: null
    }
  },
  created() {
    // console.log('caht-waiterInfo', this.waiterInfo)
    // this.$root.eventBus.$on('toChat', () => {
    //   this.reloadMessageScroll()
    // })
    // this.$root.eventBus.$on('pcChatHandler', () => {
    //   this.reloadMessageScroll()
    // })
    this.$root.eventBus.$on('waiterInfo', (waiterInfo) => {
      this.waiterInfo = waiterInfo
      console.log('chat-waiterInfo', this.waiterInfo)
    })
    this.$root.eventBus.$on('userAllMsg', (obj) => {
      this.currentUserAllMsg = obj.userAllMsg
      this.currentUserName = obj.userAllMsg[0].name + '的聊天'
      this.currentUserOpenId = obj.openId
      setTimeout(() => {
        this.scroll.scrollTo(0, this.scroll.maxScrollY)
      }, 100)
    })
    this.$root.eventBus.$on('userMsg', (arr) => {
      arr[0].formatTime = formatTime(arr[0].msgTime, 6)
      arr[0].headImg = arr[0].headImg ? arr[0].headImg : 'http://cs.velo.top/customerService/commonAccount/noHeadImg.jpeg'
      this.currentUserAllMsg.push(arr[0])
      // console.log('this.scroll', this.scroll.scrollerHeight)
      // const last = document.querySelector('.message .item')
      setTimeout(() => {
        this.scroll.scrollTo(0, this.scroll.maxScrollY)
      }, 100)
      // this.scroll.scrollTo(0, -this.scroll.scrollerHeight)
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.reloadMessageScroll()
      document
        .querySelector('.input-container form')
        .addEventListener('submit', () => {
          // h5端提交信息
          // alert(this.inputData)
          this.sendWaiterMsg(this.inputData)
          this.inputData = ''
        })
    })
  },
  methods: {
    reloadMessageScroll() {
      this.timer = null
      this.timer = setTimeout(() => {
        this.scroll = new Bscroll(this.$refs.wrapper, {
          mouseWheel: true
        })
        console.log('scroll', scroll)
      }, 20)
    },
    enterHandler(event) {
      const keyCode = event.keyCode
        ? event.keyCode
        : event.which ? event.which : event.charCode
      if (keyCode === 13) {
        // pc 端提交消息
        alert(this.inputData)
      }
    },
    chatBack() {
      this.$root.eventBus.$emit('toChat', {from: 'chat', currentUserOpenId: this.currentUserOpenId})
    },
    sendWaiterMsg(inputData) {
      let obj = {
        name: this.waiterInfo.name,
        headImg: this.waiterInfo.headImg,
        openId: this.currentUserAllMsg[0].openId,
        msg: inputData,
        msgType: 'text',
        isWaiter: 'yes',
        waiterOpenId: this.waiterInfo.openId,
        whichProgramme: this.currentUserAllMsg[0].whichProgramme
      }
      // this.waiterInfo.formatTime = formatTime(parseInt(new Date().getTime() / 1000), 6)
      // this.waiterInfo.msg = inputData
      // this.currentUserAllMsg.push(this.waiterInfo)
      console.log('------------------------this.waiterInfo-------------------------', this.waiterInfo)
      // console.log('sendWaiterMsg', obj)
      this.$emit('sendWaiterMsgToUser', obj)
    },
    focus() {
      var agent = navigator.userAgent.toLowerCase()
      var version
      if (agent.indexOf('like mac os x') > 0) {
        // ios
        var reg = /os [\d._]*/gi
        var verinfo = agent.match(reg)
        version = (verinfo + '').replace(/[^0-9|_.]/gi, '').replace(/_/gi, '.')
        if (version.indexOf('11.2') > -1) {
          return
        }
      }
      this.tiemr = setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight)
      }, 500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@media (max-width: 768px) {
  .chat {
    position: relative;
    width: 100%;
    .pc-header {
      display: none;
    }
    .message {
      position: absolute;
      top: 88px;
      bottom: 120px;
      left: 0;
      right: 0;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      .message-list {
        background: #fff;
        overflow: auto;
        .item {
          padding: 67px 20px 30px 20px;
          .avatar {
            position: relative;
            img {
              width: 80px;
              height: 80px;
              border-radius: 12px;
            }
          }
          .info {
            position: relative;
            background: #fff;
            border-radius: 40px;
            max-width: 472px;
                               
            .time {
              position: absolute;
              top: -37px;
              font-family: PingFangSC-Regular;
              font-size: 18px;
              color: #bbbbbb;
              letter-spacing: 0;
              min-width: 350px;       
            }
            .content {
              .text {
                font-size: 28px;
                letter-spacing: 3px;
                line-height: 42px;
                padding: 19px 36px;
                word-break: break-all;
                .image {
                  width: 256px;
                  height: 256px;
                  > img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
          }
        }
        .item-left {
          .info {
            background: #f4f4f4;
            margin-left: 24px;
            .time {
              left: 36px;
            }
            .content {
              .text {
                color: #353535;
              }
            }
          }
        }
        .item-right {
          flex-direction: row-reverse;
          text-align: right;
          .info {
            background: #f9e77f;
            margin-right: 24px;
            .time {
              right: 36px;
            }
            .content {
              .text {
                color: #000;
              }
            }
          }
        }
      }
    }
    .pc-input-container {
      display: none;
    }
    .input-container {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 120px;
      box-shadow: 0 -1px 0 0 #dddddd;
      .to-input {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        top: 0;
        height: 80px;
        margin: auto;
        background: #fff;
        form {
        }
        .text-input {
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0;
          top: 0;
          margin: auto;
          width: 574px;
          // width: calc(100%-48px);
          padding: 0 48px;
          background: #f7f7f7;
          border-radius: 100px;
          font-size: 30px;
          color: #353535;
        }
      }
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 1650px) {
  .chat {
    position: relative;
    border-left: 2px solid #e5e5e5;
    margin-left: 440px;
    .service-header {
      display: none;
    }
    .pc-header {
      width: 100%;
      height: 115px;
      line-height: 115px;
      border-bottom: 2px solid #e5e5ee;
      .name {
        font-family: PingFangSC-Medium;
        font-size: 30px;
        color: #353535;
        letter-spacing: 0;
        margin-left: 37px;
      }
    }
    .message {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 285px;
      top: 117px;
      overflow-y: hidden;
      .message-list {
        background: #fff;
        overflow: auto;
        .item {
          padding: 76px 0 36px 0;
          .avatar {
            position: relative;

            img {
              width: 70px;
              height: 70px;
              border-radius: 12px;
            }
          }
          .info {
            position: relative;
            background: #fff;
            border-radius: 35px;
            padding: 14px 24px;
            .time {
              position: absolute;
              top: -37px;
              font-family: PingFangSC-Regular;
              font-size: 18px;
              color: #bbbbbb;
              letter-spacing: 0;
            }
            .content {
              .text {
                font-family: PingFangSC-Regular;
                font-size: 24px;
                color: #353535;
                letter-spacing: 2.57px;
                text-align: left;
                word-break: break-all;
                line-height: 42px;
              }
            }
          }
        }
        .item-left {
          .avatar {
            margin-left: 36px;
          }
          .info {
            background: #f4f4f4;
            margin-left: 24px;
            margin-right: 124px;
            .time {
            }
            .content {
              .text {
                color: #353535;
              }
            }
          }
        }
        .item-right {
          flex-direction: row-reverse;
          text-align: right;
          .avatar {
            margin-right: 36px;
          }
          .info {
            background: #f9e77f;
            margin-right: 24px;
            margin-left: 124px;
            .time {
            }
            .content {
              .text {
                color: #000;
              }
            }
          }
        }
      }
    }
    .pc-input-container {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      border-top: 2px solid #e5e5e5;
      .to-input,
      form {
        .text-input {
          width: 100%;
          height: 100%;
          border: none;
          font-family: PingFangSC-Regular;
          font-size: 24px;
          color: #353535;
          letter-spacing: 2.57px;
          text-align: left;
          line-height: 42px;
        }
      }

      .to-input {
        position: relative;
        padding: 20px;
        height: 243px;

        .enter-hint {
          position: absolute;
          right: 36px;
          bottom: 36px;
          font-family: PingFangSC-Regular;
          font-size: 22px;
          color: #b2b2b2;
          letter-spacing: 2.36px;
          text-align: right;
          line-height: 42px;
        }
      }
      form {
        width: 100%;
        height: 100%;
      }
    }
    .input-container {
      display: none;
    }
  }
}
</style>
