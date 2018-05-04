import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/customer-service'
import MintUI from 'mint-ui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'mint-ui/lib/style.css'
import './assets/css/base.scss'
import './assets/css/flex.scss'

Vue.use(VueRouter)
Vue.use(MintUI)
Vue.use(ElementUI)
const router = new VueRouter({
  routes
})

new Vue({
  router,
  data() {
    return {
      eventBus: this
    }
  },
  render(h) {
    return h('router-view')
  }
}).$mount('#customerService')
