import CryptoJS from 'crypto-js'

export function Encrypt (plaintText) {
  var keyStr = 'fsgs_liubai'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  var encryptedStr = encryptedData.ciphertext.toString()
  return encryptedStr
}

// AES解密
export function Decrypt (encryptedStr) {
  var keyStr = 'fsgs_liubai'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedStr)
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8)
  return decryptedStr
}

// 创建cookie
export function setCookie (cname, cvalue, exhours) {
  var d = new Date()
  d.setTime(d.getTime() + (exhours * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + '; ' + expires
}

// 获取cookie
export function getCookie (cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1)
    if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
  }
  return ''
}

// 删除cookie
export function clearCookie (name) {
  setCookie(name, '', -1)
}

// 秒数回转
export function secondToFormat (second) {
  var oDate = new Date(second)
  var oYear = oDate.getFullYear()
  var oMonth = oDate.getMonth() + 1
  var oDay = oDate.getDate()
  var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay)
  return oTime
}

export function secondToFormatAll (second) {
  var oDate = new Date(second)
  var oYear = oDate.getFullYear()
  var oMonth = oDate.getMonth() + 1
  var oDay = oDate.getDate()
  var oHour = oDate.getHours()
  var oMin = oDate.getMinutes()
  // var oSen = oDate.getSeconds()
  // var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay)
  var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin)
  return oTime
}

// date转年月日
export function dateToFormat (oDate) {
  var oYear = oDate.getFullYear()
  var oMonth = oDate.getMonth() + 1
  var oDay = oDate.getDate()
  var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay)
  return oTime
}

// date转年月日时分
export function dateToFormatAll (oDate) {
  var oYear = oDate.getFullYear()
  var oMonth = oDate.getMonth() + 1
  var oDay = oDate.getDate()
  var oHour = oDate.getHours()
  var oMin = oDate.getMinutes()
  var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin)
  return oTime
}

// 补零
function getzf (num) {
  if (parseInt(num) < 10) {
    num = '0' + num
  }
  return num
}

// 数组对象深度拷贝
export function objDeepCopy (sourceArr) {
  var sourceCopy = sourceArr instanceof Array ? [] : {}
  for (var item in sourceArr) {
    sourceCopy[item] = typeof sourceArr[item] === 'object' ? objDeepCopy(sourceArr[item]) : sourceArr[item]
  }
  return sourceCopy
}

// uuid
export function getuuid () {
  var uid = []
  var hexDigits = 'btwccy_liubai'
  for (var i = 0; i < 32; i++) {
    uid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  uid[6] = '4'
  uid[15] = hexDigits.substr((uid[15] & 0x3) | 0x8, 1)
  var uuid = uid.join('')
  return uuid
}

// 根据经纬极值计算绽放级别
export function getZoom (maxLng, minLng, maxLat, minLat, map, BMap) {
  var zoom = ['50', '100', '200', '500', '1000', '2000', '5000', '10000', '20000', '25000', '50000', '100000', '200000', '500000', '1000000', '2000000'] // 级别18到3
  var pointA = new BMap.Point(maxLng, maxLat) // 创建点坐标A
  var pointB = new BMap.Point(minLng, minLat) // 创建点坐标B
  var distance = map.getDistance(pointA, pointB).toFixed(1) // 获取两点距离,保留小数点后两位
  for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
    if (zoom[i] - distance > 0) {
      return 18 - i + 3 // 之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3
    }
  }
}

export function setZoom (points, map, BMap) {
  if (points.length > 0) {
    var maxLng = points[0].lng
    var minLng = points[0].lng
    var maxLat = points[0].lat
    var minLat = points[0].lat
    var res
    for (var i = points.length - 1; i >= 0; i--) {
      res = points[i]
      if (res.lng > maxLng) maxLng = res.lng
      if (res.lng < minLng) minLng = res.lng
      if (res.lat > maxLat) maxLat = res.lat
      if (res.lat < minLat) minLat = res.lat
    }
    var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2
    var cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2
    var zoom = getZoom(maxLng, minLng, maxLat, minLat, map, BMap)
    map.centerAndZoom(new BMap.Point(cenLng, cenLat), zoom)
  } else {
    // 没有坐标，显示全中国
    map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5)
  }
}
// request
let formatUrl = obj => {
  let params = Object.values(obj).reduce((a, b, i) => `${a}${Object.keys(obj)[i]}=${b}&`, '?')
  return params.substring(0, params.length - 1)
}

// 增删改查本地存储
let local = {
  set (key, value) {
    if (checkLocalStorage()) {
      window.localStorage.setItem(key, value)
    } else {
      let Days = 30
      let exp = new Date()
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
      document.cookie = key + '=' + escape(value) + ';expires=' + exp.toGMTString()
    }
  },
  get (key) {
    if (checkLocalStorage()) {
      return window.localStorage.getItem(key) ? window.localStorage.getItem(key) : null
    } else {
      return getCookieR(key)
    }
  },
  clear (key) {
    if (checkLocalStorage()) {
      window.localStorage.removeItem(key)
    } else {
      let exp = new Date()
      exp.setTime(exp.getTime() - 1)
      let cval = getCookieR(key)
      if (cval != null) document.cookie = key + '=' + cval + ';expires=' + exp.toGMTString()
    }
  }
}

function checkLocalStorage () {
  // 确认是否支持Localstorage
  return window.localStorage && (window.localStorage.setItem('a', 123), window.localStorage.getItem('a') === 123)
}
function getCookieR (name) {
  let arr
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) return unescape(arr[2])
  else return null
}

// Adaptation
export function Adaptation () {
  var dpr, rem, scale
  var docEl = document.documentElement
  // console.log(docEl.clientWidth)
  var fontEl = document.createElement('style')
  var metaEl = document.querySelector('meta[name="viewport"]')
  // dpr = window.devicePixelRatio || 1
  dpr = 1
  // rem = docEl.clientWidth * dpr / 10
  rem = docEl.clientWidth * dpr / 1920 * 100
  rem = rem.toFixed(6)
  scale = 1 / dpr
  // 设置viewport，进行缩放，达到高清效果
  metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no')
  // 设置data-dpr属性，留作的css hack之用
  docEl.setAttribute('data-dpr', dpr)
  // 动态写入样式
  docEl.firstElementChild.appendChild(fontEl)
  fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}'
  // 给js调用的，某一dpr下rem和px之间的转换函数
  window.rem2px = function (v) {
    v = parseFloat(v)
    return v * rem
  }
  window.px2rem = function (v) {
    v = parseFloat(v)
    return v / rem
  }
  window.dpr = dpr
  window.rem = rem
}

export default {
  formatUrl,
  local
}
