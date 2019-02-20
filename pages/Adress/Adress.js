// pages/Adress/Adress.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Adress: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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
    var that = this;
    wx.showLoading({
      title: '正在获取地址...',
      mask: true
    })
    wx.request({
      url: 'https://jl.jewsoft.com/ASHX/CompanyServer.ashx?m=getAddress&t=' + Number(new Date()),
      method: "GET",
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnID === 1) {
          that.setData({
            Adress: res.data.Rows
          })
        } else {
          app.success0(res.data.ReturnMessage);
        }
      },
      complete: function () {
        // wx.hideLoading()
      }
    })
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