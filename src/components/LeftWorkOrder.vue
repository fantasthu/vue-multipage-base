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
                <el-option label="已处理" value="hasDone"></el-option>
                <el-option label="未处理" value="noDone"></el-option>
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
            <div class="item" v-for="item in orderPics">
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
        <el-button @click="addCategoryShow = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryShow = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 侧边 -->
    <div class="menu">
      <Search v-model="searchName" placeholder = "搜索工单名"/>
      <div class="list">
        <div class="item active flex-h flex-cc">
          <div class="name">所有工单</div>
          <div class="number">(12)</div>
        </div>
        <div class="item flex-h flex-cc">
          <div class="name">所有工单</div>
          <div class="number">(12)</div>
        </div>
      </div>
    </div>
    <div class="content flex-1 flex-v">
      <div class="head flex-h flex-bc">
        <div class="name">所有工单</div>
        <div class="addorder" @click="addOrderClick">新建工单</div>
      </div>
      <div class="table-con">
        <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
          <el-table-column
            prop="name"
            label="工单名称"
            sortable
            width="180">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            sortable
            width="180">
          </el-table-column>
          <el-table-column
            prop="user"
            label="用户"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            prop="customerService"
            label="受理客服"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData4)"
                type="text"
                size="small">
                编辑
              </el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData4)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="100">
          </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import Search from './Search'
import { Loading } from 'element-ui'
export default {
  name: 'leftworkorder',
  components: { Search },
  props: {},
  data() {
    return {
      orderPics: [],
      searchName: '',
      formLabelWidth: '500',
      orderForm: {
        customer: '',
        status: '',
        identity: '',
        ordernum: ''
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      addOrderShow: false
    }
  },
  created() {},
  mounted() {},
  methods: {
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
    addOrderClick() {
      this.addOrderShow = true
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
            width: 160px;
            height: 160px;
            margin-right: 20px;
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
      .list {
        border-top: 2px solid #e5e5e5;
        .item {
          height: 118px;
          font-family: PingFang-SC-Medium;
          font-size: 30px;
          color: #b2b2b2;
          letter-spacing: 0;
          text-align: center;
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
