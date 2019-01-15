//app.js
App({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '珠宝贸易品台',
      path: '/pages/UsserCenter'
    }
  },
  onLaunch: function () {
    var that = this 
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: function (e) {
        that.globalData.windowWidth = e.windowWidth
        that.globalData.windowHeight = e.windowHeight
      }
    })

  },
  getUser: function(data){
    this.globalData.userInfo2 = data
    if (this.globalData.userInfo2 != null){
      return this.globalData.userInfo2
    }else{
      this.getUserInfo()
    }
    return this.globalData.userInfo2
  },
  //获取用户信息
  // getUserInfo: function () {
  //   var that = this
  //   if (this.globalData.userInfo2 == null) {
  //     wx.request({
  //       url: 'https://gs.jewsoft.com/Ashx/UserServer.ashx?m=userCenter',
  //       data: {
  //         "t": Math.round(Math.random() * 10000)
  //       },
  //       method: "POST",
  //       header: {
  //         'content-type': 'application/x-www-form-urlencoded'
  //       },
  //       success: function (res) {
  //         if (res.data.ReturnID === 1) {
  //           let data = res.data
  //           that.getUser(data)
  //           // that.globalData.userInfo2 = res.data
  //         }
  //       }
  //     })
  //   }else{
  //     return this.globalData.userInfo2
  //   }
  //   return this.globalData.userInfo2
  // },
  getUserInfo: function () {
    var that = this;
    //http://es6.ruanyifeng.com/#docs/promise#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95
    /* new Promise()是一个对象,英语意思就是“承诺”，表示其他手段无法改变
      用 new Promise 解决异步操作，将异步操作以同步操作的流程表达出来
      解决异步操作的方案，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。
    */
    if(that.globalData.userInfo2 == null){
      return new Promise(function (resolve, reject) {
        wx.request({
          url: "https://gs.jewsoft.com/Ashx/UserServer.ashx?m=userCenter",
          data: {"t":Number(new Date())},
          method: "GET",
          header: {
            "Content-Type": "application/json;charset=UTF-8",
            "token": that.globalData.token
          },
          success: function (res) {
            that.globalData.userInfo2 = res.data
            resolve(res.data)
          },
          fail: function (res) {
            reject(res);
          },
        })
      })
    }else{
      return that.globalData.userInfo2
    }
  },
  //全局变量，常判断空时才调用接口数据，例如一些用户信息，可避免重复调用
  globalData: {
    userInfo: null,
    userInfo2: null,
    tabno: null,
    windowHeight: 0,
    windowWidth: 0,
    collect_type: 0
  },
  //接口成功并提示
  success: function (ReturnMessage) {
    wx.showToast({
      title: ReturnMessage,
      mask: true
    })
  },
  //接口成功，错误提示回调
  success0: function (ReturnMessage){
    wx.showToast({
      title: ReturnMessage,
      image: '../../images/main/error.png',
      mask: true
    })
  },
  //日期格式化
  Format: function (date, fmt){
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };

    // 遍历这个对象
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        // console.log(`${k}`)
        // console.log(RegExp.$1)
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }
    return fmt;
  },
  //返回上一页
  navigateBack1: function(){
    wx.navigateBack({
      delta: 1,
    })
  }
    //     {
  //   "pagePath": "pages/grid/grid",
  //   "text": "分类",
  //   "iconPath": "images/tarbar/grid.png",
  //   "selectedIconPath": "images/tarbar/grid-active.png"
  // },
})
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}