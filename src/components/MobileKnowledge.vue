<template>
  <div id="right-knowledge-wrap">
    <service-header  @chatBack="chatBack" :back="true" class="service-header" :title='pageTitle' :more="false"></service-header>
    <search v-model="searchKnowledge" @focus="focus" placeholder="请搜索"></search>
    <div class="typeList" v-show="!showSearchResult">
      <div class="typeTitle">类别</div>
      <div class="flex-h list">
        <!-- active类待定 -->
        <div class="type" v-for="item,index in categories" @click.stop="selectType(item.name,index)">{{item.name}}</div>
      </div>
    </div>
    <div ref="result" class='result' v-show="showSearchResult">
      <div class="wrapper " v-if="knowledgeList.length>0">
        <div class="work-list flex-h" v-for="item in knowledgeList">
          <div class="left-dot"></div>
          <div class="right-wrap flex-1 flex-v">
            <div class="question">问题：{{item.problem}}</div>
            <div class="answer">{{item.answer}}</div>
            <div class="flex-h sendBtn">
              <div class="sendAnswer" @click.stop="sendAnswer(item.answer)">发送答案</div>
            </div>
          </div>
        </div>
        <div class="nomore" v-show="over">没有更多答案了</div>
        <div class="slot"></div>
      </div>
      <div class="noList" v-else>没有相关结果</div>
    </div>
  </div>
</template>

<script>
import Search from './Search'
import axios from 'axios'
import ServiceHeader from './ServiceHeader'
import Bscroll from 'better-scroll'
import _ from 'lodash'

