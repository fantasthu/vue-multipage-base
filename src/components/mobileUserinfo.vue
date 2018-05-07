<template>
  <div class="userinfo">
    <service-header  @chatBack="chatBack" :back="true" class="service-header" :title='currentTitle' :more="false"></service-header>
    <div class="userinfo-content">
      <div class="flex-v right-user-info">
        <div class="name flex-h flex-bc"><div>昵称：{{name}} <span>({{openId.slice(0,5)}})</span></div><div class="copyname" :data-clipboard-text="openId">复制ID</div></div>
        <div class="identity">用户身份： {{whichProgramme?'VIP':'小白'}}</div>
      </div>
      <right-order :over="over" :openId = "openId" :orderList="orderList" :showMoreBtn="showMoreBtn"></right-order>
      <editWorkList v-show="showEditWorkList" :name="name" :orderNo="orderNo" from="order" :needTop='needTop'></editWorkList>
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
    }
  },
  data() {
    return {
      currentTitle: '用户信息',
      // name: '',
      // openId: '',
      // whichProgramme: false,
      temOrderList: [],
      orderList: [],
      page: 1,
      preventRepeat: true,
      over: false,
      showMoreBtn: true,
      showEditWorkList: false,
      needTop: true,
      orderNo: ''
    }
  },
  created() {
    // 获取订单列表
    this.$root.eventBus.$on('getOrderList', () => {
      this.orderList = []
      this.temOrderList = []
      this.page = 1
      this.showMoreBtn = true
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
    })

    // 隐藏工单页面
    this.$root.eventBus.$on('hideworkFromOrder', () => {
      this.showEditWorkList = false
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
      this.$root.eventBus.$emit('hideMobileMenu', { from: 'mobileUserinfo' })
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
        pageSize: 5
      }
      // axios
      instance
        .get(
          'http://192.168.1.44:9000/repair-service/repair/getOrderByOrderNo',
          {
            params: data
          }
        )
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.obj.orderList.length === 0) {
              this.over = true
              this.showMoreBtn = false
              return false
            }
            res.data.obj.orderList.forEach(item => {
              item.createTime = formatTime(item.createTime / 1000)
            })
            if (flag) {
              if (res.data.obj.orderList.length === 1) {
                this.showMoreBtn = false
              }
              this.temOrderList = res.data.obj.orderList
              this.orderList.push(res.data.obj.orderList[0])
            } else {
              // 请求多个order数据
              this.orderList = this.orderList.concat(res.data.obj.orderList)
            }
            this.page++
          } else {
            this.showMoreBtn = false
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
      if (this.preventRepeat && !this.over) {
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
