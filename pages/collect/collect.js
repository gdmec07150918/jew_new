// pages/collect/collect.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _thisplay: 0,
    goods: null,
    edit: false,
    select: false,
    allselect: false,
    selectArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoods()
  },
  getGoods: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this
    wx.request({
      url: 'https://gs.jewsoft.com/ASHX/UserServer.ashx?m=UAPage',
      method: "Post",
      data: {
        "getFilter": "", "getGoods": 1, "getCompany": 1, "companySigns": "",
        "goodsTypes": "",
        "t": Math.round(Math.random() * 10000)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.ReturnID === 1) {
          that.setData({
            goods: res.data
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  //编辑
  edit: function(){
    this.setData({ edit: !this.data.edit})
  },
  //编辑时选，货品
  gscollectChange: function (e){
    // console.log(e)
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({ selectArr: e.detail.value})
    var itemlength = this.data.goods.Goods.length
    if (itemlength >0){
      if (itemlength === e.detail.value.length){
        this.setData({ allselect: true})
      } else if (this.data.allselect === true){
        this.setData({ allselect: false })
      }
    }
  },
  //全选
  allselect: function(e){
    this.setData({ select: !this.data.select, allselect: !this.data.allselect})
  },
  //取消关注
  noCollect: function () {
    var itemSignparam = ""
    //已全选,直接获取数据的商品标识
    if (this.data.allselect){
      for (var item in this.data.goods.Goods) {
        itemSignparam += this.data.goods.Goods[item].ItemSign + "_"
      }
    } else if (this.data.selectArr.length > 0){
      for (var item in this.data.selectArr) {
        itemSignparam += this.data.selectArr[item] + "_"
      }
    }else{
      wx.showToast({ 
        image: '../../images/main/hint.png',
        title: '请先选中货品',
        duration: 1000,
        mask: true
      })
      return false;
    }
    var that = this
    wx.showModal({
      title: '取消关注',
      content: '确定取消关注所选商品？',
      confirmColor: '#ffb03f',
      success: function () {
        wx.request({
          url: 'https://gs.jewsoft.com/ASHX/UserServer.ashx?m=deleteUAGoods',
          method: "Post",
          data: {
            "itemSign": itemSignparam, "t": Math.round(Math.random() * 10000)
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            if(res.data.ReturnID === 1){
              wx.showToast({
                title: res.data.ReturnMessage,
                duration: 1000,
                mask: true
              })
              that.setData({
                edit: false,
                select: false,
                allselect: false,
                selectArr: []
              })
              that.getGoods()
            }
          }
        })
      }
    })
  },
  //取消关注工厂
  removecollect: function (e) {
    var that = this
    let sign = e.currentTarget.dataset.sign
    wx.showActionSheet({
      itemList: ['取消关注'],
      itemColor: '#ff0000',
      success: res => {
        wx.request({
          url: 'https://gs.jewsoft.com/ASHX/UserServer.ashx?m=deleteUACompany',
          method: "Post",
          data: {
            "sign": sign, "t": Math.round(Math.random() * 10000)
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            if (res.data.ReturnID === 1) {
              wx.showToast({
                title: res.ReturnMessage + '',
                duration: 800,
                mask: true
              })
              that.getGoods()
            }else{
              app.success0(res.ReturnMessage)
            }
          },
          complete: function () {
            // wx.hideLoading()
          }
        })
      }
    })
  },
  //关注工厂
  cmpcollect: function (e) {
    var that = this
    let sign = e.currentTarget.dataset.sign
    wx.request({
      url: 'https://gs.jewsoft.com/ASHX/UserServer.ashx?m=addUACompany',
      method: "Post",
      data: {
        "sign": sign, "t": Math.round(Math.random() * 10000)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.ReturnID === 1) {
          wx.showToast({
            title: res.ReturnMessage + '',
            duration: 800,
            mask: true
          })
          that.getGoods()
        } else {
          app.success0(res.ReturnMessage)
        }
      },
      complete: function () {
        // wx.hideLoading()
      }
    })
  },
  changetab: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    this.setData({ _thisplay: index})
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
    this.setData({ _thisplay: app.globalData.collect_type })
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
    this.getGoods()
    wx.stopPullDownRefresh()
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