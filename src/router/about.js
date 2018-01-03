export default [
  {
    path: '/about',
    name: 'about',
    component: resolve => {
      require(['@/pages/aboutpage'], resolve)
    }
  }
]
