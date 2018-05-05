<template>
  <div class="flex-h left-knowledge">
    <!--  新增知识库 -->
    <el-dialog title="新增知识库" :visible.sync="addKnowledgeShow">
      <el-form :model="knowledgeForm">
         <el-form-item label="关键字">
          <el-select v-model="knowledgeForm.category" placeholder="请选择关键字">
            <el-option  v-for="item in categories" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="问题" :label-width="formLabelWidth">
          <el-input v-model="knowledgeForm.problem" auto-complete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-input v-model="knowledgeForm.answer" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="创建人" :label-width="formLabelWidth">
          <el-input v-model="knowledgeForm.creator" auto-complete="off"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addKnowledgeShow = false">取 消</el-button>
        <el-button type="primary" @click="addKnowledge">确 定</el-button>
      </div>
    </el-dialog>
    <!--  新增分类 -->
    <el-dialog title="新增类别" :visible.sync="addCategoryShow">
      <el-form :model="categoryForm">
        <el-form-item label="关键字" :label-width="formLabelWidth">
          <el-input v-model="categoryForm.name" auto-complete="off"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryShow = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 侧边 -->
    <div class="menu">
      <Search v-model="searchName" placeholder="搜索知识"/>
      <div class="list">
        <div class="item active flex-h flex-cc">
          <div class="name">所有知识库</div>
          <div class="number">200</div>
        </div>
        <div class="item flex-h flex-cc" v-for="item in categories">
          <div class="name">{{item.name}}</div>
          <div class="number">12</div>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="content flex-1 flex-v">
      <div class="head flex-h flex-bc">
        <div class="name">分类2</div>
        <div class="right-handle flex-h flex-cc">
          <div class="add-category" @click="addCategoryClick">新建分类</div>
          <div class="add-knowledge" @click="addKnowledgeClick">新建知识</div>
        </div>
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
// import Table from 'element-ui'
import axios from 'axios'

export default {
  name: 'leftknowledge',
  components: { Search },
  props: {},
  data() {
    return {
      searchName: '',
      addKnowledgeShow: false,
      addCategoryShow: false,
      formLabelWidth: '500',
      knowledgeForm: {
        keyword: '',
        problem: '',
        answer: '',
        creator: ''
      },
      categoryForm: {
        name: ''
      },
      categories: [],
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
      ]
    }
  },
  created() {
    // 查询分类
    this.searchCategory()
  },
  mounted() {},
  methods: {
    /**
     * 添加分类
     */
    addKnowledge() {
      axios
        .post('http://cs.velo.top/customerService/csapi/addknowledge', {
          category: this.categoryForm.category,
          problem: this.categoryForm.problem,
          answer: this.categoryForm.answer,
          creator: this.categoryForm.creator
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
          console.log('LeftKnowledgeAddCategory=>addKnowledge', _)
        })
    },
    /**
     * 查询分类
     */
    searchCategory() {
      axios
        .post(
          'http://cs.velo.top/customerService/csapi/selectKnowledgeCategory'
        )
        .then(_ => {
          if (_.data.status === 0) {
            this.categories = _.data.data
          }

          console.log('LeftKnowledgeAddCategory=>searchCategory', _)
        })
    },
    /**
     * 添加分类确认按钮
     */
    addCategory() {
      axios
        .post('http://cs.velo.top/customerService/csapi/addknowledgecategory', {
          name: this.categoryForm.name
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
          console.log('LeftKnowledgeAddCategory=>addCategory', _)
        })
    },
    addCategoryClick() {
      this.addCategoryShow = true
    },
    addKnowledgeClick() {
      this.addKnowledgeShow = true
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
  .left-knowledge {
  }
}

//pc端
@media screen and (min-width: 768px) {
  .left-knowledge {
    background: #fff;
    height: 100%;
    .menu {
      position: relative;
      width: 460px;
      .list {
        position: absolute;
        left: 0;
        right: 0;
        top: 112px;
        bottom: 0;
        overflow: scroll;
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
        .add-category,
        .add-knowledge {
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
