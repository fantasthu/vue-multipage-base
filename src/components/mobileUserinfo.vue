<template>
  <div class="userinfo">
    <service-header @chatBack="chatBack" :back="true" class="service-header" :title='currentTitle' :more="false"></service-header>
    <div class="userinfo-content">
      <div class="flex-v right-user-info">
        <input id="foo" :value="remarkId" style="opacity:0">
        <div class="name flex-h flex-bc">
          <div>昵称：{{name}} <span v-if="remarkId">({{remarkId}})</span></div>
          <button v-if="remarkId" class="copyname" data-clipboard-target="#foo">复制ID</button>
        </div>
        <div class="identity">用户身份： {{isPush?'VIP':'普通用户'}}</div>
      </div>
      <right-order :over="over" :openId = "openId" :orderList="orderList" :showMoreBtn="showMoreBtn"></right-order>
      <editWorkList v-show="showEditWorkList" :name="name" from="order" :needTop='needTop' :hideHead="hideHead" :openId="openId"></editWorkList>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ServiceHeader from '../components/ServiceHeader'
import RightOrder from '../components/RightOrder.vue'
import { formatTime } from '../service/tools'
import ClipboardJS from 'clipboard'
import editWorkList from './EditWorkList'
import config from '../service/config.js'

export default {
  name: 'mobileUserinfo',
  components: { RightOrder, ServiceHeader, editWorkList },
  props: {
    openId: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    whichProgramme: {
      type: Boolean,
      defautl: false
    },
    remarkId: {
      type: String,
      default: ''
    },
    isPush: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentTitle: '用户信息',
      temOrderList: [],
      orderList: [],
      page: 1,
      preventRepeat: true,
      over: false,
      showMoreBtn: true,
      showEditWorkList: false,
      needTop: true,
      orderNo: '',
      hideHead: true,
      pageSize: 5
    }
  },
  created() {
    // 获取订单列表
    this.$root.eventBus.$on('getOrderList', () => {
      this.orderList = []
      this.temOrderList = []
      this.page = 1
      this.showMoreBtn = true
      this.over = false
      this.getOrderList(this.openId, 'first')
    })

    // 查看更多订单
    this.$root.eventBus.$on('checkMoreOrder', width => {
      if (width < 768) {
        this.checkMoreOrder()
      }
    })

    // 显示创建工单页面
    this.$root.eventBus.$on('createFromOrder', orderNo => {
      this.showEditWorkList = true
      this.orderNo = orderNo
      this.currentTitle = '编辑工单'
      this.$root.eventBus.$emit('openEditWork', orderNo)
    })

    // 隐藏工单页面
    this.$root.eventBus.$on('hideworkFromOrder', () => {
      this.showEditWorkList = false
      this.currentTitle = '用户信息'
    })

    // 复制id
    this.clipboard = new ClipboardJS('.copyname')
    this.clipboard.on('success', e => {
      this.$toast('复制成功')
      e.clearSelection()
    })
  },
  mounted() {
    this.$nextTick(() => {})
  },
  methods: {
    /**
     * 返回
     */
    chatBack() {
      if (this.showEditWorkList) {
        // 隐藏工单
        this.$root.eventBus.$emit('hideworkFromOrder')
      } else {
        this.$root.eventBus.$emit('hideMobileMenu', { from: 'mobileUserinfo' })
      }
    },
    /**
     * 获取订单列表
     */
    getOrderList(openid, flag) {
      if (this.over) {
        return
      }
      var instance = axios.create({
        headers: {
          velo_admin: 'nRF9L8ZaOKlE2lew'
        }
      })
      var data = {
        openid,
        startPage: this.page,
        pageSize: this.pageSize
      }
      // axios
      instance
        .get(`${config.serverUrl}/repair-service/repair/getOrderByOrderNo`, {
          params: data
        })
        .then(res => {
          if (res.data.code === 0) {
            const obj = res.data.obj
            if (obj.orderList.length === 0) {
              this.over = true
              this.showMoreBtn = false
              this.$root.eventBus.$emit('refresh')
              return false
            }
            if (obj.orderList.length < this.pageSize) {
              this.over = true
            }
            obj.orderList.forEach(item => {
              item.createTime = formatTime(item.createTime / 1000)
            })
            if (flag) {
              if (obj.orderList.length === 1) {
                this.showMoreBtn = false
              }
              obj.orderList.map(el => {
                // el.statusDes=
                var statusDes = ''
                switch (el.status) {
                  case 1:
                    statusDes = '待付款'
                    break
                  case 2:
                    statusDes = '待发货'
                    break
                  case 3:
                    statusDes = '待收货'
                    break
                  case 4:
                    statusDes = '待评价'
                    break
                  case 21:
                    statusDes = '拼团中'
                    break
                  case 22:
                    statusDes = '评团成功'
                    break
                  case 23:
                    statusDes = '评团失败'
                    break
                  case 50:
                  case 51:
                  case 52:
                  case 53:
                  case 54:
                    statusDes = '已完成'
                    break
                }
                el.statusDes = statusDes
              })
              this.temOrderList = obj.orderList
              this.orderList.push(obj.orderList[0])
            } else {
              // 请求多个order数据
              this.orderList = this.orderList.concat(obj.orderList)
            }
            this.page++
            this.$root.eventBus.$emit('refresh')
          } else {
            this.showMoreBtn = false
            this.orderList = []
          }
        })
        .catch(e => {
          console.log('请求失败:', e)
          this.$toast('网络异常,请重试~')
          // Indicator.close()
        })
    },
    /**
     * 查看更多
     */
    checkMoreOrder() {
      if (this.preventRepeat) {
        this.preventRepeat = false
        this.showMoreBtn = false

        if (this.temOrderList.length > 0) {
          this.orderList = this.temOrderList
          this.temOrderList = []
        } else {
          this.getOrderList(this.openId)
        }

        setTimeout(() => {
          this.preventRepeat = true
        }, 500)
      }
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
* {
  box-sizing: border-box;
}
// 手机端
@media (max-width: 768px) {
  .userinfo {
    position: relative;
    // width: 100%;
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    height: 100%;
    background: #fff;
    .userinfo-content {
      position: absolute;
      top: 88px;
      bottom: 0;
      left: 0;
      right: 0;
      .right-user-info {
        background: #f7f7f7;
        padding: 0 42px;
        height: 190px;
        .name {
          font-size: 32px;
          color: #353535;
          letter-spacing: 3px;
          margin-top: 40px;
          span {
            font-size: 24px;
            color: #888888;
            letter-spacing: 2px;
            margin-left: 18px;
          }
          .copyname {
            border: 2px solid #b2b2b2;
            margin-left: 24px;
            width: 90px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            font-size: 22px;
            color: #888;
            letter-spacing: 0;
            background: transparent;
          }
        }
        .identity {
          font-size: 24px;
          color: #888888;
          letter-spacing: 0;
          margin-top: 20px;
        }
      }
    }
  }
}

//pc端
@media screen and (min-width: 768px) {
  .userinfo {
    display: none;
  }
}
</style>
