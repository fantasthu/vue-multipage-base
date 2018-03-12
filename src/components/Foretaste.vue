<template>
  <div class="foretaste">
    <div class="title flex-h flex-bc">
      <div class="left">
        试吃商品{{index+1}}
      </div>
      <mt-button type="primary" @click="delModel(index)">删除模块</mt-button>
    </div>
    <div class="name">
      <mt-field :label="nameTitle" placeholder="" v-model="fdata.pname"></mt-field>
    </div>
    <div class="pingjia">
      <mt-field label="请从口味包装价格等方面对商品做出评价" placeholder="评价不少于100字" type="textarea" rows="4" v-model="fdata.pingjia"></mt-field>
    </div>
    <div class="dafen">
      <mt-radio title="单选框列表" v-model="fdata.dafen" :options="['5分以下', '6', '7','8','9','10']">
      </mt-radio>
    </div>
    <div class="goumaiyiyuan">
      <mt-radio :title='goumaiyiyuanTitle' v-model="fdata.goumaiyiyuan" :options="['是', '否']">
      </mt-radio>
    </div>
    <div class="same-better">
      <span class="q">同类商品,是否有您觉得比试吃品更好的选择?有的话请填写品牌</span>
      <input type="text" class="better-input" v-model="fdata.sameBetter">
    </div>
    <div class="food-pics flex-h ">
      <input type="file" class="pic-file" :class="picFile" style="display:none" @change="handleFiles">      
      <div v-for="(pic,picindex) in fdata.pics">
        <div class="item">
          <img src="../assets/img/btn_finish.png" class="preview" alt="">
          <div class="del" @click="delImgUrl(picindex,index)">删除</div>
        </div>
      </div>
      <div class="add" @click="addPic"></div>
    </div>
  </div>
</template>

<script>
import { Field, Radio, Button, MessageBox } from 'mint-ui'
export default {
  name: 'foretaste',
  components: {
    Field,
    Radio,
    Button
  },
  props: ['index', 'fdata'],
  data() {
    return {
      addDom: '',
      picDom: '',
      nameTitle: '',
      goumaiyiyuanTitle: ''
    }
  },
  created() {},
  mounted() {
    this.picFile = `pic-file-${this.index}`
    this.$nextTick(() => {
      this.addDom = document.querySelector('.add')
      this.picDom = document.querySelector(`.pic-file-${this.index}`)
    })
    this.goumaiyiyuanTitle = `您是否有购买商品${this.index + 1}的意愿`
    this.nameTitle = `商品${this.index + 1}的名称`
  },
  methods: {
    delImgUrl(picIndex, index) {
      this.$emit('delImg', {
        picIndex,
        index
      })
    },
    addPic() {
      this.picDom.value = ''
      this.picDom.click()
    },
    delModel(index) {
      this.$emit('delModel', index)
    },
    handleFiles(file) {
      const fileValue = file.target.value
      const fileType = fileValue.split('.')
      if (/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileType)) {
        const imgUrl = this.handleImgUrl(file)
        this.$emit('pushPic', { imgUrl, index: this.index })
        console.log('====================================')
        console.log(file.target.value, fileType)
      } else {
        MessageBox.alert('上传图片格式不正确').then(action => {})
      }
    },
    handleImgUrl() {
      return ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.foretaste {
  .same-better {
    font-size: 32px;
    padding: 0 20px;
    .q {
      color: #888;
    }
    .better-input {
      width: 100%;
      height: 50px;
      display: inline-block;
      border: none;
      border-bottom: 1px solid #eee;
    }
  }
  .food-pics {
    flex-wrap: wrap;
    .item {
      width: 160px;
      height: 160px;
      border: 1px solid #eee;
      border-radius: 2px;
      position: relative;
      .preview {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
      .del {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .add {
      position: relative;
      width: 160px;
      height: 160px;
      border: 1px solid #444;
      border-radius: 8px;
    }
    .add::before {
      content: ' ';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 50%;
      transform: translate(-50%, -50%);
      height: 4px;
      background: #333;
    }
    .add::after {
      content: ' ';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 4px;
      height: 50%;
      background: #333;
    }
  }
}
</style>
