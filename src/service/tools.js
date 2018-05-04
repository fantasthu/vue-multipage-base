
exports.formatTime = (str) => {
  let formatStr = ''
  let date = new Date(str * 1000)
  let Y = date.getFullYear()
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  formatStr = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
  return formatStr
}

// 查看物流时使用   时间格式  20180207150436
exports.formatterDateTime = () => {
  var date = new Date()
  var month = date.getMonth() + 1
  var datetime =
    date.getFullYear() +
    '' + // "年"
    (month >= 10 ? month : '0' + month) +
    '' + // "月"
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    '' +
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    '' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    '' +
    (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return datetime
}
