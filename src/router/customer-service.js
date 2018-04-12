export default [
  {
    path: '/',
    name: 'service',
    component: resolve => {
      require(['@/pages/customerservicepage'], resolve)
    }
  }
]
