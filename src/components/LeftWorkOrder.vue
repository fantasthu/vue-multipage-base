<template>
  <div class="flex-h left-work-order">
     <!--  新增工单 -->
    <el-dialog title="新增工单" :visible.sync="addOrderShow" class="add-card">
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
        <el-button @click="addOrderShow = false">取 消</el-button>
        <el-button type="primary" @click="addOrderSubmit">确 定</el-button>
      </div>
    </el-dialog>

     <!--  编辑工单 -->
    <el-dialog title="编辑工单" :visible.sync="updateOrderShow" class="add-card">
      <el-form :model="orderForm">
        <div class="top flex-v">
          <div class="column flex-h">
            <el-form-item class="flex-1" label="所属客服" :label-width="formLabelWidth">
              <el-input v-model="orderForm.customer" auto-complete="off"></el-input>
            </el-form-item>
            
            <!-- <el-form-item class="flex-1" label="处理状态" :label-width="formLabelWidth"> -->
              <el-select v-model="orderForm.status" placeholder="请选择">
                <el-option label="已处理" value="已处理" key="1"></el-option>
                <el-option label="未处理" value="未处理" key="2"></el-option>
              </el-select>
            <!-- </el-form-item> -->

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
          <el-input v-model="orderForm.ordertype" auto-complete="off"></el-input>
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
        <el-button @click="updateOrderShow = false">取 消</el-button>
        <el-button type="primary" @click="updateOrderSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 侧边 -->
    <div class="menu">
      <div class="list">
        <div class="item  flex-h flex-cc" :class="{'active':orderCategoryIndex===0}" @click="orderCategoryItemClick('',0)">
          <div class="name">所有工单</div>
          <div class="number">({{allOrderCategories}})</div>
        </div>
        <div class="item flex-h flex-cc" v-for="(item,index) in orderCategories" :class="{'active':orderCategoryIndex===index+1}" @click="orderCategoryItemClick(item,index+1)">
          <div class="name">{{item.ordertype}}</div>
          <div class="number">({{item.cnum}})</div>
        </div>
      </div>
    </div>
    <div class="content flex-1 flex-v">
      <div class="head flex-h flex-bc">
        <Search v-model="searchName" placeholder = "搜索工单名"/>
        <div class="addorder" @click="addOrderClick">新建工单</div>
      </div>
      <div class="table-con">
        <el-table
        :data="workorders"
        style="width: 100%"
       
        >
          <el-table-column
            prop="title"
            label="工单名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="ordertype"
            label="类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            sortable
            width="180">
          </el-table-column>
          <el-table-column
            prop="identity"
            label="用户"
          >
          </el-table-column>
          <el-table-column
            prop="customer"
            label="受理客服"
            >
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="时间"
            width="180"
            sortable
           >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="updateWorkOrderClick(scope.$index, scope.row)"
                type="text"
                size="small">
                编辑
              </el-button>
              <el-button
                @click.native.prevent="deleteWorkOrder(scope.$index, scope.row)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination" v-show="totalWorkOrders>0">
          <el-pagination
            background
            :page-size="pageSize"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="totalWorkOrders">
          </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import Search from './Search'
