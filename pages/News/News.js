// pages/News/News.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Rows: null,
    pid: 1,
    Need_loadsize: 15,
    Ret_loadsize: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.downData()
  },
  downData: function () {
    var that = this
    wx.request({
      url: 'https://gs.jewsoft.com/Ashx/UserServer.ashx?m=userMessageList',
      data: {
        "pid": this.data.pid, "psize": this.data.Need_loadsize, "type": "", "t": Number(new Date())
      },
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.ReturnID === 1) {
          if (that.data.Rows === null) {
            that.setData({ 
              Rows: res.data.Rows,
              Ret_loadsize: res.data.Rows.length
            })
          }
        }
      }
    })
  },
  SignRead: function () {
    wx.showModal({
      title: '标记提示',
      content: '确定全部标记为已读？',
      success: function (options) {
        if (options.confirm){
          wx.request({
            url: 'https://gs.jewsoft.com/Ashx/UserServer.ashx?m=userMessageRead',
            data: {
              "ids": "all", "csign": "", "type": "", "t": Number(new Date())
            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.ReturnID === 1) {
              }
            }
          })
          console.log("确定")
        }else{
          console.log("取消")
        }
      },
      fail: function(){

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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data._thisplay2 === 1) {
      //返回数和请求数相同才再次加载，不相同则说明数据不够（即无更多数据）
      if (this.data.Need_loadsize === this.data.Ret_loadsize) {
        this.setData({ pid: this.data.pid + 1 })
        this.downData()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})