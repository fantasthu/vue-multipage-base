<template>
  <div class="session">
    <service-header class="service-header" title="客服会话管理"></service-header>
    <div class="list" ref="session-list">
      <div class="item flex-h" v-for="(item,index) in sessions" :class="{'active':itemActiveIndex==index}" @click="sessionItemClick(index)">
        <div class="avatar">
          <img src="" alt="">
          <div class="tag">
          </div>
        </div>
        <div class="des flex-v">
          <div class="title flex-h flex-bc">
            <div class="name">蓝汛</div>
            <div class="time">2012/12/12 23:23</div>
          </div>
          <div class="hint">
            这是一个夏天风雨那么餐面1sdasdasdfadsfasadfasd
          </div>
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
  props: [''],
  data() {
    return {
      back: require('../assets/img/icon_oneway.png'),
      items: null,
      itemActiveIndex: 0,
      sessions: [
        {
          imgUrl:
            'http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60',
          name: 'hwz',
          time: '2302/22/23 23:23',
          hint: '这是一个夏天风雨那么餐面1sdasdasdfadsfasadfasd'
        },
        {
          imgUrl:
            'http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60',
          name: 'hwz',
          time: '2302/22/23 23:23',
          hint: '这是一个夏天风雨那么餐面1sdasdasdfadsfasadfasd'
        },
        {
          imgUrl:
            'http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60',
          name: 'hwz',
          time: '2302/22/23 23:23',
          hint: '这是一个夏天风雨那么餐面1sdasdasdfadsfasadfasd'
        },
        {
          imgUrl:
            'http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60',
          name: 'hwz',
          time: '2302/22/23 23:23',
          hint: '这是一个夏天风雨那么餐面1sdasdasdfadsfasadfasd'
        },
        {
          imgUrl:
            'http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60',
          name: 'hwz',
          time: '2302/22/23 23:23',
          hint: '这是一个夏天风雨那么餐面1sdasdasdfadsfasadfasd'
        },
        {
          imgUrl:
            'http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60',
          name: 'hwz',
          time: '2302/22/23 23:23',
          hint: '这是一个夏天风雨那么餐面1sdasdasdfadsfasadfasd'
        },
        {
          imgUrl:
            'http://velo-bucket.oss-cn-beijing.aliyuncs.com/applet/avatar_l.png?x-oss-process=image/resize,m_lfit,h_60,w_60',
          name: 'hwz',
          time: '2302/22/23 23:23',
          hint: '这是一个夏天风雨那么餐面1sdasdasdfadsfasadfasd'
        }
      ]
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      document.querySelector('.list .item')
    })
  },
  methods: {
    sessionItemClick(index) {
      if (this.$root.eventBus.showWidth < 768) {
        this.$root.eventBus.$emit('toChat', index)
      } else {
        this.itemActiveIndex = index
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
      margin-top: 88px;
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
    width: 440px;
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
        padding: 18px 24px;
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
              font-size: 24px;
              color: #353535;
              letter-spacing: 0;
            }
            .time {
              font-family: PingFangSC-Regular;
              font-size: 20px;
              color: #b2b2b2;
              text-align: right;
            }
          }
          .hint {
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: #b2b2b2;
            letter-spacing: 2.77px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            -webkit-line-clamp: 1;
          }
        }
        .line {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
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
