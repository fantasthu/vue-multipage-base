<template>
  <div class="wenjuanpage">
    <div class="hint flex-v flex-cc">
      <h3 class="title">玩味新品试吃反馈</h3>
      <div class="line"></div>
      <p class="p1">好吃就是好吃,不好吃就是不好吃</p>
      <p class="p2">请填写您最真实的试吃体验</p>
      <img :src="logo" alt="" class="logo">
    </div>
    <div class="question-container">
      <div class="name">
        <span class="q">1.您的姓名*</span>
        <mt-field  placeholder="" v-model="name"></mt-field>
      </div>
      <div class="w-nickname">
        <span class="q">2.您的微信昵称*</span>
        <mt-field  placeholder="" v-model="wnickName"></mt-field>
      </div>
      <div class="hometown">
        <span class="q">3.您的家乡*</span>
        <mt-field  placeholder="" v-model="hometown"></mt-field>
      </div>

      <div class="sex">
        <mt-radio title="4.您的性别*" v-model="sex" :options="['男', '女']">
        </mt-radio>
      </div>
      <div class="age">
        <mt-radio title="5.您的年龄*" v-model="age" :options="['18岁以下', '18-25','26-35','36-50','50岁以上']">
        </mt-radio>
      </div>
      
      <div class="taste">
         <mt-radio title="6.您是重口味爱好者还是清淡口味？" v-model="taste" :options="['重口味', '清淡口味']">
        </mt-radio>
      </div>
      <div class="food-evaluate">
        <div class="evaluate-list"  v-for="(value,index) in productList">
          <Foretaste :index ="index" :fdata="value" @pushPic="pushPic" @delModel="delModel" @delImg="delImg"/>
        </div>
        <div class="add-new-product flex-h flex-cc"  v-if="productList.length < 10">
          <mt-button type="primary" class="add-new-pro"  @click="addNewPro">+添加试吃商品</mt-button>
        </div>
      </div>
      <mt-button type="danger" v-bind:class="['submit-product', disabled ? 'disabled' : '' ]"  size="large" @click="submitProduct">提交</mt-button>
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
      logo: require('../assets/img/icon_oneway.png'),
      disabled: false
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
      if (this.disabled) {
        return
      }
      console.log('==================商品详情==================')
      console.log('名称:', this.name)
      console.log('性别:', this.sex)
      console.log('年龄:', this.age)
      console.log('昵称:', this.wnickName)
      console.log('家乡:', this.hometown)
      console.log('taste:', this.taste)
      console.log('商品:', this.productList)
      console.log('====================================')
      console.log('====================================')
      console.log(axios)
      const accId = guid.raw()
      const surveyId = window.navigator.userAgent
      // 验证
      if (
        this.name.trim() === '' ||
        this.wnickName.trim() === '' ||
        this.hometown.trim() === '' ||
        this.sex.trim() === '' ||
        this.age.trim() === '' ||
        this.taste.trim() === ''
      ) {
        this.$toast('要填完所有信息哦~比心~')
        return
      }
      if (this.productList.length === 0) {
        this.$toast('要添加试吃商品哦~比心~')
        return
      }

      let flag = false
      this.productList.map((product, index) => {
        if (flag) {
          return
        }
        for (let key in product) {
          if (key === 'pics') {
            if (product[key].length < 3) {
              this.$toast('图片不够3张呢~比心~')
              flag = true
              return
            }
          } else if (product[key].trim() === '') {
            this.$toast('要填完所有信息哦~比心~')
            flag = true
            return
          }
        }
      })
      if (flag) {
        return
      }

      Indicator.open({ spinnerType: 'fading-circle' })
      const subData = {
        surveyId,
        accId,
        name: this.name,
        sex: this.sex,
        age: this.age,
        wnickName: this.wnickName,
        hometown: this.hometown,
        taste: this.taste,
        productList: this.productList,
        password: 'olX3MXwEiz6N9ec'
      }

      var instance = axios.create({
        headers: {
          velo_admin: 'nRF9L8ZaOKlE2lew'
        }
      })

      // axios
      instance
        .post('https://velo.top/repair-service/h5/addSurvey', subData)
        .then(_ => {
          Indicator.close()
          this.$toast('提交成功，感谢您的时间~')
          this.disabled = true
          console.log('====================================')
          console.log(_)
          console.log('====================================')
        })
        .catch(e => {
          console.log('请求失败:', e)
          this.$toast('网络异常,请重试~')

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
    font-size: 48px;
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
      font-size: 26px;
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
      // background: yellow;
      margin-top: 20px;
      border: 0;
      position: relative;
    }
    .add-new-pro::after {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 1px;
      // content:'',
      box-sizing: border-box;
      border: 2px solid #000;
      opacity: 1;
      background: transparent;
      border-radius: 6px;
      overflow: hidden;
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
  .disabled {
    background: #ccc;
  }
  .mint-field-core {
    border: 1px solid #ccc;
    box-sizing: border-box;
    padding: 0 10px;
  }
  // .mint-cell-value {
  //   border: 1px solid #555;
  // }
  // .mint-cell:last-child {
  //   background-image: none;
  //   background-size: 0;
  //   background-repeat: no-repeat;
  //   background-position: bottom;
  // }

  .mint-cell-wrapper {
    background-image: none;
    background-size: 120% 1px;
    background-repeat: no-repeat;
    background-position: top left;
    background-origin: content-box;
  }
  .hometown,
  .same-better,
  .w-nickname,
  .name {
    font-size: 32px;
    padding: 20px 20px 0;
    .mint-cell:last-child {
      background-image: none;
      background-size: 0;
      background-repeat: no-repeat;
      background-position: bottom;
    }
    textarea {
      // border: 1px solid #ccc;
      border: none !important;
    }
    .q {
      color: #555;
      font-weight: 700;
    }
  }
  .pingjia textarea {
    // border: none;
    position: relative;
    box-sizing: border-box;
  }
  // .pingjia textarea::after {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   bottom: 0;
  //   right: 1px;
  //   // content:'',
  //   box-sizing: border-box;
  //   border: 1px solid #ccc;
  //   opacity: 1;
  //   background: transparent;
  //   border-radius: 6px;
  //   overflow: hidden;
  // }
}
</style>
