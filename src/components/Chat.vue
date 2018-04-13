<template>
  <div class="chat flex-1">
    <service-header  @chatBack="chatBack" :back="true" class="service-header" title='某某某的聊天'></service-header>
    <div class="pc-header">
      <div class="name">女神逗</div>
    </div>
    <div class="message" ref="wrapper">
      <!-- <div class="message-latest-time">
        2013/12/12 12:12
      </div> -->
      <ul class="message-list">
        <li class="item item-left flex-h">
          <div class="avatar"><img src="http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60" alt=""></div>
          <div class="info">
            <div class="time">2302/22/23 12:12</div>
            <div class="content">
              <div class="text">
                我发了一堆的消息在你这里,你喜欢么adfasdfasdasdfasd
                fasdfasfdasdfadfasf
                asdfasdfa
                afasdfasdf
                asdfasdfas
                dfasdfasdf
                asdfasdfasdf
                asdfasdfa
                asdfad
              </div>
            </div>
          </div>
        </li>
        <li class="item item-left flex-h">
          <div class="avatar"><img src="http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60" alt=""></div>
          <div class="info">
            <div class="time"></div>
            <div class="content">
              <div class="text">
                我发了一堆的消息在你这里,你喜欢么adfasdfasdasdfasd
                fasdfasfdasdfadfasf
                asdfasdfa
                afasdfasdf
                asdfasdfas
                dfasdfasdf
                asdfasdfasdf
                asdfasdfa
                asdfad
              </div>
            </div>
          </div>
        </li>
        <li class="item item-right flex-h">
          <div class="avatar"><img src="http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60" alt=""></div>
          <div class="info">
            <div class="time"></div>
            <div class="content">
              <p class="text">
                我发了一堆的消息在你这里,你喜欢么adfasdfasdasdfasdfasdfasfdasdfadfasfasdfasdfa
                asdfasdfaasdfasdfasdfasdfasdfasdf
                afasdfasdf
                asdfasdfas
                dfasdfasdf
                asdfasdfasdf
                asdfasdfa
                asdfad
              </p>
            </div>
          </div>
        </li>
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
          <input type="text" class="text-input" v-model="inputData">
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Header, Button } from 'mint-ui'
import ServiceHeader from './ServiceHeader'
import Bscroll from 'better-scroll'
// import $ from 'jquery'
export default {
  name: 'chat',
  components: { Header, Button, ServiceHeader },
  props: [''],
  data() {
    return {
      timerId: null,
      inputData: '',
      timer: null
    }
  },
  created() {
    this.$root.eventBus.$on('toChat', () => {
      this.reloadMessageScroll()
    })
    this.$root.eventBus.$on('pcChatHandler', () => {
      this.reloadMessageScroll()
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.reloadMessageScroll()
      document
        .querySelector('.input-container form')
        .addEventListener('submit', () => {
          // h5端提交信息
          alert(this.inputData)
        })
    })
  },
  methods: {
    reloadMessageScroll() {
      this.timer = null
      this.timer = setTimeout(() => {
        const scroll = new Bscroll(this.$refs.wrapper, {
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
      this.$root.eventBus.$emit('toChat', { from: 'chat' })
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
            }
            .content {
              .text {
                font-size: 28px;
                letter-spacing: 3px;
                line-height: 42px;
                padding: 19px 36px;
                word-break: break-all;
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
