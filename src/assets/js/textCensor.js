const bl = ['毛泽东', '习近平', '江泽民', '胡锦涛', '共产党', '法轮功', '袭击', '攻击', '傻比', '傻逼', '煞笔', '沙比', '草泥马', '草你妈', '草你', '干', '日你', 'fuck', 'caonima', 'cao']
const strategyStr = '***'
export default function textCensor(news) {
  let blacklist = bl
  const strategy = strategyStr
  if (!news) {
    return
  }
  blacklist = blacklist.map((item) => {
    return '(' + item + ')'
  }).join('|')
  var regex = new RegExp(blacklist, 'g')
  return news.replace(regex, strategy)
}
