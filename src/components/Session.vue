<template>
  <div class="session">
    <search v-model="searchName" placeholder="请输入昵称"></search>
    <div class="session-wrapper" ref="wrapper">
      <div class="list">
        <div class="item flex-h" v-for="(item,index) in searchSessions" :key="index" v-if="item.isWaiter !== 'yes'" :class="{'active':itemActiveOpenId==item.openId}" @click="sessionItemClick(index, item.openId, item.name, item.whichProgramme, item.remarkId, item.isPush)">
        <!-- <div class="item flex-h" v-for="(item,index) in searchSessions" :key="index" v-if="item.isWaiter !== 'yes'" :class="{'active':itemActiveOpenId==item.openId}" @click="sessionItemClick(index, item.openId)"> -->
          <div class="avatar">
            <img :src="item.headImg" alt="">
            <div class="tag" :hidden="item.hasBeenRead == 1"></div>
          </div>
          <div class="des flex-1 flex-v">
            <div class="title flex-h flex-bc">
              <div class="name flex-h flex-cc">
                <span class="text">{{item.name}}</span>
                <span class="whichProgramme" v-if="item.isPush">VIP</span>
              </div>
              <div class="time">{{item.formatTime}}</div>
            </div>
            <div class="hint">{{item.msg}}</div>
          </div>
        </div>
      </div>
      <div class="search-empty flex-h" v-show="!searchSessions||searchSessions.length===0">
        <div class="search-icon flex-h flex-cc">
          <img src="../assets/img/icon_search.png" alt="">
        </div>
        <div class="des">无匹配用户</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Field, Radio, Button, MessageBox, Indicator } from 'mint-ui'
import ServiceHeader from './ServiceHeader'
import Bscroll from 'better-scroll'
import _ from 'lodash'
import Search from './Search'

export default {
  name: 'session',
  components: {
    ServiceHeader,
    Search
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
      itemActiveOpenId: '',
      searchName: '',
      searchSessions: [1],
      sessions: [],
      isCalculating: false
    }
  },
  created() {
    this.$root.eventBus.$on('toSession', params => {
      if (params.from === 'chat') {
        this.$nextTick(() => {
          // 初始化会话绑定滚动
          this.loadScroll()
        })
      }
    })
    // 获取会话列表
    this.$root.eventBus.$on('userList', userList => {
      console.log('userList', userList)

      // pc 端默认选中第一个用户
      if (this.$root.eventBus.showWidth > 768) {
        this.sessionItemClick(
          0,
          userList[0].openId,
          userList[0].name,
          userList[0].whichProgramme,
          userList[0].remarkId,
          userList[0].isPush
        )
      }
      // 注销事件
      this.$root.eventBus.$off('userList')
    })
  },
  mounted() {
    console.log('this=======>>', this.userList)

    this.$nextTick(() => {
      // 初始化会话绑定滚动
      this.loadScroll()
    })
  },
  methods: {
    /**
     * session列表载入scroll
     */
    loadScroll() {
      this.scroll = new Bscroll(this.$refs.wrapper, {
        mouseWheel: true,
        click: true,
        tap: false
        // preventDefault: false
      })
    },
    /**
     * 列表中item点击
     */
    sessionItemClick(index, openId, name, whichProgramme, remarkId, isPush) {
      if (this.$root.eventBus.showWidth < 768) {
        // 手机
        this.$root.eventBus.$emit('toChat', {
          openId: openId,
          from: 'm-session',
          name: name,
          whichProgramme: whichProgramme,
          remarkId: remarkId,
          isPush: isPush
        })
        console.log('index, openId', index, openId)
      } else {
        // PC
        this.itemActiveIndex = index
        this.itemActiveOpenId = openId
        this.$root.eventBus.$emit('toChat', {
          openId: openId,
          from: 'p-session',
          name: name,
          whichProgramme: whichProgramme
        })
        console.log('index, openId', index, openId)
      }
    },
    doSearchSession: _.debounce(function(val) {
      this.searchSessions = []
      this.sessions.map(item => {
        if (
          item.name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) >= 0
        ) {
          this.searchSessions.push(item)
        }
      })
      if (this.searchName.trim().length === 0) {
        this.searchSessions = this.sessions
      }
    }, 500)
  },
  watch: {
    userList(val, oval) {
      // 保存当前组件列表值
      this.sessions = JSON.parse(JSON.stringify(val || []))
      this.searchSessions = JSON.parse(JSON.stringify(val || []))
    },
    searchName(val, oVal) {
      this.doSearchSession(val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// 手机端
@media (max-width: 768px) {
  .session {
    width: 100%;
    position: relative;
    left: 0;
    bottom: 0;
    right: 0;
    .session-search {
      position: relative;
      height: 110px;
      img {
        position: absolute;
        left: 84px;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 24px;
        height: 24px;
      }
      input {
        height: 72px;
        margin: 0 42px;
        padding-left: 108px;
        font-family: PingFang-SC-Medium;
        font-size: 22px;
        color: #353535;
        letter-spacing: 1.83px;
        background: #f4f4f4;
        border-radius: 100px;
      }
    }
    .session-wrapper {
      position: absolute;
      top: 110px;
      left: 0;
      bottom: 0;
      right: 0;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      .list {
        overflow: auto;
        .item {
          position: relative;
          padding: 30px 0;
          margin: 0 42px;
          border-bottom: 1px solid #e4e4e4;
          .avatar {
            position: relative;
            width: 100px;
            height: 100px;
            background: #eeeeee;
            border-radius: 12px;
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
        }
      }
      .search-empty {
        align-items: center;
        background: #eeeeee;
        height: 118px;
        .search-icon {
          width: 70px;
          height: 70px;
          margin-left: 18px;
          background: #ffe654;
          border-radius: 12px;
          img {
            width: 26px;
            height: 26px;
          }
        }
        .des {
          margin-left: 20px;
          font-family: PingFangSC-Regular;
          font-size: 24px;
          color: #353535;
          letter-spacing: 0;
        }
      }
    }
  }
}

// pc端
@media screen and (min-width: 768px) {
  .session {
    position: relative;
    width: 460px;
    .session-search {
      position: relative;
      height: 116px;
      img {
        position: absolute;
        left: 46px;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 26px;
        height: 26px;
      }
      input {
        height: 60px;
        border: 1px solid #e5e5e5;
        margin: 0 18px;
        padding-left: 70px;
        font-family: PingFang-SC-Medium;
        font-size: 22px;
        color: #353535;
        letter-spacing: 1.83px;
        border-radius: 100px;
      }
    }
    .session-wrapper {
      position: absolute;
      top: 116px;
      left: 0;
      bottom: 0;
      right: 0;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .list {
        overflow: auto;
        .item {
          position: relative;
          padding: 24px;
          border-bottom: 1px solid #e4e4e4;
          // margin: 0 24px;
          // border-bottom: 1px solid #e4e4e4;
          .avatar {
            position: relative;
            width: 70px;
            height: 70px;
            background: #eeeeee;
            border-radius: 12px;
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
        }
        .item.active {
          background: #d2d2d2;
        }
      }
      .search-empty {
        align-items: center;
        background: #eeeeee;
        height: 118px;
        .search-icon {
          width: 70px;
          height: 70px;
          margin-left: 18px;
          background: #ffe654;
          border-radius: 12px;
          img {
            width: 26px;
            height: 26px;
          }
        }
        .des {
          margin-left: 20px;
          font-family: PingFangSC-Regular;
          font-size: 24px;
          color: #353535;
          letter-spacing: 0;
        }
      }
    }
    // max-height: 1200px;
    .service-header {
      display: none;
    }
  }
}
</style>
