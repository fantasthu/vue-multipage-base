import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router/about';

require('./about.scss');

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

new Vue({
  router,
  data() {
    return {
      eventBus: this,
    };
  },
  render(h) {
    return h('router-view');
  },
}).$mount('#about');
