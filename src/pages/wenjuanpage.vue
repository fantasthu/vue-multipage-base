<template>
  <div class="wenjuanpage">
    <div class="hint">
      <h3 class="title">友情提示</h3>
      <p class="p1">好吃就是好吃,不好吃就是不好吃</p>
      <p class="p2">请填写您最真实的试吃体验</p>
    </div>
    <div class="question-container">
      <div class="name">
        <mt-field label="您的姓名*" placeholder="" v-model="name"></mt-field>
      </div>
      <div class="sex">
        <mt-radio title="您的性别*" v-model="sex" :options="['男', '女']">
        </mt-radio>
      </div>
      <div class="age">
        <mt-radio title="您的年龄*" v-model="age" :options="['18岁以下', '18-25','28-35','38-50','50岁以上']">
        </mt-radio>
      </div>
      <div class="w-nickname">
        <mt-field label="您的微信昵称*" placeholder="" v-model="wnickName"></mt-field>
      </div>
      <div class="hometown">
        <mt-field label="您的家乡*" placeholder="" v-model="hometown"></mt-field>
      </div>
      <div class="taste">
         <mt-radio title="您的性别*" v-model="taste" :options="['重口', '清单口味']">
        </mt-radio>
      </div>
      <div class="food-evaluate">
        <div class="evaluate-list"  v-for="(value,index) in productList">
          <Foretaste :index ="index" :fdata="value" @pushPic="pushPic" @delModel="delModel" @delImg="delImg"/>
        </div>
        <div class="add-new-product flex-h flex-cc">
          <mt-button type="primary" size="" @click="addNewPro">+添加试吃商品</mt-button>
        </div>
      </div>
      <mt-button type="danger" size="large">提交</mt-button>
    </div>
  </div>
</template>

<script>
import { Button, Cell, Field, Radio, MessageBox } from 'mint-ui'
import Foretaste from '../components/Foretaste'
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
      productList: [
        {
          pname: '',
          pingjia: '',
          dafen: '',
          goumaiyiyuan: '',
          sameBetter: '',
          pics: []
        },
        {
          pname: '',
          pingjia: '',
          dafen: '',
          goumaiyiyuan: '',
          sameBetter: '',
          pics: []
        }
      ]
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.wenjuanpage {
}
</style>
