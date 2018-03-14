<template>
  <div class="indexpage">
    <div class="modal flex-v flex-cc" ref="modal">
      <div class="modal-container  flex-v">
        <div class="modal-close" @click="closeModal">
          <img src="../assets/img/modal-close.png"/>
        </div>
        <div class="modal-title flex-h flex-cc">
          <img class="" src="../assets/img/guize-title.png"/>
        </div>
        <div class="item flex-h">
          <img src="../assets/img/guize-1.png" alt="" class="tag">
          <p class="modal-text">该活动仅针对未下单的新用户，老用户无法参加；</p>
        </div>
        <div class="item flex-h">
          <img src="../assets/img/guize-2.png" alt="" class="tag">
          <p class="modal-text">每个用户仅限领取一次；</p>
        </div>
        <div class="item flex-h">
          <img src="../assets/img/guize-3.png" alt="" class="tag">
          <p class="modal-text">优惠券领取后，可以在微信卡包中查看。具体查看方式：微信“我的”页面→卡包→我的票券；</p>
        </div>
        <div class="item flex-h">
          <img src="../assets/img/guize-4.png" alt="" class="tag">
          <p class="modal-text">新人优惠券有效期7天，请在有效期内使用，过期失效；</p>
        </div>
        <div class="item flex-h">
          <img src="../assets/img/guize-5.png" alt="" class="tag">
          <p class="modal-text">用户发送退款时，仅可退回实际支付金额，无法退回支付优惠券；</p>
        </div>
        <div class="item flex-h">
          <img src="../assets/img/guize-6.png" alt="" class="tag">
          <p class="modal-text">优惠券使用方法：新用户购买商品，若满足优惠券使用条件，支付时将自动减免（页面有提示）；</p>
        </div>
      </div>
    </div>
    <div class="banner">
      <div class="guize" @click="guizeClick"></div>
      <img src="../assets/img/xinren-text.png" alt="" class="text">
      <div class="kaquan flex-v flex-cc">
    
        <div class="item flex-h">
          <div class="left flex-h flex-cc">
            <div class="price">
              <span class="tag">¥</span>
              50
            </div>
          </div>
          <div class="right flex-v flex-cc flex-1">
            <span class="hint">满50可用</span>
            <span class="des">-全场通用-</span>
          </div>
        </div>

        <div class="item flex-h">
          <div class="left flex-h flex-cc">
            <div class="price">
              <span class="tag">¥</span>
              50
            </div>
          </div>
          <div class="right flex-v flex-cc flex-1">
            <span class="hint">满50可用</span>
            <span class="des">-全场通用-</span>
          </div>
        </div>
   
      </div>
    </div>
    
    <div class="handle flex-v flex-cc" >
        <div class="btn-box">
          <img src="../assets/img/btn_fail.png" alt="">
          <img src="../assets/img/btn_get.png" alt="">
          <img src="../assets/img/btn_finish.png" alt="">
        </div>
      </div>
    <div class="hot-products">
      <div class="title flex-h flex-cc">
        <div class="line"></div>
        <div class="text">爆款推荐</div>
        <div class="line"></div>
      </div>
      <div class="products flex-h ">
        <div class="item flex-v">
            <div class="product-img"></div>
            <div class="activity-name flex-h flex-cc">活动五个字</div>
            <div class="p-title">这是一款特阿萨德啊第三方别好吃的东西你们等着</div>
            <div class="des">啊和阿萨德啊是啊的奥森但是当时但是 但是是的 说的</div>
            <div class="price-box flex-h">
              <div class="tag">专享</div>
              <div class="nowprice">¥59</div>
              <div class="oldprice">¥100.9</div>
            </div>
        </div>
        <div class="item flex-v">
            <div class="product-img"></div>
            <!-- <div class="activity-name flex-h flex-cc">活动五个字</div> -->
            <div class="p-title">这是一款特阿萨德啊第三方别好吃的东西你们等着</div>
            <div class="des">啊和阿萨德啊是啊的奥森但是当时但是 但是是的 说的</div>
            <div class="price-box flex-h">
              <div class="tag">专享</div>
              <div class="nowprice">¥59</div>
              <div class="oldprice">¥100.9</div>
            </div>
        </div>
        <div class="item flex-v">
            <div class="product-img"></div>
            <div class="activity-name flex-h flex-cc">活动五个字</div>
            <div class="p-title">这是一款特阿萨德啊第三方别好吃的东西你们等着</div>
            <div class="des">啊和阿萨德啊是啊的奥森但是当时但是 但是是的 说的</div>
            <div class="price-box flex-h">
              <div class="tag flex-h flex-cc">专享</div>
              <div class="nowprice">¥59</div>
              <div class="oldprice">¥100.9</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'wx'
