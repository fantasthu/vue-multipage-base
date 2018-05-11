<template>
  <div id="right-userinfo-wrap">
     <div class="flex-v right-user-info">
      <div class="name ">昵称：{{shortname}} <span v-if="remarkId">({{remarkId}})</span><button v-if="remarkId" class="copyname" :data-clipboard-text="remarkId">复制ID</button></div>
      <div class="identity">用户身份：{{isPush?'VIP':'普通用户'}}</div>
    </div>
    <right-order :over="over" @createFromPcOrder="createFromPcOrder"  :openId = "openId" :orderList="orderList" :showMoreBtn="showMoreBtn"></right-order>

    <div class="flex-h left-work-order" v-show="showCreateWorkOrder" >
      <!--  新增工单 -->
      <el-dialog title="新增工单" :visible.sync="showCreateWorkOrder" class="add-card">
        <el-form :model="orderForm">
          <div class="top flex-v">
            <div class="column flex-h">
              <el-form-item class="flex-1" label="所属客服" :label-width="formLabelWidth">
                <el-input v-model="orderForm.customer" auto-complete="off"></el-input>
              </el-form-item>
              
              <el-form-item class="flex-1" label="处理状态" :label-width="formLabelWidth">
                <el-select v-model="orderForm.status" placeholder="请选择">
                  <el-option label="未解决" value="未解决"></el-option>
                  <el-option label="已解决" value="已解决"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="column flex-h">
              <el-form-item class="flex-1" label="用户昵称/微信ID:" :label-width="formLabelWidth">
                <el-input v-model="orderForm.identity" auto-complete="off"></el-input>
              </el-form-item>

              <el-form-item class="flex-1" label="订单号" :label-width="formLabelWidth">
                <el-input v-model="orderForm.ordernum" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-select v-model="orderForm.ordertype" placeholder="请选择">
                  <el-option label="客诉" value="客诉"></el-option>
                  <el-option label="建议" value="建议"></el-option>
                </el-select>
          </el-form-item>

          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input v-model="orderForm.title" auto-complete="off" placeholder="请输入标题"></el-input>
          </el-form-item>

          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="3" v-model="orderForm.describe" auto-complete="off" placeholder="请输入描述"></el-input>
          </el-form-item>

          <div class="orderPicsNum flex-h">{{orderPics.length}}/{{picsLimit}}</div>
            <!-- 图片上传 -->
          <div class="pic-upload flex-h">
            <div class="pics flex-h">
              <div class="item" v-for="(item,index) in orderPics">
                <i class="el-icon-error" @click="delPic(index)"></i>
                <img :src="item" alt="">
              </div>
            </div>
            <div class="pic-add flex-h flex-cc" @click="picAddClick" v-show="orderPics.length < picsLimit">
                <input type="file" filetype="image/*" ref="addfileinput" class="pic-file" style="display:none" @change="handleFiles">  
                <i class="el-icon-plus"></i>
            </div>
          </div>
        </el-form>
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="showCreateWorkOrder = false">取 消</el-button>
          <el-button type="primary" @click="addOrderSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import RightOrder from './RightOrder.vue'
import axios from 'axios'
import { formatTime } from '../service/tools'
import ClipboardJS from 'clipboard'
import { Loading } from 'element-ui'
import config from '../service/config.js'

