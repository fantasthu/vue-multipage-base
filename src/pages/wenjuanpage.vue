<template>
  <div class="wenjuanpage">
    <div class="hint flex-v flex-cc">
      <h3 class="title">友情提示</h3>
      <div class="line"></div>
      <p class="p1">好吃就是好吃,不好吃就是不好吃</p>
      <p class="p2">请填写您最真实的试吃体验</p>
      <img :src="logo" alt="" class="logo">
    </div>
    <div class="question-container">
      <div class="name">
        <mt-field label="1.姓名:" placeholder="" v-model="name"></mt-field>
      </div>
      <div class="w-nickname">
        <mt-field label="2.微信昵称:" placeholder="" v-model="wnickName"></mt-field>
      </div>
      <div class="hometown">
        <mt-field label="3.家乡:" placeholder="" v-model="hometown"></mt-field>
      </div>

      <div class="sex">
        <mt-radio title="4.性别" v-model="sex" :options="['男', '女']">
        </mt-radio>
      </div>
      <div class="age">
        <mt-radio title="5.年龄" v-model="age" :options="['18岁以下', '18-25','28-35','38-50','50岁以上']">
        </mt-radio>
      </div>
      
      <div class="taste">
         <mt-radio title="6.口味" v-model="taste" :options="['重口', '清淡口味']">
        </mt-radio>
      </div>
      <div class="food-evaluate">
        <div class="evaluate-list"  v-for="(value,index) in productList">
          <Foretaste :index ="index" :fdata="value" @pushPic="pushPic" @delModel="delModel" @delImg="delImg"/>
        </div>
        <div class="add-new-product flex-h flex-cc">
          <mt-button type="primary" class="add-new-pro"  @click="addNewPro">+添加试吃商品</mt-button>
        </div>
      </div>
      <mt-button type="danger" class="submit-product" size="large" @click="submitProduct">提交</mt-button>
    </div>
  </div>
</template>

<script>
import { Button, Cell, Field, Radio, MessageBox, Indicator } from 'mint-ui'
import Foretaste from '../components/Foretaste'
import axios from 'axios'
import guid from 'guid'
export default {
  name: 'about',
  components: {
    Button,
    Cell,
    Field,
    Radio,
    Foretaste
  },
  data() {
    return {
      name: '',
      sex: '',
      age: '',
      wnickName: '',
      hometown: '',
      taste: '',
      productList: [
        {
          pname: '',
          pingjia: '',
          dafen: '',
          goumaiyiyuan: '',
          sameBetter: '',
          pics: []
        }
      ],
      logo: require('../assets/img/icon_oneway.png')
    }
  },
  created() {},
  methods: {
    delImg({ picIndex, index }) {
      this.productList[index].pics.splice(picIndex, 1)
    },
    addNewPro() {
      this.productList.push({
        pname: '',
        pingjia: '',
        dafen: '',
        goumaiyiyuan: '',
        sameBetter: '',
        pics: []
      })
    },
    delModel(index) {
      MessageBox.confirm('确定执行此操作?').then(action => {
        if (action === 'confirm') {
          this.productList.splice(index, 1)
        }
      })
    },
    pushPic(data) {
      console.log('====================================')
      console.log('pushPic', data)
      this.productList.map((item, index) => {
        if (index === data.index) {
          item.pics.push(data.imgUrl)
        }
        return item
      })
      console.log('====================================')
      console.log(this.productList)
      console.log('====================================')
    },
    submitProduct() {
      console.log('==================商品详情==================')
      console.log('名称:', this.name)
      console.log('性别:', this.sex)
      console.log('年龄:', this.age)
      console.log('昵称:', this.wnickname)
      console.log('家乡:', this.hometown)
      console.log('taste:', this.taste)
      console.log('商品:', this.productList)
      console.log('====================================')
      console.log('====================================')
      console.log(axios)
      const accId = guid.raw()
      const surveyId = window.navigator.userAgent
      Indicator.open({ spinnerType: 'fading-circle' })
      // 验证
      const subData = {
        surveyId,
        accId,
        name: this.name,
        sex: this.sex,
        age: this.age,
        wnickName: this.wnickname,
        hometown: this.hometown,
        taste: this.taste,
        productList: this.productList
      }
      axios
        .post(
          'http://192.168.1.196:9000/user-service/notice/auth/addSurvey',
          subData
        )
        .then(_ => {
          Indicator.close()
          console.log('====================================')
          console.log(_)
          console.log('====================================')
        })
        .catch(e => {
          console.log('请求失败:', e)
          Indicator.close()
        })
      console.log('====================================')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.wenjuanpage {
  .hint {
    position: relative;
    height: 300px;
    padding-left: 20px;
    background-color: #353535;
    background-size: cover;
    font-size: 32px;
    color: #fff;
    .title {
      font-weight: 700;
      color: #f9e77f;
    }
    .line {
      height: 10px;
    }
    .p1,
    .p2 {
      font-size: 28px;
    }
    .logo {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 80px;
      height: 80px;
    }
  }
  .question-container {
    .mint-cell-text {
      color: #555;
      font-weight: 700;
    }
    .mint-radiolist {
      .mint-radiolist-title {
        height: 96px;
        line-height: 96px;
        color: #555;
        font-size: 32px;
        font-weight: 700;
        margin: 0 20px;
      }
    }
  }
  .add-new-product {
    border-top: 1px solid #eee;
    margin-bottom: 100px;
    .add-new-pro {
      margin-top: 20px;
    }
  }
  .add-new-pro {
    background: transparent;
    color: #000;
    border: 1px solid #000;
  }
  .submit-product {
    height: 100px;
    background: #f9e77f;
  }
}
</style>
