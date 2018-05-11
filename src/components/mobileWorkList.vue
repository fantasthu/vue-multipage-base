<template>
<div>
  <div id="right-work-list-wrap">
    <service-header  @chatBack="chatBack" :back="true" class="service-header" :title='pageTitle' :more="false"></service-header>
    <div class="create-work flex-h flex-cc" @click.stop="toCreateWorkList"><img src="../assets/img/add.png" alt="">新建工单</div>
    
    <div ref="workWrapper" class="wrapper">
      <div v-show="workList.length>0">
        <div style="padding-bottom:40px;">
          <div class="work-list flex-h" v-for="item,index in workList" @click.stop="toEditWork(item,index)">
            <div class="left-dot"></div>
            <div class="right-wrap flex-1 flex-v">
              <div class="content">{{item.des}}</div>
              <div class="time">{{item.createtime}}</div>
              <div class="flex-h btns-wrap">
                <div class="flex-h">
                  <div class="unsolved tag" v-if="item.status==='未解决'">未解决</div>
                  <div class="solved tag" v-if="item.status==='已解决'">已解决</div>
                  <div class="suggest tag flex-h flex-cc" v-if="item.ordertype==='建议'"><img src="../assets/img/face-happy.png" alt="">建议</div>
                  <div class="suggest tag flex-h flex-cc" v-if="item.ordertype==='客诉'"><img src="../assets/img/face-sad.png" alt="">客诉</div>
                </div>
                <div class="btns-hide">
                  <img src="../assets/img/edit.png" alt="" class="edit" @click.stop="toEditWork(item,index)">
                  <img src="../assets/img/delete-icon.png" alt="" class="delete" @click.stop="deleteWork(item.id,index)">
                </div>
              </div>
            </div>
          </div>
          <div class="nomore" v-show="over">没有更多工单了</div>
        </div>
      </div>
      <div class="noList" v-show="workList.length==0">无工单</div>
    </div>
  </div>
  <editWorkList v-show="showEditWorkList" :name="name" :needTop='needTop' :openId='openId'></editWorkList>
</div>
</template>

<script>
import Bscroll from 'better-scroll'
import axios from 'axios'
import ServiceHeader from './ServiceHeader'
import editWorkList from './EditWorkList'

