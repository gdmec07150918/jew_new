// pages/ModifyInfo/ModifyInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    Birthday: '',
    nowdate: '',
    area: [],
    imgbase64:'',
    endDate: app.Format(new Date(), "yyyy-MM-dd")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.userInfo2 == null) {
      app.getUserInfo().then(function (res) {
        // return res
        that.setData({
          userInfo: res
        })
      })
    } else {
      that.setData({
        userInfo: app.getUserInfo()
      })
    }
  },
  //生日时间选择
  birthdayChange: function (e) {
    // var that = this
    this.setData({
      Birthday: e.detail.value
    })
    // console.log(e.detail.value)
  },
  headchange: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['拍照','打开相册'],
      itemColor: '#ffb03f',
      success: function(res) {
        let imgtype = 'album'
        switch (res.tapIndex){
          case 0:
            imgtype = 'camera'
            break;
          case 1:
            imgtype = 'album'
            break;
        }
        
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: [imgtype],
          success: function (res) {
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePaths[0],
              encoding: 'base64',
              success: res => { //成功的回调
                console.log('data:image/png;base64,' + res.data)
              }
            })
          }
        })
      }
    })
  },
  // save: function(){
  //   wx.request({
  //     url: 'https://gs.jewsoft.com/Ashx/UserServer.ashx?m=modifyInfo',
  //     data: {
  //       "t": Math.round(Math.random() * 10000)
  //     },
  //     method: "POST",
  //     success: function (res) {
  //       if (res.data.ReturnID === 1) {
  //       }
  //     }
  //   })
  // },
  // cityChange: function (e){

  // }
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