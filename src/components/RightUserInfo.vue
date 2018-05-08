<template>
  <div id="right-userinfo-wrap">
     <div class="flex-v right-user-info">
      <div class="name ">昵称：{{name}} <span>({{openId.slice(0, 5)}})</span><div class="copyname" :data-clipboard-text="openId">复制ID</div></div>
      <div class="identity">用户身份： {{whichProgramme?'VIP':'普通用户'}}</div>
    </div>
    <right-order :over="over"  :openId = "openId" :orderList="orderList" :showMoreBtn="showMoreBtn"></right-order>
  </div>
</template>

<script>
import RightOrder from './RightOrder.vue'
import axios from 'axios'
import { formatTime } from '../service/tools'
import ClipboardJS from 'clipboard'

export default {
  name: 'rightUserInfo',
  components: { RightOrder },
  props: {
    name: {
      type: String,
      default: ''
    },
    whichProgramme: {
      type: Number,
      default: 0
    },
    openId: {
      type: String,
      default: ''
    },
    tab: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      temOrderList: [],
      orderList: [],
      page: 1,
      preventRepeat: true,
      over: false,
      showMoreBtn: true
    }
  },
  created() {
    /**
     * 获取右侧用户信息和订单
     */
    this.$root.eventBus.$on('getList', tabIndex => {
      console.log('tabIndex', tabIndex, tabIndex === 0)
      if (tabIndex === 0) {
        this.temOrderList = []
        this.orderList = []
        this.showMoreBtn = true
        this.page = 1
        // 获取订单列表
        this.getOrderList(this.openId, 'first')
      }
    })

    /**
     * 点击查看更多
     */
    this.$root.eventBus.$on('checkMoreOrder', width => {
      if (width > 768) {
        this.checkMoreOrder()
      }
    })

    // 复制id
    this.clipboard = new ClipboardJS('.copyname')
    this.clipboard.on('success', e => {
      this.$toast('复制成功')
      e.clearSelection()
    })
  },
  mounted() {},
  methods: {
    /**
     * 获取订单列表
     */
    getOrderList(openid, flag) {
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
            if (flag) {
              res.data.obj.orderList.forEach(item => {
                item.createTime = formatTime(item.createTime / 1000)
              })
              if (res.data.obj.orderList.length === 1) {
                this.showMoreBtn = false
              }
              res.data.obj.orderList.map(el => {
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
          this.showMoreBtn = false
          this.$toast('网络异常,请重试~')
        })
    },
    /**
     * 查看更多订单
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
<style scoped lang="scss">
// 手机端
@media (max-width: 768px) {
  #right-userinfo-wrap {
    display: none;
  }
}

//pc端
@media screen and (min-width: 768px) {
  #right-userinfo-wrap {
  }
  .right-user-info {
    padding: 36px 42px;
    background: #f1f1f1;

    .name {
      font-size: 30px;
      color: #353535;
      letter-spacing: 0;
      span {
        font-size: 22px;
        color: #888888;
        letter-spacing: 2px;
        margin-left: 18px;
      }
      .copyname {
        border: 2px solid #b2b2b2;
        display: inline-block;
        margin-left: 24px;
        width: 90px;
        height: 32px;
        font-size: 22px;
        line-height: 32px;
        text-align: center;
        color: #888;
        vertical-align: middle;
      }
    }
    .identity {
      font-size: 24px;
      color: #888888;
      letter-spacing: 0;
      margin-top: 24px;
    }
  }
}
</style>
