export default [
  {
    path: '/',
    name: 'about',
    component: resolve => {
      require(['@/pages/aboutpage'], resolve)
    }
  }
]
