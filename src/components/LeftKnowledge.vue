<template>
  <div class="flex-h left-knowledge">
    <!--  新增知识库 -->
    <el-dialog title="新增知识库" :visible.sync="addKnowledgeShow">
      <el-form :model="knowledgeForm">
         <el-form-item label="类型">
          <el-select v-model="knowledgeForm.category" placeholder="请选择类型">
            <el-option v-for="(item,index) in categories" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="问题" :label-width="formLabelWidth">
          <el-input v-model="knowledgeForm.problem" auto-complete="off" placeholder="请输入问题"></el-input>
        </el-form-item>
        
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="3" v-model="knowledgeForm.answer" auto-complete="off" placeholder="请输入答案"></el-input>
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

    <!--  编辑知识库 -->
    <el-dialog title="编辑知识库" :visible.sync="updateKnowledgeShow">
      <el-form :model="knowledgeForm">
         <el-form-item label="类型">
          <el-select v-model="knowledgeForm.category" placeholder="请选择类型">
            <el-option v-for="(item,index) in categories" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="问题" :label-width="formLabelWidth">
          <el-input v-model="knowledgeForm.problem" auto-complete="off" placeholder="请输入问题"></el-input>
        </el-form-item>
        
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="3" v-model="knowledgeForm.answer" auto-complete="off" placeholder="请输入答案"></el-input>
        </el-form-item>

        <el-form-item label="创建人" :label-width="formLabelWidth">
          <el-input v-model="knowledgeForm.creator" auto-complete="off"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateKnowledgeShow = false">取 消</el-button>
        <el-button type="primary" @click="updateKnowledge">确 定</el-button>
      </div>
    </el-dialog>

    <!--  新增分类 -->
    <el-dialog title="新增类别" :visible.sync="addCategoryShow">
      <el-form :model="categoryForm">
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-input v-model="categoryForm.name" auto-complete="off" maxlength="5"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryShow = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 侧边分类 -->
    <div class="menu">
      <div class="list">
        <div class="item flex-h flex-cc" :class="{'active': categoryItemIndex===0}" @click="categoryItemClick('')">
          <div class="name">所有知识库</div>
          <div class="number">({{totalCategory}})</div>
        </div>
        <div class="item flex-h flex-cc" v-for="(item,index) in categories" :class="{'active': categoryItemIndex===(index+1)}"  @click.stop="categoryItemClick(item,index+1)">
          <div class="del-icon" @click.stop="categoryItemDel(item.name,item.cnum)">
            <i class="el-icon-delete"></i>
          </div>
          <div class="name">{{item.name}}</div>
          <div class="number">({{item.cnum}})</div>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="content flex-1 flex-v">
      <div class="head flex-h flex-bc">
        <Search v-model="searchName" placeholder="搜索知识"/>
        <div class="right-handle flex-h flex-cc">
          <div class="add-category" @click="addCategoryClick">新建分类</div>
          <div class="add-knowledge" @click="addKnowledgeClick">新建知识</div>
        </div>
      </div>
      <div class="table-con">
        <el-table
        :data="knowledges"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
          <el-table-column
            prop="problem"
            label="知识名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="category"
            label="类型"
            
            width="180">
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="最近编辑时间"
            sortable
           >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="updateKnowledgeClick(scope.$index, scope.row)"
                type="text"
                size="small">
                编辑
              </el-button>
              <el-button
                @click.native.prevent="deleteKnowledgeClick(scope.$index, scope.row)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination" v-show="knowledgeTotal>0">
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size = "pageSize"
            :total="knowledgeTotal">
          </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import Search from './Search'
