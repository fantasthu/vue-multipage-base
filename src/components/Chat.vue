<template>
  <div class="chat flex-1">
    <service-header  @chatBack="chatBack" @showRightMenu="showRightMenu" :back="true" class="service-header" :title='currentChatTitle' :more="more"></service-header>
    <div class="pc-header flex-h">
      <div class="name">{{currentChatTitle}}</div>
      <div class="singOut" @click.stop="singOut">退出</div>
    </div>
    <div class="message" ref="wrapper">
      <ul class="message-list">
        <template v-for="(item,index) in currentUserAllMsg">
          <li class="item item-left flex-h" @click.stop="messageContainerClick" v-if="item.isWaiter !== 'yes'" >
            <div class="avatar"><img :src="item.headImg" alt=""></div>
            <div class="info">
              <div class="time">{{item.formatTime}}</div>
              <div class="content">
                <div class="text" v-if="item.msgType == 'text'" v-html="item.msg">{{item.msg}}</div>
                <div class="image" v-if="item.msgType == 'image'&&screenWidth<768">
                  <img :src="item.msgPicUrl" alt="" @touchstart="fullImgTouchStart" @touchend="fullImgTouchEnd">
                </div>
                <div class="image" v-if="item.msgType == 'image'&&screenWidth>768">
                   <lightbox
                    :id="`${index}`"
                    :images="getLightBoxImgs(item.msgPicUrl)"
                    >
                  </lightbox>
                </div>

              </div>
            </div>
          </li>

          <li class="item item-right flex-h" @click.stop="messageContainerClick" v-if="item.isWaiter == 'yes'" >
            <div class="avatar"><img :src="item.headImg" alt=""></div>
            <div class="info">
              <div class="time">{{item.formatTime}}</div>
              <div class="content">
                <div class="text" v-if="item.msgType == 'text'" v-html="item.msg">{{item.msg}}</div>
                <div class="image" v-if="item.msgType == 'image'&&screenWidth<768">
                  <img :src="item.msgPicUrl" alt="" @touchstart="fullImgTouchStart" @touchend="fullImgTouchEnd">
                </div>
                <div class="image" v-if="item.msgType == 'image'&&screenWidth>768">
                  <lightbox
                    v-if="item.msgType == 'image'"
                    :id="`${index}`"
                    :images="getLightBoxImgs(item.msgPicUrl)"
                    >
                  </lightbox>
                </div>
              </div>
            </div>
          </li>
        </template>

      </ul>
    </div>
    <!-- pc端input -->
    <div class="pc-input-container">
      <div class="to-input flex-h flex-cc">
        <!-- 输入框的工具条 -->
        <div class="to-input-tools flex-h">

           <!-- 表情 -->
          <div class="face">
            <img src="../assets/img/smile.png" alt="" class="face-handle" v-show="!showEmoji" @click="emojiHandleClick">
            <img src="../assets/img/smile-active.png" alt="" class="face-handle-active" v-show="showEmoji" @click="emojiHandleClick">
            <div class="face-container flex-h" v-show="showEmoji">
              <div class="item" v-for="(item,index) in emojis" :key="index" @click="emojiItemClick(index)">
                <img :src="item" alt="">
              </div>
            </div>
          </div>

          <!-- 图片 -->
          <div class="tools-img">
            <img class="upload-img-tag" src="../assets/img/uploadImgIcon.png" alt="">
            <div class="uploadImg">
              <input type="file" id="fle" v-on:change="pcFileSelected">
            </div>
          </div>

         <!-- 是否公众号消息提醒 -->
          <div class="weixin-public flex-h flex-cc" @click.stop="setWaiterIsOnLine"><span :class="{'public-on': !isWaiterOnLine, 'public-off': isWaiterOnLine}">{{isWaiterOnLine?'公众号消息提醒已关闭':'公众号消息提醒已开启'}}</span></div>
        </div>
        <form action="javascrpt:;">
          <textarea contenteditable="true" ref="pcTextArea" id="editor" @keypress="enterHandler" v-model="inputData" type="text" class="text-input" ></textarea>
        </form>
        <div class="enter-hint">按下Enter发送</div>
      </div>
    </div>

    <!-- 手机端input -->
    <div class="input-container">
      <div class="to-input">
        <form action="javascrpt:;" class="flex-h flex-cc">
          <textarea  ref="mobileTextArea" :style="{'lineHeight':lineHeight}" :rows="rows"  type="text" class="text-input flex-1" v-model="inputData" @focus="mobileInputFocus"></textarea>
          <!-- <div contenteditable="true" id='mobileInputDiv'  ref="mobileTextArea" :style="{'lineHeight':lineHeight}" :rows="rows"  type="text" class="text-input mobile-input flex-1" @input="inputData = $event.target.innerText" @focus="focus"></div> -->
          <div class="emoji-handle" @click.stop="emojiMobileHandleClick">
            <img src="../assets/img/emoji-handle.png" class="item" v-show="!mobileEmojiHandled" alt="">
            <img src="../assets/img/emoji-handle-active.png" class="item active" v-show="mobileEmojiHandled" alt="">
          </div>
          <div class="more-tools" @click.stop="showToolBox" v-show="!mobileSendShow"><img src="../assets/img/add-icon.png" alt=""></div>
          <div class="h5-send" @click.stop="mobileSendMsg" v-show="mobileSendShow">发送</div>
        </form>
      </div>
      <div class="tools-box" v-if="isShowToolBox">
        <!-- 表情内容 -->
        <div class="emoji-box" v-show="toolIndex===1">
           <mt-swipe :auto="0">
            <mt-swipe-item>
              <img v-for ="(item,index) in emojis" @click="mobileEmojiItemClick(index)" class="emoji-item" :src="item" alt="">
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <!-- 其他工具 -->
        <div class="tools flex-h" v-show="toolIndex===2">
          <!-- 相册 -->
          <div class="tool flex-v tools-photos">
            <img src="../assets/img/tools-photos.png" alt="">
            <div class="uploadImg-h5">
              <input type="file" id="fleH5" v-on:change="mobileFileSelected">
            </div>
            <div class="tool-des">相册</div>
          </div>
          <!-- 知识库 -->
          <div class="tool flex-v" @click.stop="toKnowledge">
            <img src="../assets/img/knowledge.png" alt="">
            <div class="tool-des">知识库</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 移动端右侧菜单 -->
    <div class="rightMenu" v-show="showMenuStatus" @click.stop="closeRightMenu" @touchmove.stop="preventScroll">
      <div class="rightMenuList" @click.stop=''>
        <div class="rightMenuTitle flex-h flex-cc">当前用户</div>
        <div class="rightMenuUser flex-v flex-cc" @click.stop="toUserInfo">
          <img src="../assets/img/user-head.png" alt="">
          <div class="menuDes">用户信息</div>
        </div>
        <div class="rightMenuUser flex-v flex-cc" @click.stop="toWorkList">
          <img src="../assets/img/user-head.png" alt="">
          <div class="menuDes">用户工单</div>
        </div>
      </div>
    </div>
    <div class="mobileMenu">
      <div class="mobileMenuArea" v-show="showMobileUserinfo&&screenWidth<768">
        <MobileUserinfo :openId="currentUserOpenId" :name="currentUserName" :whichProgramme="currentUserWhichProgramme" :remarkId="remarkId" :isPush="isPush"></MobileUserinfo>
      </div>
      <div class="mobileMenuArea" v-show="showMobileWorkList&&screenWidth<768">
        <MobileWorkList :name="currentUserName" :openId="currentUserOpenId"></MobileWorkList>
      </div>
      <div class="mobileMenuArea" v-show="showMobileKnowledge&&screenWidth<768">
        <MobileKnowledge></MobileKnowledge>
      </div>
    </div>
  </div>
