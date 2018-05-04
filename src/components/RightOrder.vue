<template>
<div>
    <div class="right-order-wrap" ref="orderWrapper">

      <div class="flex-v right-order">
        <div class="order-title">订单明细</div>
        <div class="order-list" v-for="item in orderList">
          <!-- {{orderList}} -->
          <div class="order-time">{{item.createTime}}</div>
          <div class="order-info order-status">订单状态：{{item.status}}</div>
          <div class="order-info">订单编号：{{item.orderNo}}</div>
          <div class="order-info flex-h flex-bc"><div>物流编号：{{item.mailNo}}</div><div class="check-mail" @click.stop="checkMail({mailNo:item.mailNo,mailName:item.mailName,mailCom:item.mailCom})">查询</div></div>
          <div class="order-info">商品名称：{{item.productName}}</div>
          <div class="order-info">实付金额：￥{{item.realPrice/100}}</div>
        </div>

        <!-- <div class="nomore" v-show="over">没有更多订单了</div> -->
        <div class="more" @click="checkMoreOrder" v-show="showMoreBtn">查看历史订单</div>
      </div>
    </div>
    <div class="modal" v-show="showMail" @click.stop="closeMail"></div>
    <div class="mail-info" v-show="showMail">
      <div class="mail-header">
        <p>物流公司：<span>{{mailName}}</span></p>
        <p class="mail-no">物流单号：<span>{{mailNo}}</span></p>
      </div>
      <div class="mail-list">
        <p v-for="item in mailList">{{item.day}} {{item.hour}} {{item.context}}</p>
      </div>
    </div>
</div>
</template>