// import Table from 'element-ui'
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'leftknowledge',
  components: { Search },
  props: {},
  data() {
    return {
      searchName: '',
      startPage: 1,
      pageSize: 8,
      knowledgeTotal: 0,
      addKnowledgeShow: false,
      updateKnowledgeShow: false,
      addCategoryShow: false,
      formLabelWidth: '500',
      // 当前分类名称,默认全部
      currentCategory: '',
      // 当前选中分类index,默认全部
      categoryItemIndex: 0,
      knowledgeForm: {
        category: '',
        problem: '',
        answer: '',
        creator: '',
        region: ''
      },
      categoryForm: {
        name: ''
      },
      updateRow: {},
      categories: [],
      totalCategory: 0,
      knowledges: []
    }
  },
  created() {
    // 查询知识
    this.searchCategory()

    // 查询知识
    this.searchKnowledge()
  },
  mounted() {},
  methods: {
    categoryItemDel(name, num) {
      console.log('num', num, name)
      if (+num === 0) {
        this.$confirm('确认删除？')
          .then(_ => {
            axios
              .post(
                'http://cs.velo.top/customerService/csapi/delknowledgecategory',
                {
                  name
                }
              )
              .then(_ => {
                if (_.data.status === 0) {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                  this.addKnowledgeShow = false
                } else {
                  this.$message({
                    message: '删除失败',
                    type: 'error'
                  })
                }

                // 更新所有分类
                this.searchCategory()
                console.log('LeftKnowledgeAddCategory=>addKnowledge', _)
              })
          })
          .catch(_ => {})
      } else {
        this.$message('此分类不能删除')
      }
    },
    /**
     * 分页页码改变
     */
    handleCurrentChange(currentPage) {
      this.startPage = currentPage
      this.searchKnowledge()
    },
    /**
     * 添加知识确认按钮
     */
    addKnowledge() {
      console.log('this.categoryForm', this.knowledgeForm)
      if (this.knowledgeForm.category.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写分类'
        })
        return
      }
      if (this.knowledgeForm.problem.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写问题'
        })
        return
      }
      if (this.knowledgeForm.answer.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写答案'
        })
        return
      }
      if (this.knowledgeForm.creator.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写创建人'
        })
        return
      }
      axios
        .post('http://cs.velo.top/customerService/csapi/addknowledge', {
          category: this.knowledgeForm.category,
          problem: this.knowledgeForm.problem,
          answer: this.knowledgeForm.answer,
          creator: this.knowledgeForm.creator
        })
        .then(_ => {
          if (_.data.status === 0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.addKnowledgeShow = false
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }

          // 更新一遍所有知识
          this.searchKnowledge()

          // 更新所有分类
          this.searchCategory()
          console.log('LeftKnowledgeAddCategory=>addKnowledge', _)
        })
      this.knowledgeForm = {
        category: '',
        problem: '',
        answer: '',
        creator: ''
      }
    },
    /**
     * 修改知识内容
     */
    updateKnowledgeClick(index, row) {
      console.log('LeftKnowledgeAddCategory=>updateKnowledge', index, row)
      this.updateKnowledgeShow = true
      this.updateRow = row
      this.knowledgeForm = row
    },
    /**
     * 修改知识按钮确定
     */
    updateKnowledge() {
      console.log(
        'LeftKnowledge=>updateKnowledge=>this.knowledgeForm',
        this.knowledgeForm
      )
      axios
        .post('http://cs.velo.top/customerService/csapi/updateknowledge', {
          category: this.knowledgeForm.category,
          problem: this.knowledgeForm.problem,
          answer: this.knowledgeForm.answer,
          creator: this.knowledgeForm.creator,
          id: this.updateRow.id
        })
        .then(_ => {
          if (_.data.status === 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.updateKnowledgeShow = false
          } else {
            this.$message({
              message: '修改失败',
              type: 'error'
            })
          }

          // 更新下分类
          this.searchCategory()

          // 更新一遍所有知识
          this.searchKnowledge()
          console.log('LeftKnowledgeAddCategory=>updateKnowledgeShow=>_', _)
        })
    },
    /**
     * 删除知识内容
     */
    deleteKnowledgeClick(index, row) {
      console.log('LeftKnowledgeAddCategory=>deleteKnowledgeClick', index, row)
      this.$confirm('确认删除？').then(_ => {
        axios
          .post('http://cs.velo.top/customerService/csapi/delknowledge', {
            id: row.id
          })
          .then(_ => {
            if (_.data.status === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })

              // 更新一遍所有知识
              this.searchKnowledge()

              // 更新一遍分类
              this.searchCategory()
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }

            console.log('LeftKnowledgeAddCategory=>updateKnowledgeShow=>_', _)
          })
      })
    },

    /**
     * 查询知识
     */
    searchCategory() {
      axios
        .post(
          'http://cs.velo.top/customerService/csapi/selectKnowledgeCategory'
        )
        .then(_ => {
          if (_.data.status === 0) {
            this.categories = _.data.data

            // 过滤出分类的总数
            this.filterTotalCategory(_.data.data)

            // 处理新建知识库初始化分类
            this.initCategory(_.data.data)
          }
          console.log('LeftKnowledgeAddCategory=>searchCategory', _)
        })
    },
    /**
     * 每个分类item的点击
     */
    categoryItemClick(item, index) {
      console.log('LeftKnowledgeAddCategory=>categoryItemClick=>item', item)
      // 重置分页开始页
      this.startPage = 1
      if (typeof item === 'string') {
        this.currentCategory = ''
        this.categoryItemIndex = 0
      } else {
        this.currentCategory = item.name
        this.categoryItemIndex = index
      }
      this.searchKnowledge()
    },
    filterTotalCategory(arr = []) {
      // 重置分类总数
      this.totalCategory = 0
      arr.map(item => {
        this.totalCategory += item.cnum
      })
    },
    /**
     * 查询知识
     */
    searchKnowledge(
      problem = this.searchName,
      category = this.currentCategory,
      pageSize = this.pageSize,
      startPage = this.startPage
    ) {
      console.log(
        'LeftKnowledgeAddCategory=>searchKnowledge=参数',
        problem,
        category,
        pageSize,
        startPage
      )
      axios
        .post('http://cs.velo.top/customerService/csapi/searchKnowledge', {
          problem,
          category,
          pageSize,
          startPage
        })
        .then(_ => {
          if (_.data.status === 0) {
            this.knowledges = _.data.data.list
            this.knowledgeTotal = _.data.data.total
          }
          console.log('LeftKnowledgeAddCategory=>searchKnowledge', _)
        })
    },
    /**
     * 初始化新建知识库的时候的分类
     */
    initCategory(categories) {
      this.knowledgeForm.category = categories[0].name
      this.knowledgeForm.creator = this.getWaiterName()
    },
    getWaiterName() {
      const waiterInfo = JSON.parse(localStorage.getItem('waiterInfo'))
      return waiterInfo ? waiterInfo.name : ''
    },
    /**
     * 添加分类确认按钮
     */
    addCategory() {
      if (this.categoryForm.name.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写类型'
        })
        return
      }
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

            // 更新分类
            this.searchCategory()
          } else {
            this.$message({
              message: _.data.message,
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
      this.knowledgeForm = {
        category: '',
        problem: '',
        answer: '',
        creator: '',
        region: ''
      }
      this.knowledgeForm.creator = this.getWaiterName()
    },
    /**
     * 搜索知识输入
     */
    toSearchKnowledge: _.debounce(function(val) {
      this.problem = val
      this.searchKnowledge()
    }, 500)
  },
  watch: {
    searchName(val, oval) {
      this.toSearchKnowledge(val)
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
      border-right: 2px solid #e5e5e5;
      width: 460px;
      .list {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        overflow: scroll;
        .item {
          position: relative;
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
          .del-icon {
            display: none;
            position: absolute;
            left: 0;
            top: 0;
            cursor: pointer;
          }
        }
        .item:hover {
          .del-icon {
            display: block;
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
