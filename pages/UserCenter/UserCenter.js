// pages/UserCenter/UserCenter.js
const app = getApp()

Page({
  data: {
    motto2: '',
    userInfo2: null,
    tabList: {},
    items:{},
    Cmpitems:{},
    CompanyID:0,
    index:0,
    hasRefesh: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    // console.log(app.userInfo)
    console.log(4564)
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onMyEvent: function (e) {
    wx.navigateTo({
      url: '../AccountManage/AccountManage'
    })
    e.detail // 自定义组件触发事件时提供的detail对象
  },
  onLoad: function () {
    wx.request({
      url: 'https://jl.jewsoft.com/Ashx/UserServer.ashx?m=logon',
      data: {
        "Phone": "13113485015", "Password": "123456", "t": Math.round(Math.random() * 10000)
      },
      method: "POST",
      success: function (res) {
        // console.log(res);
      }
    })
    // wx.login({
    //   success: function(){
        
    //   }
    // })

    var that = this;
    // var tt = app.getUserInfo()
    // console.log(app.getUserInfo())
    // console.log(data)
    if (app.globalData.userInfo2 == null) {
      app.getUserInfo().then(function(res){
        // return res
        that.setData({
          userInfo2: res
        })
      })
    }else{
      that.setData({
        userInfo2: app.getUserInfo()
      })
    }
    wx.request({
      url: 'https://jl.jewsoft.com/Ashx/TabServer.ashx?m=tabListPage',
      data: {
        "pid": 1, "psize": 0, "tabStatus": 0, "t": Math.round(Math.random() * 10000)
      },
      method: "POST",
      success: function (res) {
        if (res.data.ReturnID === 1) {
          that.setData({
            tabList: res.data
          })
        }
      }
    })
    wx.request({
      url: 'https://jl.jewsoft.com/Ashx/UserServer.ashx?m=getUserCompany',
      data: {
        "t": Math.round(Math.random() * 10000)
      },
      method: "POST",
      success: function (res) {
        if (res.data.ReturnID === 1) {
          that.setData({
            Cmpitems: res.data,
            // index: res.data.Rows.indexOf(7)
          })
          //获取企业的下标
          for (var i = 0; i < that.data.Cmpitems.Rows.length; i++) {
            if (that.data.CompanyID == that.data.Cmpitems.Rows[i].CompanyID) {
              // that.data.CompanyID = i;
              that.setData({
                index: i,
              })
              return false;
              // console.log(that.data.CompanyID);
            }
          }
          // console.log(that.data.index)
        }
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //跳转收藏
  linktoCollect: function (e) {
    // console.log(e)
    var type =  parseInt(e.currentTarget.dataset.type)
    app.globalData.collect_type=type
    wx.navigateTo({
      url: "/pages/collect/collect?fsign=" + type
    })
  },
  //下拉刷新
  onPullDownRefresh: function(){
  //   this.setData({
  //     hasRefesh:true
  //   })
  //   var that =this
  //   setTimeout(function(){
  //     that.setData({
  //       hasRefesh: false
  //     })
  //     wx.hideLoading()
  //     wx.stopPullDownRefresh()
  //     console.log("刷新结束")
  //   },1000)
  // console.log("下拉")
    wx.stopPullDownRefresh()
  },
  bindPickerChange: function(e){
    var that = this
    //获取该位置的企业id
    var index= e.detail.value
    //获取该下标的企业id
    var cid = this.data.Cmpitems.Rows[index].CompanyID
    wx.request({
      url: 'https://jl.jewsoft.com/Ashx/UserServer.ashx?m=modifyCurrentCompany',
      data: {
        "CompanyID": cid,"t": Math.round(Math.random() * 10000)
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.ReturnID === 1) {
          //修改变动值
          that.setData({
            //数据双向绑定的效果，修改CompanyID，值会自动变动
            index: index
            // hasUserInfo: true
          })
          wx.showToast({
            title: res.data.CodeMessage,
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: res.data.CodeMessage,
            icon: 'cancel',
            duration: 2000
          })
        }
      }
    })

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //跳转订单列表
  linkOrderList: function (e) {
    var status = parseInt(e.currentTarget.dataset.status);
    console.log(status)
    app.globalData.orderStatus = status;
    wx.switchTab({
      url: '/pages/orderList/orderList',
    })
  }
})