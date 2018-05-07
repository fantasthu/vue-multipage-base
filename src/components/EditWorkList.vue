<template>
<div>
  <div id="right-work-list-wrap" :class="{'top0':needTop}">
    <service-header  @chatBack="chatBack" :back="true" class="service-header" :title='pageTitle' :more="false"></service-header>
    <div class="edit-wrapper ">
      <div class="list">所属客服：<span>客服人员</span></div>
      <div class="work-status list flex-h">处理状态：
        <div class="flex-h">
          <div v-for="item,index in statusList" :class="['tag flex-h flex-cc' ,{'statusActive':statusIndex==index} ] " @click.stop="choiceStatus(index)">{{item}}</div>
        </div>
      </div>
      <div class="list">用户昵称/微信ID：<span>{{identity||name}}</span></div>
      <div class="list">订单号：<span>{{ordernum||orderNo||'无'}}</span></div>
      <div class="list flex-h flex-bc choice-type" @click.stop="toChoice">
        <div>类型：<span>{{choice}}</span></div>
        <img v-show='showType' src="../assets/img/up.png" alt="">
        <img v-show="!showType" src="../assets/img/down.png" alt="">
      </div>
      <div v-show="showType" :class="['type',{'typeSelect':typeIndex==index}]" v-for="item,index in typeList" @click.stop="choiceType(index)">{{item}}</div>
      
      <div class="list input-title"><input type="text" v-model="workTitle" placeholder="标题"></div>
      
      <div class="des">
        <textarea name="" id="" v-model="workDes"  placeholder="请描述"></textarea>
      </div>

      <div class="upload">
        <div class="upload-title flex-h"><span>图片</span><span>{{upImgs.length}}/5</span></div>
        <div class="imgList flex-h">
          <div class="image-area" v-for="item,index in upImgs">
            <img :src="item">
            <img src="../assets/img/delete.png" alt="" class="delete" @click.stop="deleteImg(index)">
          </div>
          <div class="upload-btn image-area flex-h flex-cc" v-show="upImgs.length<5">
            <img src="../assets/img/add.png" alt="">
            <input type="file" v-on:change="selectPic">
          </div>
        </div>
      </div>
      <div class="save-btn" @click.stop="toSaveWorkList">保存</div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
// import { formatTime } from '../service/tools'
// import ClipboardJS from 'clipboard'
import ServiceHeader from './ServiceHeader'

