const bl = [
  '毛泽东', '习近平', '江泽民', '胡锦涛', '习仲勋', '贺国强', '贺子珍', '周永康', '李德生', '王岐山', '姚依林', '回良玉', '李源潮', '李干成', '戴秉国',
  '黄镇', '刘延东', '刘瑞龙', '俞正声', '黄敬', '薄熙来', '薄一波', '周小川', '周建南', '温云松', '徐明', '江绵康', '李小鹏', '李小琳', '朱云来',
  '共产党', '法轮功', '袭击', '攻击', '淫靡', '迷昏药', '三唑仑', '买卖枪支', '六合彩', '出售枪支', '摇头丸', '假币', '监听', '昏迷', '反华', '迷奸药', '透视眼镜', '远程偷拍',
  '激情小电影', '黄色小电影', '黄色小视频', '大学骚乱', '高校骚乱', '催情药', '春药', '禁书', '反政府', '成人', '贪污', '骚妇', '骚逼', '骚B', 'AV', '金瓶梅', '十八禁', '假币',
  '暴力', '全裸', '偷拍', '黄色小说', '艹', '操你', '性爱', '碧池',
  '傻比', '傻逼', '煞笔', '沙比', '草泥马', '草你妈', '草你', '干你', '干尼玛', '干你妈', '泥马', '日你', 'fuck', 'caonima', 'cao'
]
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
