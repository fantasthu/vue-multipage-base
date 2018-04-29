<template>
  <div class="flex-v right-order">
    <div class="order-title">订单明细</div>
    <div class="order-list" v-for="item in orderList">
      <div class="order-time">{{item.time}}</div>
      <div class="order-info order-status">订单状态：{{item.status}}</div>
      <div class="order-info">订单编号：{{item.orderNo}}</div>
      <div class="order-info">物流编号：{{item.mailNo}}<div class="check-mail" @click.stop="checkMail">查询</div></div>
      <div class="order-info">商品名称：{{item.productName}}</div>
      <div class="order-info">实付金额：￥{{item.realPrice}}</div>
    </div>

    <div class="nomore" v-show="over">没有更多订单了</div>
    <div class="more" v-show="!over">查看历史订单</div>
    <div class="modal" v-show="showMail" @click.stop="closeMail"></div>
    <div class="mail-info" v-show="showMail">
      <div class="mail-header">
        <p>物流公司：<span>{{mailDetail.mailCom}}</span></p>
        <p class="mail-no">物流单号：<span>{{mailDetail.mailNo}}</span></p>
      </div>
      <div class="mail-list">
        <p v-for="item in mailDetail.mailList">{{item}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rightorder',
  components: {},
  props: {},
  data() {
    return {
      showMail: false,
      over: false,
      orderList: [
        {
          time: '2017-04-23  15:30',
          status: '待付款',
          orderNo: '8008208820',
          mailNo: '123rfgdwqwertyuyuye',
          productName: '不知火丑柑',
          realPrice: '44'
        }
      ],
      mailDetail: {
        mailCom: '顺丰',
        mailNo: '1234142',
        mailList: [
          '04-20 13:23：离开xxx，到达xxx',
          '04-20 13:23：离开xxx，到达xxx',
          '04-20 13:23：离开xxx，到达xxx',
          '04-20 13:23：离开xxx，到达xxx'
        ]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    checkMail() {
      console.log('right-order =>checkmail =>查询物流')
      this.showMail = true
    },
    closeMail() {
      this.showMail = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// 手机端
@media (max-width: 768px) {
  .right-order {
  }
}

//pc端
@media screen and (min-width: 768px) {
  .right-order {
    padding: 36px 42px 0 42px;
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
        min-height: 300px;
        font-size: 24px;
        color: #888888;
        letter-spacing: 2px;
        padding: 36px;
        p {
          height: 33px;
          padding-bottom: 33px;
        }
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
