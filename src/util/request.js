import axios from 'axios'
// import qs from 'qs'
import { Message } from 'element-ui'
import utils from './utils.js'
import store from '../vuex/store'
// let baseUrl = 'http://ep23767307.qicp.vip:31379/haianJK/'
let baseUrl = 'http://10.0.0.13:31379/haianJK/'
// let baseUrl = 'http://111.231.134.126:8082/haianJK/'
// let baseUrl = 'http://172.16.52.216:8081/haianJK/'

const CancelToken = axios.CancelToken
const source = CancelToken.source()
// 设置token
function setToken () {
  if (utils.local.get('token')) {
    axios.defaults.headers.common['token'] = utils.getLocal('token')
  }
}

// err
const err = (error) => {
  if (error.response) {
    let data = error.response.data
    store.dispatch('toggleLoadingBt', false)
    // const token = Vue.ls.get(ACCESS_TOKEN)
    // console.log("------异常响应------",token)
    // console.log("------异常响应------",error.response.status)
    switch (error.response.status) {
      case 403:
        Message.error({
          message: '拒绝访问!'
        })
        break
      case 500:
        if (data.message === 'Token失效，请重新登录') {
          Message.error({
            message: '很抱歉，登录已过期，请重新登录!'
          })
        }
        break
      case 404:
        Message.error({
          message: '很抱歉，资源未找到!'
        })
        break
      case 504:
        Message.error({
          message: '网络超时!'
        })
        break
      case 401:
        Message.error({
          message: '未授权，请重新登录!'
        })
        // if (token) {
        //   store.dispatch('Logout').then(() => {
        //     setTimeout(() => {
        //       window.location.reload()
        //     }, 1500)
        //   })
        // }
        break
      default:
        Message.error({
          message: data.message + '!'
        })
        break
    }
  }
  return Promise.reject(error)
}

// 请求验证拦截器
axios.interceptors.request.use(config => {
  // store.commit('UPDATE_LOADING', true) // 显示loading,这里没有用vuex可以省去
  // // 判断请求不是登陆接口的时候,字段是不是过期了,(根据业务逻辑做对应的处理)
  // if (config.url.indexOf('login') < 0) {
  //   let lessTime = Number(uitls.local.get('expireTime')) - Date.now(); // 后台返回的过期时间与现在的进行计算
  //   if (lessTime <= 0) {
  //     Message.error({
  //       content: '登陆过期',
  //       duration: 5
  //     });
  //     source.token('token过期了');
  //     store.commit('UPDATE_LOADING', false); // 隐藏loading
  //     window.location.href = '/login';
  //     utils.local.clear();
  //   }
  // }
  return config
})

// 返回数据拦截器
axios.interceptors.response.use(res => {
  // if (res.config.url.indexOf('login') >= 0) {
  //   const { token, expireTime, code, data } = res.data;
  //   if (code == '200') {
  //     // 登陆后做出一些本地的处理，按需加载,()
  //     //...................
  //     utils.local.set('expireTime', expireTime); // 过期时间
  //     utils.local.set('token', token);
  //   }
  // }
  return res
}, err)

// 封装请求方法
function formatReq (type, url, data) {
  const timestamp = Date.now()
  setToken()
  return new Promise((resolve, reject) => {
    axios({
      method: type,
      url: `${baseUrl}${url}`,
      headers: {
        // 这里的请求头与后台商量设置
        // 'content-Type': 'application/x-www-form-urlencoded'
        'content-Type': 'application/json',
        'X-Timestamp': timestamp
      },
      cancelToken: source.token,
      data: data // java后台用qs转 qs.stringify(data)
      // data:JSON.stringify(data)//PHP后台用JSON转
    })
      .then(r => {
        // store.commit('UPDATE_LOADING', false) // 隐藏loading
        // 这里可以添加指定对应状态码的处理方式,比如登陆过期,res.data.code === '6666' 路由跳转到login
        resolve(r)
      })
      .catch(e => {
        // store.commit('UPDATE_LOADING', false) // 隐藏loading
        reject(e.message)
        // Message.error(e.message)
      })
  })
}

const Http = {
  get: (url, query) => {
    if (query) {
      url = encodeURI(url + utils.formatUrl(query) + '&timestamp=' + Date.now())
    } else {
      url = encodeURI(url + '?timestamp=' + Date.now())
    }
    setToken()
    return axios.get(`${baseUrl}${url}`, { cancelToken: source.token }).then(r => r)
  },
  post: (url, data) => formatReq('post', encodeURI(url), data),
  put: (url, data) => formatReq('put', encodeURI(url), data),
  patch: (url, data) => formatReq('patch', encodeURI(url), data),
  delete: (url, data) => formatReq('delete', encodeURI(url), data)
}

export default Http
