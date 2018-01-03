module.exports = {
  plugins: [
    require('postcss-px2rem')({
      remUtil: 75
    }),
    require('postcss-cssnext')()
  ]
}