export default {
  name: 'indexpage',
  data() {
    return {
      msg: 'this is indexpage'
    }
  },
  methods: {
    guizeClick() {
      const modal = document.querySelector('.modal')
      modal.classList.remove('hidden')
      modal.classList.add('show')
      document.documentElement.style['overflow'] = 'hidden'
    },
    closeModal() {
      const modal = document.querySelector('.modal')
      modal.classList.remove('show')
      modal.classList.add('hidden')
      document.documentElement.style['overflow'] = 'inherit'
    }
  },
  created() {
    console.log('wx', wx)
    this.$nextTick(() => {
      const modal = document.querySelector('.modal')
      modal.addEventListener('touchmove', function(event) {
        event.preventDefault()
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.indexpage {
  position: relative;
  .hidden {
    opacity: 0 !important;
    transform: scale(0) !important;
  }
  .show {
    opacity: 1 !important;
    transform: scale(1) !important;
  }
  .modal {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: opacity 0.1s ease-in;
    transform: scale(0);
    transform-origin: 50% 50%;

    .modal-container {
      position: fixed;
      left: 0;
      right: 0;
      top: 143px;
      margin: 0 auto;
      width: 660px;
      background: #ffffff;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2);
      border-radius: 12px;
    }
    .modal-title {
      img {
        width: 260px;
        height: 48px;
        margin-bottom: 48px;
        margin-top: 60px;
      }
    }
    .modal-close {
      position: absolute;
      right: 0;
      top: 0;
      img {
        padding: 26px;
        width: 42px;
        height: 42px;
      }
    }
    .item {
      margin: 0 52px 36px 52px;
      .tag {
        width: 30px;
        height: 45px;
      }
      .modal-text {
        font-family: PingFangTC-Regular;
        font-size: 24px;
        color: #353535;
        letter-spacing: 3px;
        line-height: 40px;
        margin-left: 16px;
      }
    }
  }
  .banner {
    position: relative;
    padding-bottom: 60px;
    background: linear-gradient(to right, #548cfd, #9e32ed);
    .guize {
      position: absolute;
      right: 0;
      top: 30px;
      width: 180px;
      height: 80px;
    }
    .text {
      width: 100%;
    }
    .kaquan {
      .title {
      }
      .item {
        width: 520px;
        height: 144px;
        background: url('../assets/img/kaquan-bg.png') no-repeat;
        background-size: 100% 100%;
        margin-bottom: 50px;
        .left {
          position: relative;
          width: 200px;
          text-align: center;
          .tag {
            position: absolute;
            top: 16px;
            left: -25px;
            font-family: CoreSansA45Regular;
            font-size: 33px;
            color: #ff675a;
            letter-spacing: 0;
          }
          .price {
            position: relative;
            font-family: CoreSansA45Regular;
            font-size: 84px;
            color: #ff675a;
            letter-spacing: 0;
          }
        }

        .right {
          text-align: center;
          .hint {
            font-family: PingFangSC-Medium;
            font-size: 36px;
            color: #353535;
            letter-spacing: 3px;
          }
          .des {
            font-family: PingFangSC-Regular;
            font-size: 18px;
            color: #ffffff;
            letter-spacing: 8px;
            background: #ff7a6f;
            padding: 0 13px;
            border-radius: 4px;
          }
        }
      }
    }
  }

  .handle {
    position: relative;
    .btn-box {
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 390px;
      height: 90px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .hot-products {
    padding-top: 95px;

    .title {
      .line {
        height: 1px;
        width: 168px;
        background: #b2b2b2;
      }
      .text {
        font-family: PingFangSC-Medium;
        font-size: 32px;
        color: #353535;
        letter-spacing: 3px;
        margin: 0 30px;
        text-align: justify;
      }
    }
    .products {
      width: 100%;
      flex-flow: row wrap;
      justify-content: flex-start;
      padding-top: 48px;
      .item {
        width: 312px;
        margin-left: 42px;
        margin-bottom: 106px;
        .product-img {
          width: 100%;
          height: 312px;
          background: red;
        }
        .activity-name {
          width: 118px;
          height: 36px;
          margin-top: 30px;
          text-align: center;
          font-family: PingFangTC-Regular;
          font-size: 18px;
          color: #ffffff;
          letter-spacing: 1px;
          background: #ff8375;
          border-radius: 6px;
        }
        .p-title {
          font-family: PingFangSC-Regular;
          font-size: 30px;
          color: #353535;
          letter-spacing: 3.46px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          word-break: break-all;
          margin-top: 30px;
        }
        .des {
          font-family: PingFangSC-Regular;
          font-size: 22px;
          color: rgba(155, 155, 155, 0.87);
          letter-spacing: 3px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          word-break: break-all;
          margin-top: 18px;
        }
        .price-box {
          align-items: center;
          margin-top: 30px;
          .tag {
            font-family: PingFangSC-Regular;
            font-size: 22px;
            line-height: 22px;
            color: #ff6a5d;
            letter-spacing: 0;
            border: 1px solid #ff6a5d;
            padding: 6px 3px;
          }
          .nowprice {
            font-family: CoreSansA45Regular;
            font-size: 36px;
            color: #ff675a;
            letter-spacing: 0;
            margin-left: 11px;
          }
          .oldprice {
            font-family: CoreSansA45Regular;
            font-size: 24px;
            line-height: 24px;
            color: #888888;
            letter-spacing: 1.85px;
            margin-left: 10px;
            text-decoration: line-through;
            text-decoration-line: line-through;
          }
        }
      }
    }
  }
}
</style>
