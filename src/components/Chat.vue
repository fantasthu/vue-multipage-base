<template>
  <div class="chat flex-1">
    <service-header  @chatBack="chatBack" :back="true" class="service-header" :title='currentUserName'></service-header>
    <div class="pc-header flex-h">
      <div class="name">{{currentUserName}}</div>
      <div class="singOut" @click.stop="singOut">退出</div>
    </div>
    <div class="message" ref="wrapper">
      <ul class="message-list">

        <template v-for="(item,index) in currentUserAllMsg">
          <li class="item item-left flex-h"  v-if="item.isWaiter !== 'yes'" @click.stop="setKeyboardDown">
            <div class="avatar"><img :src="item.headImg" alt=""></div>
            <div class="info">
              <div class="time">{{item.formatTime}}</div>
              <div class="content">
                <div class="text" v-if="item.msgType == 'text'">{{item.msg}}</div>
                <div class="image" v-if="item.msgType == 'image'"><img :src="item.msgPicUrl" alt="" @click.stop="showMsgPic(item.msgPicUrl)"></div>
              </div>
            </div>
          </li>

          <li class="item item-right flex-h" v-if="item.isWaiter == 'yes'" @click.stop="setKeyboardDown">
            <div class="avatar"><img :src="item.headImg" alt=""></div>
            <div class="info">
              <div class="time">{{item.formatTime}}</div>
              <div class="content">
                <p class="text" v-if="item.msgType == 'text'">{{item.msg}}</p>
                <div class="image" v-if="item.msgType == 'image'"><img :src="item.msgPicUrl" alt="" @click.stop="showMsgPic(item.msgPicUrl)"></div>
              </div>
            </div>
          </li>
        </template>

      </ul>
    </div>
    <div class="pc-input-container">
      <div class="to-input flex-h flex-cc">
        <div class="to-input-tools flex-h">
          <div class="tools-img">
            <img src="../assets/img/uploadImgIcon.png" alt="">
            <div class="uploadImg">
              <input type="file" id="fle" v-on:change="pcFileSelected">
            </div>
          </div>
          <div class="weixin-public flex-h flex-cc" @click.stop="setWaiterIsOnLine"><span :class="{'public-on': !isWaiterOnLine, 'public-off': isWaiterOnLine}">{{isWaiterOnLine?'公众号消息提醒已关闭':'公众号消息提醒已开启'}}</span></div>
        </div>
        <form action="javascrpt:;">
          <textarea @keypress="enterHandler" v-model="inputData" type="text" class="text-input" ></textarea>
        </form>
        <div class="enter-hint">按下Enter发送</div>
      </div>
    </div>
    <div class="input-container">
      <div class="to-input">
        <form action="javascrpt:;" class="flex-h flex-cc" @click.stop="setLastMsgInView">
          <textarea  ref="mobileTextArea" :style="{'lineHeight':lineHeight}" :rows="rows"  type="text" class="text-input flex-1" v-model="inputData" @focus="focus"></textarea>
          <div class="more-tools" @click.stop="showToolBox"><img src="../assets/img/add-icon.png" alt=""></div>
          <div class="h5-send" @click.stop="mobileSendMsg">发送</div>
        </form>
      </div>
      <div class="tools-box" v-if="isShowToolBox">
        <div class="tools-photos">
          <img src="../assets/img/tools-photos.png" alt="">
          <div class="uploadImg-h5">
            <input type="file" id="fleH5" v-on:change="mobileFileSelected">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Header, Button } from 'mint-ui'
import ServiceHeader from './ServiceHeader'
import Bscroll from 'better-scroll'
import { formatTime } from '../service/tools'
import api from '../service/api'
import $ from 'jquery'

