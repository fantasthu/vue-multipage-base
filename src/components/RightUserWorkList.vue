<template>
<div>
  <div id="right-work-list-wrap">
    <service-header  @chatBack="chatBack" :back="true" class="service-header" :title='pageTitle' :more="false"></service-header>
    <div class="create-work flex-h flex-cc" @click.stop="toCreateWorkList"><img src="../assets/img/add.png" alt="">新建工单</div>
    
    <div ref="workWrapper" class="wrapper">
      <div v-show="workList.length>0">
        <div style="padding-bottom:40px;">
          <div class="work-list flex-h" v-for="item,index in workList">
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
            <el-input v-model="orderForm.title" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="orderForm.describe" auto-complete="off"></el-input>
          </el-form-item>
            <!-- 图片上传 -->
          <div class="pic-upload flex-h">
            <div class="pics flex-h">
              <div class="item" v-for="(item,index) in orderPics">
                <i class="el-icon-error" @click="delPic(index)"></i>
                <img :src="item" alt="">
              </div>
            </div>
            <div class="pic-add flex-h flex-cc" @click="picAddClick">
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
</div>
</template>

<script>
import Bscroll from 'better-scroll'
import axios from 'axios'
import ServiceHeader from './ServiceHeader'
import { Loading } from 'element-ui'

export default {
  name: 'rightUserWorkList',
  components: { ServiceHeader },
  props: {
    name: {
      type: String,
      default: ''
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
      page: 1,
      preventRepeat: true,
      over: false,
      workList: [],
      pageTitle: '用户工单',
      showEditWorkList: false,
      pageSize: 10,
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
      }
    }
  },
  created() {
    /**
     * 隐藏工单详情
     */
    this.$root.eventBus.$on('hideEditWorkList', (refresh, platForm) => {
      this.showEditWorkList = false
      if (refresh && platForm === 'pc') {
        // 刷新页面
        this.refreshData()
      }
    })
    /**
     * 获取工单列表
     */
    this.$root.eventBus.$on('getWorkList', () => {
      // 获取工单列表
      this.initBScroll()
      this.refreshData()
    })
  },
  mounted() {},
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
      if (this.$root.eventBus.showWidth >= 768) {
        this.showCreateWorkOrder = true
      }
    },
    /**
     * 修改工单
     */
    toEditWork(item, index) {
      if (this.$root.eventBus.showWidth < 768) {
        this.showEditWorkList = true
        this.$root.eventBus.$emit('updateWorkList', item, index)
      }
    },
    /**
     * 移动端返回
     */
    chatBack() {
      this.$root.eventBus.$emit('hideMobileMenu', { from: 'workList' })
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
            this.$toast(res.data.message)
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
    },
    /**
     * 删除图片
     */
    delPic(index) {
      this.orderPics.splice(index, 1)
    },
    /**
     * 确认生成工单
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
            this.refreshData()
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }
        })
    },
    /**
     * 选择图片
     */
    picAddClick() {
      this.$refs.addfileinput.click()
    },
    /**
     * 上传图片
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
  },
  watch: {
    openId() {
      if (this.tab === 1) {
        this.refreshData()
      }
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
      // text-align: center;
      // line-height: 72px;
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
      top: 92px;
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
        margin-right: 22px;
        margin-top: 12px;
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
    position: absolute;
    top: 115px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    .service-header {
      display: none;
    }
    .create-work {
      background: #f4f4f4;
      border: 2px solid #ededed;
      border-radius: 100px;
      height: 65px;
      width: 515px;
      margin: 24px auto 0;
      // text-align: center;
      // line-height: 65px;
      font-size: 24px;
      color: #353535;
      letter-spacing: 0;
      img {
        width: 22px;
        height: 22px;
        margin-right: 6px;
      }
    }
    .wrapper {
      position: absolute;
      top: 92px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .work-list {
      padding-bottom: 36px;
      margin: 36px 42px 0;
      border-bottom: 2px solid #e5e5e5;
      .left-dot {
        width: 8px;
        height: 8px;
        background: #353535;
        margin-right: 22px;
        margin-top: 12px;
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
            letter-spacing: 1px;
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
            img {
              width: 23px;
              height: 23px;
              margin-right: 6px;
            }
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
      text-align: center;
      position: absolute;
      top: 40%;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .btns-hide {
      display: none;
    }
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
    .pic-upload {
      flex-wrap: wrap;
      .pics {
        .item {
          position: relative;
          width: 160px;
          height: 160px;
          margin-right: 20px;
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
</style>
