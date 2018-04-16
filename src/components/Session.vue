<template>
  <div class="session">
    <!-- <service-header class="service-header" title="客服会话管理"></service-header> -->
    <div class="list" ref="session-list">
      <div class="item flex-h" v-for="(item,index) in userList" :key="index" v-if="item.isWaiter !== 'yes'" :class="{'active':itemActiveIndex==index}" @click="sessionItemClick(index, item.openId)">
        <div class="avatar">
          <img :src="item.headImg" alt="">
          <div class="tag" :hidden="item.hasBeenRead == 1"></div>
        </div>
        <div class="des flex-1 flex-v">
          <div class="title flex-h flex-bc">
            <div class="name flex-h flex-cc">
              <span class="text">{{item.name}}</span>
              <span class="whichProgramme">{{item.whichProgramme}}</span>
            </div>
            <div class="time">{{item.formatTime}}</div>
          </div>
          <div class="hint">{{item.msg}}</div>
        </div>
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Field, Radio, Button, MessageBox, Indicator } from 'mint-ui'
import ServiceHeader from './ServiceHeader'
export default {
  name: 'session',
  components: {
    ServiceHeader
  },
  props: {
    userList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      back: require('../assets/img/icon_oneway.png'),
      items: null,
      itemActiveIndex: 0,
      waiterInfo: {}
    }
  },
  created() {
    this.$root.eventBus.$on('waiterInfo', waiterInfo => {
      this.waiterInfo = waiterInfo
      console.log('session-waiterInfo', this.waiterInfo)
    })
  },
  mounted() {
    this.$nextTick(() => {
      document.querySelector('.list .item')
    })
  },
  methods: {
    sessionItemClick(index, openId) {
      if (this.$root.eventBus.showWidth < 768) {
        // 手机
        this.$root.eventBus.$emit('toChat', { openId: openId })
        console.log('index, openId', index, openId)
      } else {
        // PC
        this.itemActiveIndex = index
        console.log('index, openId', index, openId)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@media (max-width: 768px) {
  .session {
    width: 100%;
    .list {
      // margin-top: 88px;
      .item {
        position: relative;
        padding: 30px 42px;
        .avatar {
          position: relative;
          img {
            width: 100px;
            height: 100px;
            border-radius: 12px;
          }
          .tag {
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(50%, -50%);
            width: 20px;
            height: 20px;
            border-radius: 16px;
            background: #ff5b21;
          }
        }
        .des {
          max-width: 529px;
          margin-left: 36px;
          font-size: 18px;
          justify-content: space-between;
          .title {
            .name {
              font-size: 36px;
              color: #353535;

              .text {
                display: block;
                max-width: 220px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                -webkit-line-clamp: 1;
              }
              .whichProgramme {
                margin-left: 10px;
                background: #ffe654;
                color: #000;
                border-radius: 6px;
                font-size: 14px;
                display: inline-block;
                padding: 2px 6px;
                font-size: 22px;
                color: #353535;
                letter-spacing: 3px;
                text-align: center;
              }
            }
            .time {
              color: #b2b2b2;
              font-size: 22px;
            }
          }
          .hint {
            font-size: 26px;
            color: #b2b2b2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            -webkit-line-clamp: 1;
            margin-top: 4px;
          }
        }
        .line {
          position: absolute;
          left: 42px;
          right: 42px;
          bottom: 0;
          height: 1px;
          background: #e4e4e4;
        }
      }
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 1650px) {
  .session {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 460px;
    max-height: 1200px;
    .service-header {
      display: none;
    }
    .list {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      overflow-y: auto;
      .item {
        position: relative;
        padding: 24px;
        .avatar {
          position: relative;
          img {
            width: 70px;
            height: 70px;
            border-radius: 12px;
          }
          .tag {
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(50%, -50%);
            width: 20px;
            height: 20px;
            border-radius: 16px;
            background: #ff5b21;
          }
        }
        .des {
          width: 320px;
          margin-left: 20px;
          font-size: 18px;
          justify-content: space-between;
          .title {
            .name {
              font-family: PingFangSC-Regular;
              color: #353535;
              letter-spacing: 0;
              .text {
                font-size: 20px;
                max-width: 110px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                -webkit-line-clamp: 1;
              }
              .whichProgramme {
                margin-left: 10px;
                font-family: CoreSansA65Bold;
                font-size: 17px;
                color: #353535;
                letter-spacing: 0.94px;
                text-align: center;
                padding: 2px 4px;
                background: #ffe654;
              }
            }
            .time {
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #b2b2b2;
              text-align: right;
            }
          }
          .hint {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #b2b2b2;
            letter-spacing: 2.77px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            -webkit-line-clamp: 1;
            margin-top: 4px;
          }
        }
        .line {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          transform: scaleY(0.5);
          background: #e5e5e5;
        }
      }
      .item.active {
        background: #d2d2d2;
      }
    }
  }
}
</style>
