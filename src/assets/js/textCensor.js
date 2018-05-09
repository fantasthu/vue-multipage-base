const bl = ['习近平', '袭击', '攻击', '共产党', '傻比', '傻逼', '草泥马', '草你妈', '草你', '干', 'fuck', 'caonima', 'cao']
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