export default {
  name: 'chat',
  components: { Header, Button, ServiceHeader },
  props: {},
  data() {
    return {
      timerId: null,
      inputData: '',
      back: require('../assets/img/icon_oneway.png'),
      currentUserAllMsg: [
        // {
        //   formatTime: '2018-04-13 17:19:59',
        //   hasBeenRead: 0,
        //   headImg:
        //     'https://wx.qlogo.cn/mmopen/vi_32/K3vFfda4OibhdoOOPFnJcvl8TSt6YkUNQiaV6w3RQNCKKZk5WcxqrOscm3K1G0NKBbpAWqnZicic5JzmcueKqIvZAQ/0',
        //   idx: '3',
        //   isWaiter: 'no',
        //   msg: 'asdfasdfasasdfasdf',
        //   msgPicUrl: null,
        //   msgType: 'text',
        //   msgTime: '',
        //   name: '政',
        //   openId: '',
        //   sessionId: '',
        //   waiterOpenId: '',
        //   whichProgramme: ''
        // }
      ],
      currentUserOpenId: '',
      waiterInfo: {},
      currentUserName: '',
      scroll: null,
      rows: 1,
      lineHeight: '',
      onTextScroll: true,
      client: null,
      isShowToolBox: false,
      platForm: '',
      noRepeat: false,
      isWaiterOnLine: false
    }
  },
  async created() {
    let isWaiterOnLine = await api.checkWaiterIsOnLine({})
    this.isWaiterOnLine = isWaiterOnLine.isWaiterOnLine
    this.client = new OSS.Wrapper({
      region: 'oss-cn-beijing',
      accessKeyId: 'LTAIqZNxHpwAnq9r',
      accessKeySecret: '88mdWv9IiQMecrwevspKWyyllIcd0f',
      bucket: 'velo-bucket',
      secure: true
    })
    this.$root.eventBus.$on('toChat', () => {
      this.reloadMessageScroll()
    })
    this.$root.eventBus.$on('pcChatHandler', () => {
      this.reloadMessageScroll()
    })
    this.$root.eventBus.$on('waiterInfo', waiterInfo => {
      this.waiterInfo = waiterInfo
      console.log('chat-waiterInfo', this.waiterInfo)
    })
    this.$root.eventBus.$on('userAllMsg', obj => {
      this.currentUserAllMsg = obj.userAllMsg
      this.currentUserName = obj.userAllMsg[0].name + '的聊天'
      this.currentUserOpenId = obj.openId
      setTimeout(() => {
        this.scroll.scrollTo(0, this.scroll.maxScrollY)
      }, 200)
    })
    this.$root.eventBus.$on('userMsg', arr => {
      arr[0].formatTime = formatTime(arr[0].msgTime, 6)
      arr[0].headImg = arr[0].headImg
        ? arr[0].headImg
        : 'http://cs.velo.top/customerService/commonAccount/noHeadImg.jpeg'
      this.currentUserAllMsg.push(arr[0])
      // console.log('this.scroll', this.scroll.scrollerHeight)
      // const last = document.querySelector('.message .item')
      setTimeout(() => {
        this.scroll.scrollTo(0, this.scroll.maxScrollY)
      }, 200)
      // this.scroll.scrollTo(0, -this.scroll.scrollerHeight)
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.reloadMessageScroll()
      // 手机端滚动
      const that = this
      this.$refs.mobileTextArea.onscroll = function(e) {
        if (that.onTextScroll) {
          that.onTextScroll = false
          that.mobileInputChange()
        }
      }
    })
  },
  methods: {
    setKeyboardDown() {
      if (!this.noRepeat) {
        this.noRepeat = true
        this.resetMessageBox()
        console.log('setKeyboardDown')
        this.isShowToolBox = false
        this.reloadMessageScroll()
        setTimeout(() => {
          this.resetMessageBox()
          this.reloadMessageScroll()
          this.noRepeat = false
        }, 1500)
      }
    },
    setLastMsgInView() {
      this.scroll.scrollTo(0, this.scroll.maxScrollY - 350)
    },
    async setWaiterIsOnLine() {
      if (this.isWaiterOnLine === 0) {
        this.isWaiterOnLine = 1
      } else if (this.isWaiterOnLine === 1) {
        this.isWaiterOnLine = 0
      }
      await api.setWeiXinPublicNotice({
        isWaiterOnLine: this.isWaiterOnLine
      })
      console.log('setWeiXinPublicNotice-----', this.isWaiterOnLine)
    },
    pcFileSelected(e) {
      if (!this.inputData && $('#fle')[0]) {
        var file = $('#fle')[0].files[0]
        if (file) {
          // 有图片消息,优先发送图片,不发文字
          this.pcSendImg(file)
        }
      }
      console.log('pcFileSelected')
    },
    mobileFileSelected() {
      if ($('#fleH5')[0]) {
        var file = $('#fleH5')[0] ? $('#fleH5')[0].files[0] : ''
        if (file) {
          // 有图片消息, 优先发送图片, 不发文字
          this.pcSendImg(file)
          // $('.message').css('bottom', 70)
          // this.resetMessageBox()
        }
        this.isShowToolBox = false
      }
    },
    showToolBox() {
      this.isShowToolBox = !this.isShowToolBox
      // 重置message显示框的高度
      this.resetMessageBox()
    },
    /**
     * 重置message显示框的高度
     */
    resetMessageBox() {
      this.$nextTick(() => {
        const inputContianerHeight = document.querySelector('.input-container')
          .offsetHeight
        console.log('inputContianerHeight', inputContianerHeight)
        document.querySelector(
          '.message'
        ).style.bottom = `${inputContianerHeight}px`
        this.reloadMessageScroll()
        setTimeout(() => {
          this.scroll.scrollTo(0, this.scroll.maxScrollY)
        }, 200)
      })
    },
    singOut() {
      console.log('退出登录')
      this.delCookie('waiterOpenId')
      location.reload()
    },
    delCookie(name) {
      var date = new Date()
      date.setTime(date.getTime() - 10000)
      document.cookie = name + '=a; expires=' + date.toGMTString()
    },
    showMsgPic(msgPicUrl) {
      if (!this.noRepeat) {
        this.noRepeat = true
        if (msgPicUrl) {
          this.$root.eventBus.$emit('showCurrentImg', msgPicUrl)
        }
        setTimeout(() => {
          this.noRepeat = false
        }, 1000)
      }
    },
    reloadMessageScroll() {
      this.timer = null
      this.timer = setTimeout(() => {
        this.scroll = new Bscroll(this.$refs.wrapper, {
          mouseWheel: true,
          click: true,
          tap: true,
          preventDefault: false,
          preventDefaultException: { className: /(^\s)text(\s$)/ }
        })
        console.log('scroll', scroll)
      }, 100)
    },
    mobileInputChange() {
      this.lineHeight = '1.6'
      this.rows += 1
      if (this.rows > 3) {
        return false
      }
      setTimeout(() => {
        this.onTextScroll = true
      }, 500)
    },
    // pc 端提交消息
    enterHandler(event) {
      const keyCode = event.keyCode
        ? event.keyCode
        : event.which ? event.which : event.charCode
      if (keyCode === 13) {
        // console.log('waiterInfo', this.waiterInfo)
        if (this.inputData) {
          this.pcSendMsg()
        }
        // if (!this.inputData && $('#fle')[0]) {
        //   var file = $('#fle')[0].files[0]
        //   if (file) {
        //     // 有图片消息,优先发送图片,不发文字
        //     this.pcSendImg(file)
        //   }
        // }
        setTimeout(() => {
          this.inputData = ''
        }, 100)
      }
    },
    // pc端发送文本消息
    pcSendMsg() {
      let obj = {
        name: this.waiterInfo.name,
        headImg: this.waiterInfo.headImg,
        openId: this.currentUserAllMsg[0].openId,
        msg: this.inputData,
        msgType: 'text',
        isWaiter: 'yes',
        waiterOpenId: this.waiterInfo.openId,
        whichProgramme: this.currentUserAllMsg[0].whichProgramme
      }
      this.$emit('sendWaiterMsgToUser', obj)
    },
    // pc端发送图片消息
    pcSendImg(file) {
      var reader = new FileReader()
      var AllowImgFileSize = 2100000
      reader.readAsDataURL(file)
      reader.onload = async e => {
        if (AllowImgFileSize !== 0 && AllowImgFileSize < reader.result.length) {
          this.$toast('图片超过2M, 上传失败!')
          return
        }
        let ossUrl = await this.uploadImgToOSS(file)
        console.log('ossUrl', ossUrl)
        this.uploadImgToUser(
          reader.result,
          this.currentUserAllMsg[0].openId,
          ossUrl
        )
        $('#fleH5').val('')
      }
    },
    uploadImgToUser(img, openId, ossUrl) {
      // 执行上传操作
      let waiterInfo = {
        name: this.waiterInfo.name,
        headImg: this.waiterInfo.headImg,
        openId: this.currentUserAllMsg[0].openId,
        msg: '',
        msgType: 'image',
        isWaiter: 'yes',
        waiterOpenId: this.waiterInfo.openId,
        whichProgramme: this.currentUserAllMsg[0].whichProgramme
      }
      let url = 'http://cs.velo.top/customerService/veloVip/sendImgToUser'
      $.post(
        url,
        {
          img64: img,
          openId: openId,
          waiterInfo: waiterInfo,
          ossUrl: ossUrl
        },
        ok => {
          console.log('图片上传到node成功', ok)
        }
      )
      $('#fle').val('')
    },
    uploadImgToOSS(img) {
      return new Promise((resolve, reject) => {
        const timestamp = +new Date()
        const storeAs = `customer-service/${timestamp}.png`
        this.client
          .multipartUpload(storeAs, img)
          .then(function(result) {
            let url = result.res.requestUrls[0]
            if (url.indexOf('?') > 0) {
              let noQueryUrl = url.substr(0, url.indexOf('?'))
              resolve(noQueryUrl)
            } else {
              resolve(url)
            }
          })
          .catch(function(err) {
            resolve({ err })
          })
      })
    },
    mobileSendMsg() {
      if (this.inputData) {
        this.sendWaiterMsg(this.inputData)
        setTimeout(() => {
          this.inputData = ''
          this.rows = 1
          this.lineHeight = ''
        }, 100)
      }
      // 重置message显示框的高度
      this.resetMessageBox()
    },
    chatBack() {
      this.$root.eventBus.$emit('toSession', {
        from: 'chat',
        currentUserOpenId: this.currentUserOpenId
      })
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
      console.log('---------this.waiterInfo---------', this.waiterInfo)
      this.$emit('sendWaiterMsgToUser', obj)
    },
    focus() {
      this.isShowToolBox = false
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
      this.timer = setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight)
      }, 500)
      // 重置message显示框的高度
      // this.resetMessageBox()
      // this.scroll.scrollTo(0, -90)
      this.resetMessageBox()
      console.log('setKeyboardDown')
      this.isShowToolBox = false
      this.reloadMessageScroll()
    },
    currentPlatform() {
      let width = window.document.documentElement.clientWidth
      if (width > 768) {
        this.platForm = 'pc'
        return 'pc'
      } else if (width < 768) {
        this.platForm = 'mobile'
        return 'mobile'
      }
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
                word-break: break-all;
                word-wrap: break-word;
                white-space: pre-wrap;
                overflow: hidden;
              }
              .image {
                width: 256px;
                height: 256px;
                overflow: hidden;
                > img {
                  width: 100%;
                  height: 100%;
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
                text-align: left;
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
      padding: 20px 0;
      border-top: 1px solid #dddddd;
      background: #ffffff;
      .to-input {
        margin: auto;
        background: #fff;
        form {
          .text-input {
            line-height: 40px;
            margin-left: 40px;
            padding: 20px 48px;
            background: #f7f7f7;
            border-radius: 100px;
            font-size: 30px;
            color: #353535;
            outline: none;
            border: none;
          }
          .h5-send {
            font-size: 36px;
            color: #353535;
            letter-spacing: 3.38px;
            text-align: center;
            background: #f9e77f;
            border-radius: 6px;
            width: 120px;
            height: 80px;
            line-height: 80px;
            margin: 0 10px;
          }
          .more-tools {
            width: 70px;
            height: 70px;
            padding-left: 8px;
            > img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .tools-box {
        width: 100%;
        height: 448px;
        .tools-photos {
          width: 110px;
          height: 110px;
          padding: 28px;
          position: relative;
          > img {
            width: 110px;
            height: 110px;
            position: absolute;
          }
          .uploadImg-h5 {
            width: 110px;
            height: 110px;
            position: absolute;
            top: 0;
            left: 0;
            color: transparent;
            opacity: 0;
            z-index: 1;
            > input {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 768px) {
  .chat {
    position: relative;
    border-left: 2px solid #e5e5e5;
    margin-left: 460px;
    .service-header {
      display: none;
    }
    .pc-header {
      width: 100%;
      height: 115px;
      line-height: 115px;
      border-bottom: 2px solid #e5e5ee;
      justify-content: space-between;
      .name {
        font-family: PingFangSC-Medium;
        font-size: 30px;
        color: #353535;
        letter-spacing: 0;
        margin-left: 37px;
      }
      .singOut {
        font-size: 22px;
        color: #000;
        padding: 0 30px;
        font-size: 28px;
        cursor: pointer;
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
              min-width: 200px;
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
              .image {
                width: 256px;
                height: 256px;
                overflow: hidden;
                > img {
                  width: 100%;
                  height: 100%;
                }
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
              left: 24px;
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
              right: 24px;
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
      background: #fff;
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
        height: 223px;
        padding-top: 54px;
        .to-input-tools {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 54px;
          // border: 1px solid red;
          .tools-img {
            width: 40px;
            height: 36px;
            padding-top: 10px;
            padding-left: 18px;
            cursor: pointer;
            > img {
              width: 100%;
              height: 100%;
            }
            .uploadImg {
              position: absolute;
              left: 10px;
              top: 10px;
              width: 40px;
              height: 10px;
              cursor: pointer;
              > input {
                width: 100%;
                height: 100%;
                opacity: 0;
                color: transparent;
              }
            }
          }
          .weixin-public {
            height: 100%;
            cursor: pointer;
            margin-left: 15px;
            .public-off　 {
              border: 1px solid gray;
              display: inline-block;
              padding: 5px 16px;
              margin-left: 10px;
              border-radius: 5px;
              color: gray;
            }
            .public-on　 {
              border: 1px solid green;
              color: green;
              display: inline-block;
              padding: 5px 16px;
              margin-left: 10px;
              border-radius: 5px;
            }
          }
        }
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