<script>
import Bscroll from 'better-scroll'
import { formatterDateTime } from '../service/tools'
export default {
  name: 'rightorder',
  components: {},
  props: {
    orderList: {
      type: Array,
      default: []
    },
    openId: {
      type: String,
      default: ''
    },
    showMoreBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showMail: false,
      mailCom: '',
      mailNo: '',
      mailName: '',
      mailList: []
    }
  },
  created() {},
  mounted() {
    this.scroll = new Bscroll(this.$refs.orderWrapper, {
      mouseWheel: true,
      click: true,
      tap: true,
      preventDefault: true,
      preventDefaultException: { className: /(^|\s)text(\s|$)/ }
      // pullUpLoad: {
      //   threshold: 100
      // }
    })
    // 手机端加载更多
    // this.scroll.on('pullingUp', () => {
    //   // this.items += 10
    //   this.$nextTick(function() {
    //     alert(1)
    //     this.scroll.finishPullUp()
    //     this.$root.eventBus.$emit('checkMoreOrder')
    //   })
    // })
    this.scroll.on('scrollStart', res => {
      this.$nextTick(function() {
        this.startY = this.scroll.y
        console.log('开始滚动', this.scroll.y)
      })
    })
    this.scroll.on('scroll', res => {
      this.$nextTick(function() {
        if (res.y - this.scroll.maxScrollY < 100 && res.y < this.startY - 50) {
          this.$root.eventBus.$emit('checkMoreOrder')
        }
      })
    })
  },
  methods: {
    checkMail(opts) {
      console.log('right-order =>checkmail =>查询物流')
      this.mailList = []
      this.showMail = true
      this.mailName = opts.mailName
      this.mailNo = opts.mailNo
      // opts.mailNo = 'JY0005333765'
      // opts.mailNo = '3969210571756'
      console.log('wuliu-page=>cut=>是否是九曳物流', /^JY/.test(opts.mailNo))
      if (/^JY/.test(opts.mailNo)) {
        this._getJyMailInfo(opts.mailNo)
      } else {
        this.getNormalMail(opts.mailCom, opts.mailNo)
      }
    },
    closeMail() {
      this.showMail = false
    },
    checkMoreOrder() {
      this.$root.eventBus.$emit('checkMoreOrder')
    },

    _getJyMailInfo(nu) {
      $.post(
        'http://192.168.1.44:9000/order-service/order/getJyMailInfo',
        {
          mailNo: nu
        },
        res => {
          if (res.obj.length === 0) {
            this.message = true
          }
          res.obj.map(el => {
            var times = el.time.split(' ')
            el.day = times[0]
              .split('/')
              .splice(1, 2)
              .join('-')
            el.hour = times[1]
              .split(':')
              .splice(0, 2)
              .join(':')
          })
          this.mailList = res.obj
        }
      )
    },

    getNormalMail(com, nu) {
      $.ajax({
        type: 'get',
        url: 'https://route.showapi.com/64-19',
        data: {
          com: com,
          nu: nu,
          showapi_timestamp: formatterDateTime(),
          showapi_appid: '56307',
          showapi_sign: 'b38d3fbf9b0a4b97b30bc2f0548dda3f'
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          res = JSON.parse(res)
          if (res.showapi_res_code === 0) {
            let mailData = res.showapi_res_body
            if (String(mailData.ret_code) === '0' && mailData.data) {
              mailData.data.map(el => {
                var times = el.time.split(' ')
                el.day = times[0]
                  .split('-')
                  .splice(1, 2)
                  .join('-')
                el.hour = times[1]
                  .split(':')
                  .splice(0, 2)
                  .join(':')
              })
              this.mailList = mailData.data
            } else {
              // this.message = true
            }
          } else {
            this.$toast('暂无信息')
            // this.showMail = false
          }
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// 手机端
@media (max-width: 768px) {
  .right-order-wrap {
    // padding: 0 42px;
    position: absolute;
    background: #fff;
    top: 190px;
    left: 0;
    bottom: 0;
    right: 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .right-order {
    padding: 36px 42px 0 42px;
    position: relative;
    .order-title {
      font-size: 32px;
      color: #353535;
      letter-spacing: 3px;
    }
    .order-list {
      padding: 38px 0;
      border-bottom: 2px solid #e5e5e5;
      .order-time {
        background: #f4f4f4;
        border-radius: 100px;
        height: 36px;
        font-size: 24px;
        color: #888888;
        letter-spacing: 0;
        display: inline-block;
        padding: 0 17px;
      }
      .order-info {
        font-size: 28px;
        color: #888888;
        letter-spacing: 3px;
        margin-top: 24px;
      }
      .order-status {
        margin-top: 36px;
      }
      .check-mail {
        border: 2px solid #b2b2b2;
        border-radius: 100px;
        height: 36px;
        line-height: 36px;
        width: 64px;
        text-align: center;
        // display: inline-block;
        margin-left: 24px;
        font-size: 22px;
        letter-spacing: 0;
        color: #888;
      }
    }
    .nomore {
      color: #555555;
      letter-spacing: 3px;
      text-align: center;
      margin: 60px auto;
    }
    .more {
      margin: 60px auto;
      height: 64px;
      line-height: 64px;
      width: 234px;
      border: 2px solid #b2b2b2;
      margin-top: 36px;
      font-size: 28px;
      color: #555555;
      letter-spacing: 3px;
      text-align: center;
    }
  }
  .mail-info {
    background: #ffffff;
    border-radius: 10px;
    position: fixed;
    bottom: 0;
    top: 0;
    margin: auto;
    overflow: hidden;
    height: 462px;
    left: 42px;
    right: 42px;
    background: #fff;
    z-index: 999;
    .mail-header {
      // height: 156px;
      padding: 36px;
      background: #f1f1f1;
      font-size: 24px;
      letter-spacing: 2px;
      p {
        color: #353535;
        span {
          color: #888888;
        }
      }
      .mail-no {
        margin-top: 18px;
      }
    }
    .mail-list {
      height: 300px;
      font-size: 24px;
      color: #888888;
      letter-spacing: 2px;
      padding: 36px;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      p {
        // height: 33px;
        padding-bottom: 33px;
      }
    }
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.25);
  }
}

//pc端
@media screen and (min-width: 768px) {
  .right-order-wrap {
    padding: 0 42px;
    position: absolute;
    top: 288px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    padding: 36px 42px 0 42px;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .right-order {
    position: relative;
    .order-title {
      font-size: 30px;
      color: #353535;
      letter-spacing: 2px;
    }
    .order-list {
      padding: 38px 0;
      border-bottom: 2px solid #e5e5e5;
      .order-time {
        background: #f4f4f4;
        border-radius: 100px;
        height: 36px;
        font-size: 24px;
        color: #888888;
        letter-spacing: 0;
        display: inline-block;
        padding: 0 17px;
      }
      .order-info {
        font-size: 24px;
        color: #888888;
        letter-spacing: 2px;
        margin-top: 24px;
      }
      .order-status {
        margin-top: 36px;
      }
      .check-mail {
        border: 2px solid #b2b2b2;
        border-radius: 100px;
        height: 32px;
        line-height: 32px;
        width: 64px;
        text-align: center;
        display: inline-block;
        margin-left: 24px;
        font-size: 22px;
      }
    }
    .nomore {
      font-size: 24px;
      color: #888888;
      letter-spacing: 2px;
      margin: 30px auto;
    }
    .more {
      font-size: 24px;
      color: #888888;
      letter-spacing: 2px;
      margin: 36px auto;
      height: 56px;
      line-height: 56px;
      text-align: center;
      width: 200px;
      border: 2px solid #b2b2b2;
      margin-top: 36px;
    }
  }
  .mail-info {
    background: #ffffff;
    border-radius: 10px;
    position: absolute;
    bottom: 100px;
    // height: 500px;
    overflow: hidden;
    left: 42px;
    right: 42px;
    background: #fff;
    z-index: 999;
    .mail-header {
      // height: 156px;
      padding: 36px;
      background: #f1f1f1;
      font-size: 24px;
      letter-spacing: 2px;
      p {
        color: #353535;
        span {
          color: #888888;
        }
      }
      .mail-no {
        margin-top: 18px;
      }
    }
    .mail-list {
      height: 300px;
      font-size: 24px;
      color: #888888;
      letter-spacing: 2px;
      padding: 36px;
      overflow: scroll;
      p {
        // height: 33px;
        padding-bottom: 33px;
      }
    }
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.25);
  }
}
</style>
