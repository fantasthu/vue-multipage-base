import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages/index';

Vue.use(Router);

export default {
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
  ],
};
