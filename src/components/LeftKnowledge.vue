<template>
  <div class="flex-h left-knowledge">
    <!--  新增知识库 -->
    <el-dialog title="新增知识库" :visible.sync="addKnowledgeShow">
      <el-form :model="knowledgeForm">
        <el-form-item label="关键字" :label-width="formLabelWidth">
          <el-input v-model="knowledgeForm.keyword" auto-complete="off"></el-input>
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
        <el-button type="primary" @click="addKnowledgeShow = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--  新增分类 -->
    <el-dialog title="新增类别" :visible.sync="addCategoryShow">
      <el-form :model="categoryForm">
        <el-form-item label="关键字" :label-width="formLabelWidth">
          <el-input v-model="categoryForm.keyword" auto-complete="off"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryShow = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryShow = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 侧边 -->
    <div class="menu">
      <Search v-model="searchName"/>
      <div class="list">
        <div class="item active flex-h flex-cc">
          <div class="name">所有知识库</div>
          <div class="number">200</div>
        </div>
        <div class="item flex-h flex-cc">
          <div class="name">分类1</div>
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
        keyword: ''
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
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {
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
      .list {
        .item {
          .name {
          }
          .number {
          }
        }
      }
    }
    .content {
      .head {
        .name {
        }
        .addorder {
        }
      }
      .pagination {
        margin: 20px 0;
      }
    }
  }
}
</style>
