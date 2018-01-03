export default [
  {
    path: '/',
    name: 'index',
    component: resolve => {
      require(['@/pages/indexpage'], resolve)
    }
  }
]