export default {
  name: 'mobileKnowledge',
  components: { Search, ServiceHeader },
  props: {},
  data() {
    return {
      page: 1,
      preventRepeat: true,
      over: false,
      showMoreBtn: true,
      knowledgeList: [],
      searchKnowledge: '',
      showSearchResult: false,
      typeIndex: 0,
      pageTitle: '知识库',
      categories: [],
      search: '', // 请求接口时传入的参数
      pageSize: 10
    }
  },
  created() {
    this.$root.eventBus.$on('getMobileKnowledgeList', () => {
      this.page = 1
      this.over = false
      this.knowledgeList = []
      this.categories = []
      this.showSearchResult = false
      this.search = ''
      this.searchCategory()
    })
  },
  mounted() {
    this.scroll = new Bscroll(this.$refs.result, {
      mouseWheel: true,
      click: true,
      tap: true,
      preventDefault: true,
      preventDefaultException: { className: /(^|\s)text(\s|$)/ },
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
          this.checkKnowledgeList()

          setTimeout(() => {
            this.preventRepeat = true
          }, 500)
        }
      })
    })
  },
  methods: {
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
     * 查询知识列表
     */
    checkKnowledgeList() {
      axios
        .post('http://cs.velo.top/customerService/csapi/searchKnowledge', {
          problem: this.search,
          category: this.category,
          startPage: this.page,
          pageSize: this.pageSize
        })
        .then(res => {
          console.log('res', res)
          if (res.data.status === 0) {
            this.knowledgeList = this.knowledgeList.concat(res.data.data.list)
            if (res.data.data.total <= this.page * this.pageSize) {
              this.over = true
            }
            this.page++
          } else {
            this.$toast(res.data.message)
          }
          this.scroll.refresh()
        })
        .catch(() => {
          this.$toast('网络错误')
        })
    },
    /**
     * 点击分类查看
     */
    selectType(type = '', index) {
      // 调用搜索接口
      this.page = 1
      this.over = false
      this.search = ''
      this.category = type
      this.showSearchResult = true
      this.knowledgeList = []
      this.checkKnowledgeList()
    },
    /**
     * 获取焦点
     */
    focus() {
      this.showSearchResult = false
      this.category = ''
    },
    /**
     * 返回
     */
    chatBack() {
      // 返回
      this.$root.eventBus.$emit('hideMobileMenu', {
        from: 'knowledge'
      })
    },
    /**
     * 发送答案
     */
    sendAnswer(answer) {
      this.$root.eventBus.$emit('sendAnswer', answer)
      if (this.$root.eventBus.showWidth < 768) {
        // 隐藏知识库
        this.chatBack()
      }
    },
    /**
     * debounce
     */
    doSearchKnowledge: _.debounce(function(val) {
      this.search = val
      if (val !== '') {
        this.page = 1
        this.over = false
        this.showSearchResult = true
        this.knowledgeList = []
        this.checkKnowledgeList()
      } else {
        this.showSearchResult = false
      }
    }, 500)
  },
  watch: {
    searchKnowledge(val, oldVal) {
      this.doSearchKnowledge(val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.slot {
  height: 40px;
}
// 手机端
@media (max-width: 768px) {
  #right-knowledge-wrap {
    position: absolute;
    top: 88px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 99999;
    background: #fff;
    .typeList {
      margin-left: 42px;
      .typeTitle {
        font-size: 28px;
        color: #353535;
        letter-spacing: 0;
        margin-top: 30px;
        margin-bottom: 42px;
      }
      .list {
        flex-wrap: wrap;

        .type {
          height: 54px;
          line-height: 54px;
          font-size: 26px;
          color: rgba(0, 0, 0, 0.87);
          letter-spacing: 3px;
          padding: 0 32px;
          border-radius: 100px;
          margin-right: 24px;
          margin-bottom: 24px;
          box-sizing: border-box;
          border: 1px solid #dddddd;
        }
        .active {
          background: #ffe654;
          color: #000;
          border: 0;
        }
      }
    }
    .result {
      position: absolute;
      top: 110px;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;

      .work-list:nth-child(1) {
        margin-top: 16px;
      }
      // margin: 0 24;
      .work-list {
        padding: 0 42px 24px;
        margin-top: 36px;
        border-bottom: 2px solid #e5e5e5;
        .left-dot {
          width: 12px;
          height: 12px;
          background: #ff5b21;
          margin-right: 30px;
          margin-top: 18px;
        }
        .right-wrap {
          .question {
            color: #353535;
            line-height: 48px;
            font-size: 28px;
            letter-spacing: 3px;
            text-align: justify;
          }
          .answer {
            font-size: 26px;
            color: #888888;
            letter-spacing: 3px;
            line-height: 48px;
            text-align: justify;
            margin-top: 32px;
          }
          .sendBtn {
            margin-top: 12px;
            justify-content: flex-end;
            .sendAnswer {
              width: 168px;
              height: 56px;
              background: #ffe654;
              border-radius: 100px;
              font-size: 24px;
              color: #000000;
              letter-spacing: 3px;
              text-align: center;
              line-height: 56px;
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
        position: absolute;
        top: 40%;
        width: 100%;
        text-align: center;
      }
    }
  }
}

//pc端
@media screen and (min-width: 768px) {
  #right-knowledge-wrap {
    position: absolute;
    top: 115px;
    bottom: 0;
    left: 24px;
    right: 24px;
    overflow: hidden;
    .service-header {
      display: none;
    }
    .typeList {
      .typeTitle {
        font-size: 28px;
        color: #353535;
        letter-spacing: 0;
        margin-top: 16px;
        margin-bottom: 42px;
      }
      .list {
        flex-wrap: wrap;
        .type {
          height: 54px;
          line-height: 54px;
          font-size: 24px;
          color: #353535;
          letter-spacing: 3px;
          padding: 0 32px;
          border: 2px solid #dddddd;
          border-radius: 100px;
          margin-right: 24px;
          margin-bottom: 24px;
          box-sizing: border-box;
        }
        .active {
          background: #ffe654;
          color: #000;
          border: 0;
        }
      }
    }
    .result {
      position: absolute;
      top: 110px;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .work-list:nth-child(1) {
      margin-top: 16px;
    }
    // margin: 0 24;
    .work-list {
      padding: 0 18px 24px;
      margin-top: 36px;
      border-bottom: 2px solid #e5e5e5;
      .left-dot {
        width: 8px;
        height: 8px;
        background: #ff5b21;
        margin-right: 30px;
        margin-top: 18px;
      }
      .right-wrap {
        .question {
          color: #353535;
          line-height: 33px;
          font-size: 24px;
          letter-spacing: 2px;
          text-align: justify;
        }
        .answer {
          font-size: 24px;
          color: #888888;
          letter-spacing: 2px;
          text-align: justify;
          margin-top: 36px;
        }
        .sendBtn {
          margin-top: 24px;
          justify-content: flex-end;
          .sendAnswer {
            width: 168px;
            height: 56px;
            background: #ffe654;
            border-radius: 100px;
            font-size: 24px;
            color: #000000;
            letter-spacing: 3px;
            text-align: center;
            line-height: 56px;
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
      position: absolute;
      top: 40%;
      width: 100%;
      text-align: center;
    }
  }
}
</style>
