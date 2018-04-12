<template>
  <div class="chat flex-1">
    <service-header :back="true" @chatBack="chatBack" class="service-header" title='某某某的聊天'></service-header>
    <div class="pc-header">
      <div class="name">女神逗</div>
    </div>
    <div class="message">
      <!-- <div class="message-latest-time">
        2013/12/12 12:12
      </div> -->
      <div class="message-list">
        <div class="item item-left flex-h">
          <div class="avatar"><img src="http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60" alt=""></div>
          <div class="info">
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
        <div class="item item-left flex-h">
          <div class="avatar"><img src="http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60" alt=""></div>
          <div class="info">
            <div class="text">
              我发了一堆的消息在你这里
            </div>
          </div>
        </div>
        <div class="item item-right flex-h">
          <div class="avatar"><img src="http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60" alt=""></div>
          <div class="info">
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
        <div class="item item-right flex-h">
          <div class="avatar"><img src="http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60" alt=""></div>
          <div class="info">
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
        <div class="item item-right flex-h">
          <div class="avatar"><img src="http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60" alt=""></div>
          <div class="info">
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
        <div class="item item-right flex-h">
          <div class="avatar"><img src="http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60" alt=""></div>
          <div class="info">
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
      </div>
    </div>
    <div class="pc-input-container">
      <div class="to-input flex-h flex-cc">
        <form action="javascrpt:;">
          <textarea type="text" class="text-input" ></textarea>
        </form>
        <div class="enter-hint">按下Enter发送</div>
      </div>
    </div>
    <div class="input-container">
      <div class="to-input flex-h flex-cc">
        <form action="javascrpt:;">
          <input type="text" class="text-input" >
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Header, Button } from 'mint-ui'
import ServiceHeader from './ServiceHeader'
export default {
  name: 'chat',
  components: { Header, Button, ServiceHeader },
  props: [''],
  data() {
    return {
      back: require('../assets/img/icon_oneway.png')
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      document.querySelector('form').addEventListener('submit', () => {
        alert(1)
      })
    })
  },
  methods: {
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
      width: 100%;
      margin-top: 118px;
      margin-bottom: 130px;
      .message-list {
        background: #fff;
        .item {
          padding: 10px 20px;
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
            .text {
              font-size: 28px;
              letter-spacing: 3px;
              line-height: 42px;
              padding: 19px 36px;
              word-break: break-all;
            }
          }
        }
        .item-left {
          .info {
            background: #f4f4f4;
            margin-left: 24px;
            .text {
              color: #353535;
            }
          }
        }
        .item-right {
          flex-direction: row-reverse;
          text-align: right;
          .info {
            background: #f9e77f;
            margin-right: 24px;
            .text {
              color: #000;
            }
          }
        }
      }
    }
    .pc-input-container {
      display: none;
    }
    .input-container {
      position: fixed;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      box-shadow: 0 -1px 0 0 #dddddd;
      .to-input {
        height: 120px;
        background: #fff;

        .text-input {
          height: 80px;
          width: 670px;
          background: #f7f7f7;
          border-radius: 100px;
          font-size: 30px;
          color: #353535;
          padding-left: 48px;
        }
      }
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 1650px) {
  .chat {
    position: relative;
    border-left: 2px solid #e5e5e5;
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
      top: 135px;
      overflow-y: auto;
      .message-list {
        background: #fff;
        max-height: 815px;
        .item {
          margin: 18px 0;
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
        .item-left {
          .avatar {
            margin-left: 36px;
          }
          .info {
            background: #f4f4f4;
            margin-left: 24px;
            margin-right: 124px;
            .text {
              color: #353535;
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
            .text {
              color: #000;
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