export default {
  name: 'editWorkList',
  components: { ServiceHeader },
  props: {
    name: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    needTop: {
      type: Boolean,
      default: false
    },
    orderNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pageTitle: '编辑工单',
      workTitle: '',
      typeList: ['建议', '客诉'],
      statusList: ['未解决', '已解决'],
      upImgs: [],
      statusIndex: 0,
      choice: '请选择',
      showType: false,
      workDes: '',
      isUpdate: false,
      typeIndex: -1,
      customer: '客服',
      ordernum: '',
      identity: '' // 提交的用户名
    }
  },
  created() {
    // 初始化oss
    this.client = new OSS.Wrapper({
      region: 'oss-cn-beijing',
      accessKeyId: 'LTAIqZNxHpwAnq9r',
      accessKeySecret: '88mdWv9IiQMecrwevspKWyyllIcd0f',
      bucket: 'velo-bucket',
      secure: true
    })

    // 判断创建或修改
    this.$root.eventBus.$on('updateWorkList', (info, index) => {
      console.log(info, index)
      this.initworkData(info)
      console.log('this.isUpdate', this.isUpdate)
    })
  },
  mounted() {},
  methods: {
    initworkData(info) {
      if (info) {
        // 修改工单
        this.isUpdate = true

        this.upImgs = info.imgurls === '' ? '' : JSON.parse(info.imgurls)
        this.workDes = info.des
        this.workTitle = info.title
        this.typeIndex = info.ordertype
        this.ordernum = info.ordernum
        this.identity = info.identity
        this.statusIndex = info.status
        this.customer = info.customer
        this.id = info.id
      } else {
        // 创建工单
        this.isUpdate = false

        this.upImgs = []
        this.workDes = ''
        this.workTitle = ''
        this.typeIndex = -1
        this.ordernum = ''
        this.identity = ''
        this.statusIndex = 0
        this.customer = '客服'
      }
      this.choice =
        this.typeIndex > -1 ? this.typeList[this.typeIndex] : '请选择'
    },

    /**
     * 返回
     */
    chatBack(refresh = false) {
      if (this.from === 'order') {
        // 用户信息的订单点击创建工单
        this.$root.eventBus.$emit('hideworkFromOrder')
      } else {
        // 隐藏移动端用户信息
        this.$root.eventBus.$emit('hideEditWorkList', refresh)
      }
    },

    /**
     * 显示隐藏类型
     */
    toChoice() {
      this.showType = !this.showType
    },

    /**
     * 选择类型
     */
    choiceType(index) {
      this.typeIndex = index
      this.choice = this.typeList[index]
      this.showType = false
    },

    /**
     * 选择状态
     */
    choiceStatus(index) {
      this.statusIndex = index
      console.log(this.workDes)
    },

    /**
     * 删除图片
     */
    deleteImg(index) {
      this.upImgs.splice(index, 1)
      console.log(this.upImgs)
    },

    /**
     * 选择图片
     */
    async selectPic(e) {
      console.log(e.target.files[0])
      var ossUrl = await this.uploadImgToOSS(e.target.files[0])
      console.log('ossUrl', ossUrl)
      this.upImgs.push(ossUrl)
    },

    /**
     * 上传oss
     */
    uploadImgToOSS(img) {
      return new Promise((resolve, reject) => {
        const timestamp = +new Date()
        const storeAs = `customer-service/${timestamp}.png`
        this.client
          .multipartUpload(storeAs, img)
          .then(function(result) {
            let url = result.res.requestUrls[0]
            if (url.indexOf('?') > 0) {
              let noQueryUrl = url.substr(0, url.indexOf('?'))
              resolve(noQueryUrl)
            } else {
              resolve(url)
            }
          })
          .catch(function(err) {
            resolve({ err })
          })
      })
    },

    /**
     * 保存工单
     */
    toSaveWorkList() {
      if (this.typeIndex < 0) {
        this.$toast('请选择类型')
        return
      }
      if (!this.workTitle.trim()) {
        this.$toast('请输入标题')
        return
      }
      if (!this.workDes.trim()) {
        this.$toast('请输入描述')
        return
      }
      let url = ''
      let data = {
        customer: '客服人员',
        status: this.statusIndex,
        identity: this.identity || this.name,
        ordernum: this.ordernum || this.orderNo,
        ordertype: this.typeIndex, // '客诉/建议'
        title: this.workTitle,
        describe: this.workDes,
        imgurls: JSON.stringify(this.upImgs)
      }
      if (this.isUpdate) {
        url = 'http://cs.velo.top/customerService/csapi/updateWorkOrder'
        data.id = this.id
      } else {
        url = 'http://cs.velo.top/customerService/csapi/addWorkOrder'
      }

      axios
        .post(url, data)
        .then(res => {
          var message = ''
          if (res.data.status === 0) {
            message = this.isUpdate ? '修改工单成功' : '创建工单成功'
            this.$toast(message)
            this.chatBack(true)
          } else {
            message = this.isUpdate ? '修改工单失败' : '创建工单失败'
            this.$toast(message)
          }
        })
        .catch(() => {
          this.$toast('网络错误')
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// 手机端
@media (max-width: 768px) {
  .top0 {
    top: 0 !important;
  }
  #right-work-list-wrap {
    position: absolute;
    top: 88px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: scroll;
    box-sizing: border-box;
    background: #fff;
    -webkit-overflow-scrolling: touch;

    .edit-wrapper {
      padding: 0 42px 40px;
      .list {
        height: 132px;
        line-height: 132px;
        border-bottom: 1px solid #eeeeee;
        font-size: 28px;
        color: #353535;
        letter-spacing: 3px;
        span {
          color: #888888;
        }
      }
      .work-status {
        justify-content: space-between;
        > div {
          align-items: center;
        }
        .tag {
          border-radius: 100px;
          width: 126px;
          height: 50px;
          text-align: center;
          // line-height: 50px;
          font-size: 24px;
          letter-spacing: 3px;
          color: #888;
          border: 2px solid #dddddd;
          &:nth-child(1) {
            margin-right: 48px;
          }
        }
        .statusActive {
          background: #ffe654;
          color: #353535;
          border: 0;
        }
      }
      .choice-type {
        img {
          width: 44px;
          height: 44px;
        }
      }
      .type {
        height: 100px;
        line-height: 100px;
        padding-left: 30px;
        font-size: 28px;
        color: #353535;
        letter-spacing: 3px;
      }
      .typeSelect {
        background: #f4f4f4;
      }
      .des {
        padding: 38px 0 30px;
        border-bottom: 1px solid #eeeeee;
        textarea {
          background: #fafafa;
          border-radius: 18px;
          min-height: 200px;
          width: 100%;
          border: none;
          outline: none;
          padding: 26px 30px;
          font-size: 28px;
          color: #353535;
          letter-spacing: 3px;
          line-height: 48px;
          box-sizing: border-box;
        }
      }
      .upload {
        .upload-title {
          justify-content: space-between;
          font-size: 28px;
          color: #888888;
          letter-spacing: 3px;
          padding: 36px 0 0;
        }
        .imgList {
          flex-wrap: wrap;
          .image-area {
            width: 150px;
            height: 150px;
            margin-right: 22px;
            position: relative;
            margin-top: 30px;
            img {
              width: 100%;
              height: 100%;
            }
            .delete {
              width: 36px;
              height: 36px;
              position: absolute;
              right: -22px;
              top: -28px;
              box-sizing: content-box;
              padding: 10px;
            }
            &:nth-child(4n) {
              margin-right: 0;
            }
            input {
              opacity: 0;
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
            }
          }
          .upload-btn {
            border: 1px solid #bcbcbc;
            img {
              width: 30px;
              height: 30px;
            }
          }
        }
      }
    }
    .save-btn {
      background: #ffe654;
      border-radius: 100px;
      width: 540px;
      height: 102px;
      line-height: 102px;
      font-size: 30px;
      color: #000000;
      letter-spacing: 3.21px;
      text-align: center;
      margin: 80px auto 0;
    }
  }
}

//pc端
@media screen and (min-width: 768px) {
  #right-work-list-wrap {
    position: absolute;
    top: 115px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    .create-work {
      background: #f4f4f4;
      border: 2px solid #ededed;
      border-radius: 100px;
      height: 65px;
      width: 515px;
      margin: 24px auto 0;
      text-align: center;
      line-height: 65px;
      font-size: 24px;
      color: #353535;
      letter-spacing: 0;
    }
    .work-list {
      padding-bottom: 36px;
      margin: 36px 42px 0;
      border-bottom: 2px solid #e5e5e5;
      .left-dot {
        width: 8px;
        height: 8px;
        background: #353535;
        margin-right: 30px;
        margin-top: 18px;
      }
      .right-wrap {
        .content {
          color: #353535;
          line-height: 33px;
          font-size: 24px;
          letter-spacing: 2px;
          text-align: justify;
        }
        .time {
          font-size: 18px;
          color: #888;
          letter-spacing: 0;
          margin-top: 8px;
        }
        .btns-wrap {
          margin-top: 12px;
          .tag {
            border-radius: 100px;
            width: 80px;
            height: 36px;
            text-align: center;
            line-height: 36px;
            font-size: 18px;
            letter-spacing: 1.5px;
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
            margin-left: 18px;
          }
        }
      }
    }
    .nomore {
      font-size: 24px;
      color: #888888;
      letter-spacing: 2px;
      margin: 36px auto 0;
      text-align: center;
    }
    .noList {
      font-size: 24px;
      color: #888888;
      letter-spacing: 0;
    }
    .btns-hide {
      display: none;
    }
  }
}
</style>