export default {
  name: 'mobileWorkList',
  components: { ServiceHeader, editWorkList },
  props: {
    name: {
      type: String,
      default: ''
    },
    openId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      page: 1,
      preventRepeat: true,
      over: false,
      workList: [],
      pageTitle: '用户工单',
      showEditWorkList: false,
      needTop: false,
      pageSize: 10,
      hideHead: true
    }
  },
  created() {
    /**
     * 隐藏工单详情
     */
    this.$root.eventBus.$on('hideEditWorkList', refresh => {
      this.showEditWorkList = false
      if (refresh) {
        // 刷新页面
        this.refreshData()
      }
    })
    this.$root.eventBus.$on('getMobileWorkList', () => {
      // 获取工单列表
      this.initBScroll()
      this.refreshData()
    })
  },
  mounted() {
    this.$nextTick(() => {})
  },
  methods: {
    /**
     * 刷新页面
     */
    refreshData() {
      this.page = 1
      this.workList = []
      this.over = false
      this.getWorkList()
    },
    /**
     * 新建工单
     */
    toCreateWorkList() {
      // 移动端
      if (this.$root.eventBus.showWidth < 768) {
        this.showEditWorkList = true
        this.pageTitle = '编辑工单'
        this.$root.eventBus.$emit('updateWorkList')
      }
    },
    /**
     * 修改工单
     */
    toEditWork(item, index) {
      if (this.$root.eventBus.showWidth < 768) {
        this.showEditWorkList = true
        this.pageTitle = '编辑工单'
        this.$root.eventBus.$emit('updateWorkList', item, index)
      }
    },
    /**
     * 移动端返回
     */
    chatBack() {
      if (this.showEditWorkList) {
        this.showEditWorkList = false
        this.pageTitle = '用户工单'
      } else {
        this.showEditWorkList = false
        this.$root.eventBus.$emit('hideMobileMenu', { from: 'workList' })
      }
    },
    /**
     * 获取工单列表
     */
    getWorkList() {
      if (this.over) {
        return
      }
      axios
        .post('http://cs.velo.top/customerService/csapi/searchWorkOrder', {
          pageSize: this.pageSize,
          startPage: this.page,
          openid: this.openId
        })
        .then(res => {
          if (res.data.status === 0) {
            if (res.data.data.list.length === 0) {
              this.over = true
              this.scroll.refresh()
              return false
            }
            this.workList = this.workList.concat(res.data.data.list)
            if (res.data.data.total <= this.page * this.pageSize) {
              this.over = true
            }

            this.page++
          } else {
            this.$toast(res.data.message)
          }
          this.scroll.refresh()
          console.log('this.workList', this.workList)
        })
        .catch(() => {
          this.$toast('网络错误')
        })
    },
    /**
     * 删除工单
     */
    deleteWork(id, index) {
      axios
        .post('http://cs.velo.top/customerService/csapi/delWorkOrder', {
          id
        })
        .then(res => {
          if (res.data.status === 0) {
            this.workList.splice(index, 1)
            this.$toast('删除成功')
          } else {
            this.$toast(res.data.message)
          }
        })
        .catch(() => {
          this.$toast('网络错误')
        })
    },
    /**
     * 初始化BS
     */
    initBScroll() {
      this.scroll = new Bscroll(this.$refs.workWrapper, {
        mouseWheel: true,
        click: true,
        tap: true,
        preventDefault: true,
        preventDefaultException: { className: /(^|\s)content(\s|$)/ },
        pullUpLoad: {
          threshold: 100
        }
      })

      this.scroll.on('scrollStart', res => {
        this.$nextTick(function() {
          this.startY = this.scroll.y
          console.log('开始滚动', this.scroll.y)
        })
      })
      this.scroll.on('scroll', res => {
        this.$nextTick(function() {
          if (
            res.y - this.scroll.maxScrollY < 100 &&
            res.y < this.startY - 50 &&
            this.preventRepeat &&
            !this.over
          ) {
            this.preventRepeat = false
            this.getWorkList()

            setTimeout(() => {
              this.preventRepeat = true
            }, 500)
          }
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
img {
  vertical-align: middle;
}
// 手机端
@media (max-width: 768px) {
  #right-work-list-wrap {
    position: absolute;
    top: 88px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    box-sizing: border-box;
    .create-work {
      height: 72px;
      margin: 20px 42px 0;
      font-size: 24px;
      color: #353535;
      letter-spacing: 3px;
      border: 1px solid #b2b2b2;
      border-radius: 100px;
      img {
        width: 22px;
        height: 22px;
        margin-right: 6px;
      }
    }
    .wrapper {
      position: absolute;
      top: 120px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
    }
    .work-list {
      padding-bottom: 36px;
      margin: 36px 42px 0;
      border-bottom: 2px solid #e5e5e5;
      .left-dot {
        width: 12px;
        height: 12px;
        background: #353535;
        margin-right: 30px;
        margin-top: 18px;
      }
      .right-wrap {
        .content {
          color: #353535;
          line-height: 48px;
          font-size: 28px;
          letter-spacing: 2px;
          text-align: justify;
        }
        .time {
          font-size: 24px;
          color: #bbb;
          letter-spacing: 0;
          margin-top: 18px;
        }
        .btns-wrap {
          margin-top: 18px;
          justify-content: space-between;
          .tag {
            border-radius: 100px;
            width: 104px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-size: 20px;
            letter-spacing: 2.5px;
          }
          .unsolved {
            color: #ffffff;
            background: #ff7e5a;
          }
          .solved {
            color: #ffffff;
            background: #7ed7b5;
          }
          .suggest {
            color: #353535;
            border: 1px solid #9e9e9e;
            margin-left: 36px;
            img {
              width: 24px;
              height: 24px;
              margin-right: 6px;
            }
          }
          .edit {
            width: 44px;
            height: 44px;
          }
          .delete {
            width: 44px;
            height: 44px;
            margin-left: 48px;
          }
        }
      }
    }
    .nomore {
      font-size: 24px;
      color: #bbbbbb;
      letter-spacing: 2px;
      margin: 36px auto 0;
      text-align: center;
    }
    .noList {
      font-size: 28px;
      color: #bbbbbb;
      letter-spacing: 3.23px;
      text-align: center;
      position: absolute;
      top: 40%;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
}

//pc端
@media screen and (min-width: 768px) {
  #right-work-list-wrap {
    display: none;
  }
}
</style>
