// pages/discoverInfo/discoverInfo.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    NewsInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this
    wx.request({
      url: 'https://gs.jewsoft.com/Ashx/FHomeServer.ashx?m=articleContent',
      data: {
        "s": 3, "artno": options.artno, "t": Number(new Date())
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.ReturnID === 1) {
          var info = res.data.Info.art_content
          WxParse.wxParse('article', 'html', info, that, 5)
          that.setData({ NewsInfo: res.data.Info })
        } else {
          wx.showToast({
            title: res.data.ReturnMessage,
            image: '../../images/main/error.png',
            mask: true
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})