import { Loading } from 'element-ui'
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'leftworkorder',
  components: { Search },
  props: {},
  data() {
    return {
      startPage: 1,
      pageSize: 8,
      menuOrdertype: '',
      orderPics: [],
      searchName: '',
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
      workorders: [],
      totalWorkOrders: 0,
      orderCategories: [],
      addOrderShow: false,
      updateOrderShow: false,
      // 工单分类index,默认为所有
      orderCategoryIndex: 0,
      // 所有工单数量
      allOrderCategories: 0
    }
  },
  created() {
    // 查询工单的分类,现阶段暂时,客诉和建议
    this.searchOrderCategory()

    // 查询所有工单
    this.searchWorkOrder()

    // 监听eventbus事件
    this.initEvent()
  },
  mounted() {},
  watch: {
    searchName(val, oval) {
      this.toSearchWorkOrder(val)
    }
  },
  methods: {
    initEvent() {
      this.$root.eventBus.$on('addPcWorkOrder', () => {
        this.addOrderShow = true
      })
    },
    toSearchWorkOrder: _.debounce(function(val) {
      this.searchName = val
      this.searchWorkOrder()
    }, 500),
    /**
     * 删除图片
     */
    delPic(index) {
      this.orderPics.splice(index, 1)
    },
    /**
     * 查询工单列表
     */
    searchWorkOrder() {
      axios
        .post('http://cs.velo.top/customerService/csapi/searchworkorder', {
          startPage: this.startPage,
          pageSize: this.pageSize,
          ordertype: this.menuOrdertype,
          title: this.searchName
        })
        .then(_ => {
          if (_.data.status === 0) {
            this.workorders = _.data.data.list
            this.totalWorkOrders = _.data.data.total
          }

          console.log('LeftWorkOrder=>searchWorkOrder', _)
        })
    },
    /**
     * 工单查询分页
     */
    handleCurrentChange(currentIndex) {
      this.startPage = currentIndex
      this.searchWorkOrder()
    },
    /**
     * 删除工单
     */
    deleteWorkOrder(index, data) {
      const id = data.id
      axios
        .post('http://cs.velo.top/customerService/csapi/delworkorder', {
          id
        })
        .then(_ => {
          if (_.data.status === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.searchWorkOrder()
            this.searchOrderCategory()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }

          console.log('LeftWorkOrder=>searchWorkOrder', _)
        })
    },
    /**
     * 查询左侧工单分类列表
     */
    searchOrderCategory() {
      axios
        .post('http://cs.velo.top/customerService/csapi/searchordercategory')
        .then(_ => {
          if (_.data.status === 0) {
            this.orderCategories = _.data.data
            this.filterOrderCategories(_.data.data)
          }

          console.log('LeftWorkOrder=>searchOrderCategory', _)
        })
    },
    filterOrderCategories(arr = []) {
      this.allOrderCategories = 0
      arr.map(item => {
        this.allOrderCategories += item.cnum
      })
    },
    /**
     * 分类item点击
     */
    orderCategoryItemClick(item, index) {
      this.orderCategoryIndex = index
      this.startPage = 1
      if (typeof item === 'string') {
        this.menuOrdertype = ''
      } else {
        this.menuOrdertype = item.ordertype
      }
      this.searchWorkOrder()
    },
    addOrderClick() {
      this.addOrderShow = true
      this.orderForm = {
        customer: '',
        ordertype: '',
        status: '',
        identity: '',
        ordernum: '',
        describe: '',
        title: ''
      }
      this.orderPics = []
    },
    updateWorkOrderClick(index, item) {
      this.updateOrderShow = true
      this.updateRowData = item
      console.log('item', item)
      this.orderPics = JSON.parse(item.imgurls || '[]')
      this.orderForm = item
    },
    updateOrderSubmit() {
      this.orderForm.imgurls = JSON.stringify(this.orderPics || '')
      axios
        .post('http://cs.velo.top/customerService/csapi/updateworkorder', {
          customer: this.orderForm.customer,
          status: this.orderForm.status,
          identity: this.orderForm.identity,
          ordernum: this.orderForm.ordernum,
          ordertype: this.orderForm.ordertype,
          title: this.orderForm.title,
          des: this.orderForm.describe,
          imgurls: this.orderForm.imgurls,
          id: this.updateRowData.id
        })
        .then(_ => {
          if (_.data.status === 0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.addCategoryShow = false
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }
        })
    },
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
          imgurls: this.orderForm.imgurls
        })
        .then(_ => {
          if (_.data.status === 0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.addOrderShow = false
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }

          // 更新一遍所有知识
          this.searchWorkOrder()

          // 更新所有分类
          this.searchOrderCategory()
          console.log('LeftKnowledgeAddCategory=>addOrderSubmit', _)
        })
      this.knowledgeForm = {
        category: '',
        problem: '',
        answer: '',
        creator: ''
      }
    },
    picAddClick() {
      this.$refs.addfileinput.click()
    },
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
    },
    formatter(row, column) {
      return row.address
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// 手机端
@media (max-width: 768px) {
  .left-work-order {
  }
}

//pc端
@media screen and (min-width: 768px) {
  .left-work-order {
    background: #fff;
    height: 100%;
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
}
</style>