export default {
  name: 'rightUserInfo',
  components: { RightOrder },
  props: {
    name: {
      type: String,
      default: ''
    },
    shortname: {
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
      temOrderList: [],
      orderList: [],
      page: 1,
      pageSize: 5,
      preventRepeat: true,
      over: false,
      showMoreBtn: true,
      showCreateWorkOrder: false, // pc端创建工单的显示隐藏
      orderPics: [],
      formLabelWidth: '500',
      orderForm: {
        customer: '',
        ordertype: '',
        status: '',
        title: '',
        identity: '',
        ordernum: '',
        describe: ''
      },
      picsLimit: 5
    }
  },
  created() {
    /**
     * 获取右侧用户信息和订单
     */
    this.$root.eventBus.$on('getList', (tabIndex, openId) => {
      // 是否需要更新数据
      if (tabIndex === 0) {
        this.temOrderList = []
        this.orderList = []
        this.showMoreBtn = true
        this.page = 1
        this.over = false
        // 获取订单列表
        this.getOrderList(openId || this.openId, 'first')
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
            let obj = res.data.obj
            if (obj.orderList.length === 0) {
              this.over = true
              this.showMoreBtn = false
              return false
            }
            if (obj.orderList.length < this.pageSize) {
              this.over = true
            }
            if (flag) {
              obj.orderList.forEach(item => {
                item.createTime = formatTime(item.createTime / 1000)
              })
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
                    statusDes = '已完成'
                    break
                  case 52:
                  case 53:
                  case 54:
                    statusDes = '已关闭'
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
    },
    /**
     * 显示创建工单组件
     */
    createFromPcOrder(orderNo) {
      this.orderForm.ordernum = orderNo
      this.orderForm.identity = this.name
      this.orderForm.customer = this.getWaiterName()
      this.orderForm.status = '未解决'
      this.orderForm.ordertype = ''
      this.orderForm.title = ''
      this.orderForm.describe = ''
      this.orderPics = []

      this.showCreateWorkOrder = true
    },
    getWaiterName() {
      const waiterInfo = JSON.parse(localStorage.getItem('waiterInfo'))
      return waiterInfo.name || ''
    },
    /**
     * 删除图片
     */
    delPic(index) {
      this.orderPics.splice(index, 1)
    },
    /**
     * 保存工单
     */
    addOrderSubmit() {
      this.orderForm.imgurls = JSON.stringify(this.orderPics || '')
      if (this.orderForm.customer.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写所属客服'
        })
        return
      }
      if (this.orderForm.status.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写处理状态'
        })
        return
      }
      var reg = /^[0-9a-zA-Z]*$/g
      let ordernum = this.orderForm.ordernum.trim()
      if (ordernum !== '' && !reg.test(ordernum)) {
        this.$message({
          message: '订单号请输入字母或数字',
          type: 'error'
        })
        return
      }
      if (this.orderForm.ordertype.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写类型'
        })
        return
      }
      if (this.orderForm.title.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写标题'
        })
        return
      }
      if (this.orderForm.describe.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写描述'
        })
        return
      }
      axios
        .post('http://cs.velo.top/customerService/csapi/addworkorder', {
          customer: this.orderForm.customer,
          status: this.orderForm.status,
          identity: this.orderForm.identity,
          ordernum: this.orderForm.ordernum,
          ordertype: this.orderForm.ordertype,
          title: this.orderForm.title,
          describe: this.orderForm.describe,
          imgurls: this.orderForm.imgurls,
          openid: this.openId
        })
        .then(_ => {
          if (_.data.status === 0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.showCreateWorkOrder = false
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }
        })
    },
    /**
     * 点击上传图片
     */
    picAddClick() {
      this.$refs.addfileinput.click()
    },
    /**
     * 添加图片
     */
    async handleFiles(obj) {
      const fileValue = obj.target.value
      const fileType = fileValue.split('.')
      const testType = fileType[fileType.length - 1]
      // const filename = fileType[0]
      const file = obj.target.files[0]
      if (/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(testType)) {
        let loadingInstance = Loading.service()
        let imgUrl = await this.handleImgUrl(file)
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
        this.orderPics.push(imgUrl)
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
     * oss
     */
    handleImgUrl(file) {
      return new Promise((resolve, reject) => {
        let url = ''
        const client = new OSS.Wrapper({
          region: 'oss-cn-beijing',
          accessKeyId: 'LTAIqZNxHpwAnq9r',
          accessKeySecret: '88mdWv9IiQMecrwevspKWyyllIcd0f',
          bucket: 'velo-bucket',
          secure: true
        })
        const timestamp = +new Date()
        const storeAs = `wenjuan/${timestamp}.png`
        client
          .multipartUpload(storeAs, file)
          .then(function(result) {
            console.log(result)
            url = result.res.requestUrls[0]
            resolve(url)
          })
          .catch(function(err) {
            console.log(err)
            resolve('')
          })
      })
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
    padding: 36px 24px;
    background: #f1f1f1;

    .name {
      font-size: 20px;
      color: #353535;
      letter-spacing: 0;
      span {
        font-size: 20px;
        color: #888888;
        letter-spacing: 2px;
        margin-left: 8px;
      }
      .copyname {
        border: 2px solid #b2b2b2;
        display: inline-block;
        margin-left: 18px;
        width: 66px;
        height: 28px;
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        color: #888;
        vertical-align: middle;
        background: transparent;
      }
    }
    .identity {
      font-size: 20px;
      color: #888888;
      letter-spacing: 0;
      margin-top: 24px;
    }
  }
  .left-work-order {
    background: #fff;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.25);
    .add-card {
      .orderPicsNum {
        height: 40px;
        justify-content: flex-end;
      }
      .pic-upload {
        flex-wrap: wrap;
        .pics {
          flex-wrap: wrap;
          .item {
            position: relative;
            width: 160px;
            height: 160px;
            margin-right: 20px;
            margin-bottom: 20px;
            .el-icon-error {
              position: absolute;
              right: 8px;
              top: 8px;
            }
            img {
              border-radius: 10px;
              width: 100%;
              height: 100%;
            }
          }
        }
        .pic-add {
          width: 160px;
          height: 160px;
          border: 1px dashed #eee;
          border-radius: 10px;
        }
      }
    }
    .menu {
      width: 460px;
      border-right: 2px solid #e5e5e5;
      .list {
        .item {
          height: 116px;
          font-family: PingFang-SC-Medium;
          font-size: 30px;
          color: #b2b2b2;
          letter-spacing: 0;
          text-align: center;
          border-bottom: 1px solid #e5e5e5;
          .name {
          }
          .number {
          }
        }
        .active {
          background: #eee;
          color: #353535;
        }
      }
    }
    .content {
      position: relative;
      .head {
        height: 116px;
        border-bottom: 2px solid #e5e5e5;
        padding-left: 36px;
        .name {
          font-family: PingFangSC-Medium;
          font-size: 30px;
          color: #353535;
          letter-spacing: 0;
        }
        .addorder {
          width: 168px;
          height: 62px;
          line-height: 62px;
          background: #ffe654;
          border-radius: 100px;
          text-align: center;
          margin-right: 60px;
        }
      }
      .table-con {
        position: absolute;
        left: 36px;
        right: 36px;
        top: 118px;
        bottom: 100px;
        overflow: scroll;
      }
      .pagination {
        position: absolute;
        bottom: 0;
        margin: 20px 0;
      }
    }
  }
}
</style>