</template>

<script>
import { Header, Button, Swipe, SwipeItem } from 'mint-ui'
import ServiceHeader from './ServiceHeader'
import Bscroll from 'better-scroll'
import { formatTime } from '../service/tools'
import EmojiObj from '../assets/js/mapEmoji.js'
import EmojiMsgObj from '../assets/js/mapEmojiMsg.js'
import VeloEmoji from '../assets/js/mapVeloEmoji.js'
import MobileUserinfo from './mobileUserinfo'
import MobileWorkList from './mobileWorkList'
import MobileKnowledge from './MobileKnowledge'
import api from '../service/api'
import $ from 'jquery'
import Lightbox from 'vue-simple-lightbox'
import textCensorInstance from '../assets/js/textCensor'

export default {
  name: 'chat',
  components: {
    Header,
    Button,
    ServiceHeader,
    Swipe,
    SwipeItem,
    MobileUserinfo,
    Lightbox,
    MobileWorkList,
    MobileKnowledge
  },
  props: {
    showLeftMenu: false
  },
  data() {
    return {
      timerId: null,
      inputData: '',
      back: require('../assets/img/icon_oneway.png'),
      currentUserAllMsg: [],
      currentUserOpenId: '',
      waiterInfo: {},
      currentUserName: '',
      currentChatTitle: '',
      currentUserWhichProgramme: false,
      remarkId: '',
      isPush: 0,
      scroll: null,
      rows: 1,
      lineHeight: '',
      onTextScroll: true,
      client: null,
      isShowToolBox: false,
      platForm: '',
      noRepeat: false,
      emojis: [],
      showEmoji: false,
      mobileEmojiHandled: false,
      // 手机端发送按钮是否显示
      mobileSendShow: false,
      toolIndex: 0,
      isWaiterOnLine: '',
      inputChangeTimer: null,
      showMenuStatus: false,
      showMobileUserinfo: false,
      showMobileWorkList: false,
      showMobileKnowledge: false,
      screenWidth: '',
      more: true
    }
  },
  async created() {
    this.pasteImg()
    let isWaiterOnLine = await api.checkWaiterIsOnLine({})
    this.isWaiterOnLine = isWaiterOnLine.isWaiterOnLine
    this.client = new OSS.Wrapper({
      region: 'oss-cn-beijing',
      accessKeyId: 'LTAIqZNxHpwAnq9r',
      accessKeySecret: '88mdWv9IiQMecrwevspKWyyllIcd0f',
      bucket: 'velo-bucket',
      secure: true
    })
    this.$root.eventBus.$on('toChat', obj => {
      this.reloadMessageScroll()
      this.currentChatTitle = obj.name + '的聊天'
      this.currentUserOpenId = obj.openId
      this.currentUserName = obj.name
      this.currentUserWhichProgramme = obj.whichProgramme === 'vip'
      this.remarkId = obj.remarkId || ''
      this.isPush = obj.isPush
      // this.rows = 1
    })
    this.$root.eventBus.$on('pcChatHandler', () => {
      this.reloadMessageScroll()
    })
    this.$root.eventBus.$on('waiterInfo', waiterInfo => {
      this.waiterInfo = waiterInfo
      if (!this.waiterInfo) {
        this.waiterInfo = this.getWaiter()
      }
      console.log('chat-waiterInfo', this.waiterInfo)
    })
    // 获取用户所以消息
    this.$root.eventBus.$on('userAllMsg', obj => {
      console.log('Chat=>userAllMsg=>接收到所有消息')
      if (obj.userAllMsg[0].openId !== this.currentUserOpenId) return
      this.currentUserAllMsg = obj.userAllMsg.map(item => {
        if (item.msg) {
          item.msg = this.filterMsg(item.msg)
          item.msg = this.textCensor(item.msg)
        }
        return item
      })
      setTimeout(() => {
        this.scroll.scrollTo(0, this.scroll.maxScrollY)
      }, 200)
    })

    // 获取用户每条发送的消息
    this.$root.eventBus.$on('userMsg', arr => {
      if (arr[0].openId !== this.currentUserOpenId) return
      arr[0].formatTime = formatTime(arr[0].msgTime, 6)
      arr[0].headImg = arr[0].headImg
        ? arr[0].headImg
        : 'http://cs.velo.top/customerService/commonAccount/noHeadImg.jpeg'
      // 过滤信息,也许带有表情
      arr[0].msg = this.filterMsg(arr[0].msg)
      arr[0].msg = this.textCensor(arr[0].msg)
      this.currentUserAllMsg.push(arr[0])
      setTimeout(() => {
        this.scroll.scrollTo(0, this.scroll.maxScrollY)
      }, 200)
    })
    this.$root.eventBus.$on('hideMobileMenu', res => {
      console.log(res)

      // 隐藏移动端用户信息
      if (res.from === 'mobileUserinfo') {
        this.showMobileUserinfo = false
      }
      // 隐藏移动端用户工单
      if (res.from === 'workList') {
        this.showMobileWorkList = false
      }
      // 隐藏移动端知识库
      if (res.from === 'knowledge') {
        this.showMobileKnowledge = false
        this.currentChatTitle = this.currentUserName + '的聊天'
        this.more = true
      }
    })
    // 发送知识库答案
    this.$root.eventBus.$on('sendAnswer', answer => {
      let obj = {
        name: this.waiterInfo.name,
        headImg: this.waiterInfo.headImg,
        openId: this.currentUserAllMsg[0].openId,
        msg: answer,
        msgType: 'text',
        isWaiter: 'yes',
        waiterOpenId: this.waiterInfo.openId,
        whichProgramme: this.currentUserAllMsg[0].whichProgramme
      }
      this.$emit('sendWaiterMsgToUser', obj)
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.reloadMessageScroll()

      // 手机端滚动
      this.bindMobileInputNewLine()

      // 添加表情
      this.loadEmojis()

      // 获取屏幕宽度
      this.screenWidth = window.document.documentElement.clientWidth

      // 处理textarea 自适应高度
    })
  },
  methods: {
    getWaiter() {
      const waiterInfo = JSON.parse(localStorage.getItem('waiterInfo') || '{}')
      return waiterInfo
    },
    /**
     * 过滤敏感词汇
     */
    textCensor(str) {
      return textCensorInstance(str) || str
    },
    getLightBoxImgs(img) {
      // console.log('img', img)
      if (/\.(jpg|jpeg|png|bmp)$/.test(img)) {
        return [{ src: `${img}` }]
      } else {
        return [{ src: `${img}.png` }]
      }
    },
    messageContainerClick() {
      if (this.$root.eventBus.showWidth && this.isShowToolBox) {
        this.isShowToolBox = false
        this.mobileEmojiHandled = false
        // 重置消息框
        this.resetMessageBox()
      }
    },
    /**
     * h5点击表情工具
     */
    emojiMobileHandleClick() {
      this.mobileEmojiHandled = !this.mobileEmojiHandled
      this.isShowToolBox = true
      this.toolIndex = 1
      // 重置消息盒子
      this.resetMessageBox()

      // 如果mobileEmojiHandled 为false,触发input的focus时间
      if (!this.mobileEmojiHandled) {
        this.isShowToolBox = false
        // 重置消息盒子
        this.resetMessageBox()
        this.focusMobileInput()
      }
    },
    /**
     * 触发手机端input框focus
     */
    focusMobileInput() {
      this.$refs.mobileTextArea.focus()
    },
    /**
     * 过滤消息中的表情
     */
    filterMsg(msg = '') {
      let newMsg = ''
      const reg = new RegExp(
        "/::\\)|/::~|/::B|/::\\||/:8-\\)|/::<|/::$|/::X|/::Z|/::'\\(|/::-\\||/::@|/::P|/::D|/::O|/::\\(|/::\\+|/:--b|/::Q|/::T|/:,@P|/:,@-D|/::d|/:,@o|/::g|/:\\|-\\)|/::!|/::L|/::>|/::,@|/:,@f|/::-S|/:\\?|/:,@x|/:,@@|/::8|/:,@!|/:!!!|/:xx|/:bye|/:wipe|/:dig|/:handclap|/:&-\\(|/:B-\\)|/:<@|/:@>|/::-O|/:>-\\||/:P-\\(|/::'\\||/:X-\\)|/::\\*|/:@x|/:8\\*|/:pd|/:<W>|/:beer|/:basketb|/:oo|/:coffee|/:eat|/:pig|/:rose|/:fade|/:showlove|/:heart|/:break|/:cake|/:li|/:bome|/:kn|/:footb|/:ladybug|/:shit|/:moon|/:sun|/:gift|/:hug|/:strong|/:weak|/:share|/:v|/:@\\)|/:jj|/:@@|/:bad|/:lvu|/:no|/:ok|/:love|/:<L>|/:jump|/:shake|/:<O>|/:circle|/:kotow|/:turn|/:skip|/:oY|/:#-0|/:hiphot|/:kiss|/:<&|/:&>/|/::\\$|/:\\–b|\\[囧\\]|/::’\\||/::'\\(",
        'g'
      )
      reg.compile(reg)
      newMsg = msg.replace(reg, (p1, p2, matches) => {
        // console.log('p1', p1)
        // console.log('p2', p2)
        // console.log('matches', matches)
        // 过滤相应的图片
        return this.filterCodeToImg(p1)
      })
      return newMsg
    },
    /**
     * 把表情代码过滤成表情图片
     */
    filterCodeToImg(code) {
      // console.log('code', code)
      let emoji = ''
      this.emojiMsgAlias.forEach((item, index) => {
        if (item === code) {
          // console.log('this.emojiAlias', item)
          emoji = this.emojiMsgs[index]
        }
      })
      return `<img class="text-img" src='${emoji}'/>`
    },
    sendVeloEmoji(index) {
      let img = VeloEmoji.alias[index]
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = img
      image.onload = () => {
        const base64Img = this.getBase64Image(image)
        console.log(base64Img)
        this.uploadImgToUser(
          base64Img.dataURL,
          this.currentUserAllMsg[0].openId,
          img
        )
      }
    },
    /**
     * 每个表情的点击事件
     */
    emojiItemClick(index) {
      // 发送图片表情
      this.sendVeloEmoji(index)
      this.showEmoji = false
      setTimeout(() => {
        this.scroll.scrollTo(0, this.scroll.maxScrollY)
      }, 500)
    },
    /**
     * 手机端每个表情的点击事件
     */
    mobileEmojiItemClick(index) {
      // append数据到textarea中
      this.sendVeloEmoji(index)
      this.isShowToolBox = false
      this.mobileEmojiHandled = false
      this.resetMessageBox()
    },
    loadEmojis() {
      this.emojis = VeloEmoji.imgs
      this.emojiAlias = EmojiObj.alias
      // 可以接收的表情
      this.emojiMsgs = EmojiMsgObj.imgs
      this.emojiMsgAlias = EmojiMsgObj.alias
    },
    emojiHandleClick() {
      // this.filterMsg('阿斯顿撒旦法/::)/::~121我萨达')
      this.showEmoji = !this.showEmoji

      // 定位emoji的位置
      this.locationEmoji()
    },
    /**
     * 定位emoji的位置
     */
    locationEmoji() {
      this.$nextTick(() => {
        const faceContainer = document.querySelector('.face-container')
        const height = faceContainer.offsetHeight
        console.log('height', height)
        faceContainer.style.top = `-${height + 5}px`
      })
    },
    bindMobileInputNewLine() {
      const that = this
      this.$refs.mobileTextArea.onscroll = e => {
        console.log('this.inputData', this.inputData)
        console.log('this.mobileSendShow', this.mobileSendShow)
        if (that.onTextScroll && this.inputData && this.inputData.length > 0) {
          that.mobileInputChange()
          that.onTextScroll = false
        }
      }
    },
    // 无法粘贴文字, 粘贴动作的时候如果是文字就将内容赋值给inputData
    pasteImg() {
      document.addEventListener('paste', event => {
        if (this.$root.eventBus.showWidth < 768) return
        if (event.clipboardData || event.originalEvent) {
          var clipboardData =
            event.clipboardData || event.originalEvent.clipboardData
          if (clipboardData.getData('text/plain')) {
            return
          }
          if (clipboardData.items) {
            var items = clipboardData.items
            var len = items.length
            var blob = null
            console.log('len', len)
            console.log('items', items)
            event.preventDefault()
            for (var i = 0; i < len; i++) {
              console.log(items[i])
              if (items[i].type.indexOf('image') !== -1) {
                blob = items[i].getAsFile()
              }
            }
            if (blob !== null) {
              var reader = new FileReader()
              reader.onload = event => {
                // event.target.result 即为图片的Base64编码字符串
                var base64Str = event.target.result
                this.pcSendImgPaste(base64Str, blob)
              }
              reader.readAsDataURL(blob)
            }
          }
        }
      })
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
        }
        setTimeout(() => {
          this.resetMessageBox()
        }, 1500)
        this.isShowToolBox = false
      }
    },
    showToolBox() {
      this.isShowToolBox = true
      this.toolIndex = 2
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
      clearTimeout(this.timer)
      this.$nextTick(() => {
        this.scroll = null
        if (this.getScreenWidth() > 768) {
          this.scroll = new Bscroll(this.$refs.wrapper, {
            mouseWheel: true,
            click: true,
            tap: true,
            preventDefault: false
          })
        } else {
          this.scroll = new Bscroll(this.$refs.wrapper, {
            mouseWheel: true,
            click: true,
            tap: true,
            preventDefault: true,
            preventDefaultException: { className: /(^|\s)text(\s|$)/ }
          })
        }

        clearTimeout(this.timer)
        console.log('scroll', scroll)
      })
    },
    mobileInputChange() {
      this.lineHeight = '1.6'
      this.rows += 1
      console.log('this.rows', this.rows)
      if (this.rows > 3) {
        return false
      }
      this.inputChangeTimer = null
      this.inputChangeTimer = setTimeout(() => {
        this.onTextScroll = true
      }, 500)
    },
    /**
     * pc 端提交消息
     */
    enterHandler(event) {
      const keyCode = event.keyCode
        ? event.keyCode
        : event.which ? event.which : event.charCode
      if (keyCode === 13) {
        // console.log('waiterInfo', this.waiterInfo)
        if (this.inputData) {
          this.pcSendMsg()
        }
        setTimeout(() => {
          this.inputData = ''
        }, 100)
      }
    },
    /**
     *  pc端发送文本消息
     */
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
      const tc = this.textCensor(this.inputData || '')
      if (tc && tc.trim().indexOf('***') >= 0) {
        this.$message('发送的消息不合法!')
        return
      }
      this.$emit('sendWaiterMsgToUser', obj)
    },
    /**
     * pc端发送图片消息
     */
    pcSendImg(file) {
      var reader = new FileReader()
      var AllowImgFileSize = 2100000
      reader.readAsDataURL(file)
      this.$toast('图片发送中...')
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
    async pcSendImgPaste(base64Img, blob) {
      var reader = new FileReader()
      var AllowImgFileSize = 2100000
      reader.readAsDataURL(blob)
      this.$toast('图片发送中...')
      reader.onload = async e => {
        if (AllowImgFileSize !== 0 && AllowImgFileSize < reader.result.length) {
          this.$toast('图片超过2M, 上传失败!')
          return
        }
        let ossUrl = await this.uploadImgToOSS(blob)
        this.uploadImgToUser(
          base64Img,
          this.currentUserAllMsg[0].openId,
          ossUrl
        )
        $('#fleH5').val('')
      }
    },
    getBase64Image(img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      var dataURL = canvas.toDataURL('image/' + ext)
      return {
        dataURL: dataURL,
        type: 'image/' + ext
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
        // 处理 不合法字符
        const tc = this.textCensor(this.inputData || '')
        if (tc && tc.trim().indexOf('***') >= 0) {
          this.$toast('发送的消息不合法!')
          return
        }
        // 发送客服消息
        this.sendWaiterMsg(this.inputData)

        setTimeout(() => {
          this.$refs.mobileTextArea.innerHTML = ''
          this.inputData = ''
          this.lineHeight = '1'
          this.rows = 1

          // 重置message显示框的高度
          this.resetMessageBox()
        }, 100)

        // 发送之后键盘不弹下去
        this.$refs.mobileTextArea.focus()
      }
    },
    chatBack() {
      // 返回列表时隐藏右侧菜单
      this.showMenuStatus = false
      this.showMobileUserinfo = false
      this.showMobileWorkList = false
      this.showMobileKnowledge = false
      this.isShowToolBox = false
      this.toolIndex = 0
      // 重置message显示框的高度
      // this.resetMessageBox()
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
    mobileInputFocus(e) {
      this.isShowToolBox = false
      this.mobileEmojiHandled = false
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

      // 重置message显示框的高度
      setTimeout(() => {
        this.resetMessageBox()
      }, 500)
      this.isShowToolBox = false
    },
    getScreenWidth() {
      return window.document.documentElement.clientWidth
    },
    currentPlatform() {
      let width = this.getScreenWidth()
      if (width > 768) {
        this.platForm = 'pc'
        return 'pc'
      } else if (width < 768) {
        this.platForm = 'mobile'
        return 'mobile'
      }
    },
    /**
     * 显示右侧菜单
     */
    showRightMenu() {
      this.showMenuStatus = true
      // 隐藏底部工具
      // this.isShowToolBox = false
      // this.resetMessageBox()
      console.log('chat-page =>showRightMenu =>显示右侧菜单')
    },
    /**
     * 关闭右侧菜单
     */
    closeRightMenu() {
      this.showMenuStatus = false
    },
    /**
     * 打开移动端用户信息
     */
    toUserInfo() {
      this.showMobileUserinfo = true
      this.$root.eventBus.$emit('getOrderList')
    },
    /**
     * 打开移动端工单
     */
    toWorkList() {
      this.showMobileWorkList = true
      this.$root.eventBus.$emit('getMobileWorkList')
    },
    toKnowledge() {
      this.showMobileKnowledge = true
      this.currentChatTitle = '知识库'
      this.more = false
      this.$root.eventBus.$emit('getMobileKnowledgeList')
    },
    /**
     * 图片touchstart
     */
    fullImgTouchStart(e) {
      this.timeStamp = e.timeStamp
    },
    /**
     * 图片touchend
     */
    fullImgTouchEnd(e) {
      if (e.timeStamp - this.timeStamp < 100) {
        this.showMsgPic(e.target.src)
      }
    },
    /**
     * 遮罩层显示时，阻止底部页面滚动
     */
    preventScroll(e) {
      e.preventDefault()
    }
  },
  watch: {
    inputData: function(val, oldVal) {
      console.log('val', val)
      if (val && val.trim().length > 0) {
        this.mobileSendShow = true
      } else if (val.trim().length === 0) {
        this.mobileSendShow = false
        this.rows = 1
        this.onTextScroll = true
      }
    },
    /**
     * 页面宽度变成pc时，隐藏手机端右侧菜单
     */
    showLeftMenu: function(val, oldVal) {
      console.log(val, oldVal)
      if (val) {
        this.showMenuStatus = false
        this.showMobileUserinfo = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
// lightbox 的样式
.my-gallery {
  a {
    img {
      width: 100%;
      border: none;
    }
  }
}
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
                .text-img {
                  width: 40px;
                  height: 40px;
                }
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
          .mobile-input {
            max-height: 200px;
            word-break: break-all;
            overflow: scroll;
          }
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
            margin-right: 16px;
          }
          .more-tools {
            width: 70px;
            height: 70px;
            margin-left: 8px;
            margin-right: 16px;
            > img {
              width: 100%;
              height: 100%;
            }
          }
          .emoji-handle {
            .item {
              width: 70px;
              height: 70px;
              margin: 0 16px;
            }
          }
        }
      }
      .tools-box {
        width: 100%;
        height: 448px;
        // 表情内容
        .emoji-box {
          width: 100%;
          height: 100%;
          .emoji-item {
            width: 73px;
            height: 73px;
            padding: 10px 10px;
          }
        }
        .tools {
          flex-wrap: wrap;
          .tool {
            padding: 42px 28px 28px;
            box-sizing: content-box;
            position: relative;
            img {
              width: 110px;
              height: 110px;
              // position: absolute;
            }
            .tool-des {
              margin-top: 18px;
              text-align: center;
              font-size: 24px;
              color: #b2b2b2;
              letter-spacing: 2.4px;
            }
          }
          .tools-photos {
            padding-left: 72px;
          }
          // 打开相册
          .uploadImg-h5 {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
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
    .rightMenu {
      background: rgba(0, 0, 0, 0.25);
      position: fixed;
      // z-index: 9999;
      top: 88px;
      left: 0;
      bottom: 0;
      right: 0;
      .rightMenuList {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 190px;
        background: #fff;
        .rightMenuTitle {
          height: 88px;
          background: #f4f4f4;
          font-size: 28px;
          color: #353535;
          letter-spacing: 3px;
        }
        .rightMenuUser {
          margin: 52px auto 0;
          // border: 2px solid #dddddd;
          // border-radius: 16px;
          img {
            width: 110px;
            height: 110px;
          }
          .menuDes {
            font-size: 24px;
            color: #b2b2b2;
            letter-spacing: 2.4px;
            text-align: center;
            margin-top: 18px;
          }
        }
      }
    }
    .mobileMenuArea {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
    }
  }
}

// pc 端
@media screen and (min-width: 768px) {
  .mobileMenu {
    display: none;
  }
  .chat {
    position: relative;
    min-width: 500px;
    border-left: 2px solid #e5e5e5;
    // margin-left: 460px;
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
      bottom: 295px;
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
                .text-img {
                  width: 40px;
                  height: 40px;
                }
              }
              .image {
                width: 256px;
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
          align-items: center;
          // border: 1px solid red;
          .tools-img {
            position: relative;
            width: 40px;
            height: 36px;
            margin-left: 24px;
            cursor: pointer;
            .upload-img-tag {
              width: 100%;
              height: 100%;
            }
            .uploadImg {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              cursor: pointer;
              > input {
                display: block;
                width: 100%;
                height: 100%;
                opacity: 0;
                color: transparent;
              }
            }
          }
          .face {
            position: relative;
            width: 40px;
            height: 40px;
            margin-left: 24px;
            .face-handle,
            .face-handle-active {
              width: 100%;
              height: 100%;
            }
            .face-container {
              position: absolute;
              top: -40px;
              width: 288px;
              background: rgba(0, 0, 0, 0.7);
              border-radius: 6px 4px;
              flex-wrap: wrap;
              .item {
                padding: 4px;
                img {
                  width: 40px;
                  height: 40px;
                }
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
