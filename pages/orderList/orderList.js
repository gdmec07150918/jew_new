// pages/orderList/orderList.js
const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: 1,
    psize: 5,
    loadsize: 0,
    status: -1,
    tabCount: [],
    tabList: [],
    hasorder: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let status = options.status;
    if (status != undefined) {
      // console.log()
      this.data.status = parseInt(status);
    } else {
      this.setData({
        status: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(options) {

  },
  tabList: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this
    wx.request({
      url: 'https://jl.jewsoft.com/Ashx/TabServer.ashx?m=tabListPage',
      data: {
        "pid": this.data.pid,
        "psize": this.data.psize,
        "tabStatus": this.data.status,
        "t": Number(new Date())
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.ReturnID === 1) {
          var length = that.data.tabList.length
          var gsarr = that.data.tabList
          for (var i = 0; i < res.data.tabs.length; i++) {
            gsarr[length + i] = res.data.tabs[i]
          }
          that.setData({
            tabCount: res.data.tabCount,
            tabList: gsarr,
            loadsize: res.data.tabs.length
          })
        }
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  TabStatus: function(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    if (index == this.data.status){
      return false;
    }
    this.setData({
      status: index,
      pid: 1,
      loadsize: 0,
      tabList: []
    })
    this.tabList()
    // console.log(e)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log(e)
    var status = 1;
    this.data.tabList = [];
    console.log(app.globalData.orderStatus)
    if (app.globalData.orderStatus != -1) {
      if (app.globalData.orderStatus != this.data.status){
        this.data.pid = 1;
        this.data.psize = 5;
        this.data.loadsize = 5;
        this.data.tabCount = [];
        status = app.globalData.orderStatus;
        this.setData({
          status: status
        })
      }
    }
    this.tabList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.pid = 1;
    this.data.psize = 5;
    this.data.loadsize = 5;
    this.data.tabCount = [];
    this.data.tabList = [];
    this.tabList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    //返回数和请求数相同才再次加载，不相同则说明数据不够（即无更多数据）
    if (this.data.psize === this.data.loadsize) {
      this.setData({
        pid: this.data.pid + 1
      })
      this.tabList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
