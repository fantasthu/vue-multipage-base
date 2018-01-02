import Vue from 'vue'

const template = require('./index.html')

export default Vue.extend({
  template,
  data() {
    return {
      imgUrl: '../../assets/logo.png'
    }
  }
})
