<template>
  <div id="right-knowledge-wrap">
    <service-header  @chatBack="chatBack" :back="true" class="service-header" :title='pageTitle' :more="false"></service-header>
    <search v-model="searchKnowledge" @focus="focus"></search>
    <div class="typeList" v-show="!showSearchResult">
      <div class="typeTitle">类别</div>
      <div class="flex-h list">
        <!-- active类待定 -->
        <div class="type" v-for="item,index in typeList" @click.stop="selectType(item,index)">{{item}}</div>
      </div>
    </div>
    <div class='result' v-show="showSearchResult">
      <div class="wrapper " v-if="knowledgeList.length>0">
        <div class="work-list flex-h" v-for="item in knowledgeList">
          <div class="left-dot"></div>
          <div class="right-wrap flex-1 flex-v">
            <div class="question">问题：asfadf</div>
            <div class="answer">asfadf</div>
            <div class="flex-h sendBtn">
              <div class="sendAnswer">发送答案</div>
            </div>
          </div>
        </div>
        <div class="nomore">没有更多答案了</div>
      </div>
      <div class="noList" v-else>没有相关结果</div>
    </div>
  </div>
</template>

<script>
import Search from './Search'
import axios from 'axios'
import ServiceHeader from './ServiceHeader'

export default {
  name: 'rightUserWorkList',
  components: { Search, ServiceHeader },
  props: {},
  data() {
    return {
      page: 1,
      preventRepeat: true,
      over: false,
      showMoreBtn: true,
      knowledgeList: [1, 2, 3],
      searchKnowledge: '',
      showSearchResult: false,
      typeList: ['111', '222', '333'],
      typeIndex: 0,
      pageTitle: '知识库'
    }
  },
  created() {
    this.getKnowledgeCategory()
  },
  mounted() {},
  methods: {
    getKnowledgeCategory() {},
    selectType(type, index) {
      // 调用搜索接口
      console.log(type, index)
      this.showSearchResult = true
      axios
        .post(
          'http://cs.velo.top/customerService/csapi/selectKnowledgeCategory',
          {}
        )
        .then(res => {})
    },
    focus() {
      this.showSearchResult = false
    },
    chatBack() {
      // 返回
      this.$root.eventBus.$emit('hideMobileMenu', {
        from: 'knowledge'
      })
    },
    search() {
      axios.post(
        'http://cs.velo.top/customerService/csapi/selectKnowledgeCategory'
      )
    }
  },
  watch: {
    searchKnowledge(val, oldVal) {
      axios.post('http://cs.velo.top/customerService/csapi/selectKnowledge', {})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
          width: 8px;
          height: 8px;
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
    }
  }
}
</style>
