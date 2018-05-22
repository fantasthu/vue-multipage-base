<template>
<div>
  <div id="right-work-list-wrap" :class="{'top0':needTop}">
    <div class="edit-wrapper ">
      <div class="list flex-h"><div>所属客服：</div><input class="flex-1" type="text" v-model="customer" placeholder="所属客服"></div>
      <div class="work-status list flex-h">处理状态：
        <div class="flex-h">
          <div v-for="item,index in statusList" :class="['tag flex-h flex-cc' ,{'statusActive':status==item} ] " @click.stop="choiceStatus(item)">{{item}}</div>
        </div>
      </div>
      <div class="list flex-h">用户昵称/微信ID：<span class="flex-1 name">{{identity||name}}</span></div>
      <div class="list flex-h"><div>订单号：</div><input class="flex-1" type="text" v-model="ordernum" placeholder="订单号"></div>

      <div class="list flex-h flex-bc choice-type" @click.stop="toChoice">
        <div>类型：<span>{{choice}}</span></div>
        <img v-show='showType' src="../assets/img/up.png" alt="">
        <img v-show="!showType" src="../assets/img/down.png" alt="">
      </div>
      <div v-show="showType" :class="['type',{'typeSelect':type==item}]" v-for="item,index in typeList" @click.stop="choiceType(item)">{{item}}</div>
      
      <div class="list flex-h"><div>标题：</div><input class="flex-1" type="text" v-model="workTitle" placeholder="标题"></div>
      
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
            <input type="file" filetype="image/*" ref="addfileinput" v-on:change="selectPic">
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
import { Loading } from 'element-ui'

export default {
  name: 'editWorkList',
  components: {},
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
    openId: {
      type: String,
      default: ''
    },
    hideHead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageTitle: '编辑工单',
      workTitle: '',
      typeList: ['建议', '客诉'],
      statusList: ['未解决', '已解决'],
      upImgs: [],
      status: '未解决',
      choice: '请选择',
      showType: false,
      workDes: '',
      isUpdate: false,
      type: '',
      customer: '玩味小妹',
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
      this.initworkData(info || '')
      console.log('this.isUpdate', this.isUpdate)
    })
    this.$root.eventBus.$on('openEditWork', orderNo => {
      this.isUpdate = false

      this.ordernum = orderNo
      this.upImgs = []
      this.workDes = ''
      this.workTitle = ''
      this.type = ''
      this.identity = ''
      this.status = '未解决'
      this.customer = this.getWaiterName()
    })
  },
  mounted() {},
  methods: {
    initworkData(info) {
      if (info) {
        console.log('info', info)
        // 修改工单
        this.isUpdate = true

        this.upImgs = JSON.parse(info.imgurls || '[]')
        this.workDes = info.des
        this.workTitle = info.title
        this.type = info.ordertype
        this.ordernum = info.ordernum
        this.identity = info.identity
        this.status = info.status
        // this.customer = info.customer
        this.id = info.id
      } else {
        // 创建工单
        this.isUpdate = false

        this.upImgs = []
        this.workDes = ''
        this.workTitle = ''
        this.type = ''
        this.ordernum = ''
        this.identity = ''
        this.status = '未解决'
        // this.customer = '客服'
      }
      this.choice = this.type || '请选择'
      // 添加默认的所属客服
      this.customer = this.getWaiterName()
    },
    getWaiterName() {
      const waiterInfo = JSON.parse(localStorage.getItem('waiterInfo'))
      return waiterInfo.name || ''
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
    choiceType(item) {
      this.choice = item
      this.type = item
      this.showType = false
    },

    /**
     * 选择状态
     */
    choiceStatus(status) {
      this.status = status
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
    async selectPic(obj) {
      const fileValue = obj.target.value
      const fileType = fileValue.split('.')
      const testType = fileType[fileType.length - 1]
      // const filename = fileType[0]
      const file = obj.target.files[0]
      if (/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(testType)) {
        let loadingInstance = Loading.service()
        let imgUrl = await this.uploadImgToOSS(file)
        loadingInstance.close()
        imgUrl =
          imgUrl.split('?')[0] +
          '?x-oss-process=image/resize,m_lfit,h_200,w_200'
        console.log('====================================')
        console.log(imgUrl)
        console.log('====================================')
        if (imgUrl.trim() === '') {
          this.$message({
            message: '图片上传失败,请您稍后重试~',
            center: true
          })
        }
        this.upImgs.push(imgUrl)
        this.$refs.addfileinput.value = ''
        this.$message({
          message: '图片上传成功',
          center: true
        })
        console.log(file)
      } else {
        this.$message({
          message: '上传失败',
          center: true
        })
      }
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
      var reg = /^[0-9a-zA-Z]*$/g
      if (this.ordernum !== '' && !reg.test(this.ordernum)) {
        this.$message({
          message: '订单号请输入字母或数字',
          center: true
        })
        return
      }
      if (!this.type.trim()) {
        this.$message({
          message: '请选择类型',
          center: true
        })
        return
      }
      if (!this.workTitle.trim()) {
        this.$message({
          message: '请输入标题',
          center: true
        })
        return
      }
      if (!this.workDes.trim()) {
        this.$message({
          message: '请输入描述',
          center: true
        })
        return
      }
      let url = ''
      let data = {
        customer: this.customer,
        status: this.status,
        identity: this.identity || this.name,
        ordernum: this.ordernum,
        ordertype: this.type, // '客诉/建议'
        title: this.workTitle,
        describe: this.workDes,
        imgurls: this.upImgs.length > 0 ? JSON.stringify(this.upImgs) : '[]',
        openid: this.openId
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
    z-index: 9999;

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
        .name {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          white-space: normal;
          text-overflow: ellipsis;
          word-wrap: break-word;
        }
        input {
          color: #888888;
          font-size: 28px;
          letter-spacing: 3px;
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
    display: none;
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
