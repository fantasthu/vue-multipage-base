import Vue from 'vue'
import Header from '../../components/Header'

const template = require('./index.html')
require('./index.scss')

export default Vue.extend({
  template,
  data() {
    return {
      imgUrl: require('../../assets/img/logo.png')
    }
  }
})
