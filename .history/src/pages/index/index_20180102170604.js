import Vue from 'vue'

const template = require('./index.html')

export default Vue.extend({
  el: '#index',
  template,
  data() {
    return { imgUrl: '../../assets/logo.png' }
  }
})
