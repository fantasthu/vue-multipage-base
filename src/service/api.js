// import { get, post, postUrlEncoded } from './http'
// import { get } from './http'
import axios from 'axios'

let get = (url, obj, needHeaders = false) => {
  let data = {}
  if (needHeaders) {
    data = {
      params: obj,
      headers: { velo_admin: 'nRF9L8ZaOKlE2lew' }
    }
  } else {
    data = {
      params: obj
    }
  }
  return new Promise(function(resolve, reject) {
    axios.get(url, data).then(function(resp) {
      resolve(resp.data)
    })
  })
}

// let post = (url, params) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .post(url, params)
//       .then(function(response) {
//         resolve(response.data)
//       })
//       .catch(function(error) {
//         reject(error)
//       })
//   })
// }

let post = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'post',
      data: params, // 待发送数据
      transformRequest: function(data) {
        // 将data中的数据转化为 name=jack&addr=usa
        var str = ''
        for (var key in data) {
          str += key + '=' + data[key] + '&'
        }
        return str.substr(0, str.length - 1)
      }
      // 设置请求头
      // headers:{
      //   velo_admin: "nRF9L8ZaOKlE2lew"
      // }
    }).then(function(response) {
      resolve(response.data)
    })
  })
}

let api = {}

// 获取当前客服在线状态(状态由之前设置)
api.checkWaiterIsOnLine = obj => {
  return new Promise(async(resolve, reject) => {
    let data = await get(
      'http://cs.velo.top/customerService/webApi/checkWaiterIsOnLine',
      obj
    )
    if (data.code === 0) {
      resolve(data.obj)
    } else {
      resolve(data.obj)
      console.warn('api.checkWaiterIsOnLine', data)
    }
  })
}

api.setWeiXinPublicNotice = obj => {
  return new Promise(async(resolve, reject) => {
    let data = await post(
      'http://cs.velo.top/customerService/webApi/setWeiXinPublicNotice',
      obj
    )
    if (data.code === 0) {
      resolve(data.obj)
    } else {
      resolve(data.obj)
      console.warn('api.setWeiXinPublicNotice', data)
    }
  })
}

// api.checkWaiterIsOnLine()

export default api
