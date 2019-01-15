// pages/display/display.js
import addorderPopup from "../addorderPopup/addorderPopup.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemsign: null,
    tabno: null,
    goods_news: [],
    Image0: [],
    // title: '账户管理'
    indicatorDots: true,
    istlove: false,
    autoplay: false,
    interval: 5000,
    duration: 300,
    _thisplay: 0,
    _thisplay2: 0,
    tabid: '',
    scrolltop: 150,
    visible: false,
    thisorder: null,
    htabs: null
  },
  // backpage: function () {
  //   console.log('463546')
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this;
    wx.request({
      url: 'https://gs.jewsoft.com/ASHX/ItemServer.ashx?m=itemInfo1',
      data: {
        "ItemSign": options.itemsign,"tabno":"","sid":"",
        "t": Math.round(Math.random() * 10000)
      },
      method: "GET",
      success: function (res) {
        if (res.data.ReturnID === 1) {
          that.setData({
            itemsign: options.itemsign,
            goods_news: res.data,
            Image0: res.data.Image0,
            istlove: res.data.Collection.Goods
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
    this.getorder()
  },
  loadpage: function(){},
  /*
    *关注
  */
  tlove: function () {
    var that = this;
    var istlove = this.data.istlove
    let pdata = {};
    if (istlove) {
      pdata = {
        "m": "deleteUAGoods", "ItemSign": this.data.itemsign,
        "t": Math.round(Math.random() * 10000)
      };
    } else {
      pdata = {
        "m": "addUAGoods", "ItemSign": this.data.itemsign,
        "t": Math.round(Math.random() * 10000)
      };
    }
    wx.request({
      url: 'https://gs.jewsoft.com/ASHX/UserServer.ashx',
      data: pdata,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.ReturnID === 1) {
          if (istlove) {
            that.setData({
              istlove: false
            })
          } else {
            that.setData({
              istlove: true
            })
          }
        }
      }
    })

  },
  // tab切换
  changetab: function (e) {
    var index = parseInt(e.target.dataset.index)
    var id = e.target.dataset.id
    console.log(id);
    this.setData({
      _thisplay2: index,
      tabid: id
    })
  },
  // nav切换
  changenavt: function(e){
    var index = parseInt(e.target.dataset.index)
    this.setData({
      _thisplay: index
    })
  },
  //获取当前订单
  getorder: function (){
    var that = this
    if (app.globalData.tabno === null) {
      wx.showLoading({
        title: '订单获取中',
        mask: true
      })
      wx.request({
        url: 'https://gs.jewsoft.com/Ashx/TabServer.ashx?m=companyTab',
        method: "GET",
        success: function (res) {
          if (res.data.tabs.length > 0) {
            app.globalData.tabno = res.data.tabs[0].tabno
          } else {
            //创建订单
            wx.request({
              url: 'https://gs.jewsoft.com/Ashx/TabServer.ashx?m=createCompanyTab',
              method: "GET",
              success: function (res) {
                if (res.data.ReturnID === 1) {
                  app.globalData.tabno = res.data.tab_no
                } else {
                  app.success0(res.data.ReturnMessage)
                }
              }
            })
          }
        }, complete: function () {
          wx.hideLoading()
        }
      })
    }
  },
  //跳转当前订单
  linkorder: function () {
    // this.getorder()
    wx.navigateTo({
      url: '/pages/order/order?tabno=' + app.globalData.tabno,
    })
  },
  //加入订单弹窗
  openOrderPopup: function () {
    // this.getorder()
    var that = this
    if (this.data.thisorder == null) {
      wx.showLoading({
        title: '获取货品信息...',
        mask: true
      })
      wx.request({
        url: 'https://gs.jewsoft.com/ASHX/TabServer.ashx?m=tabGoodsList',
        data: {
          "tabno": app.globalData.tabno, "ItemSign": this.data.itemsign,
          "t": Number(new Date())
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.ReturnID === 1) {
            that.setData({
              visible: true,
              thisorder: res.data.Items,
              htabs: res.data.htabs
            })
          } else {
            app.success0(res.data.ReturnMessage)
          }
        }, complete: function () {
          wx.hideLoading()
          that.setData({
            visible: true
          })
        }
      })
    }else{
      that.setData({
        visible: true
      })
    }
  },
  //关闭弹窗
  closePopup: function(){
    this.setData({ visible: false })
  },
  //保存订单（弹窗）
  saveorder: function (e) {
    addorderPopup.saveorder(app.globalData.tabno, this)
  },
  //数量+1
  countplus: function (e) {
    addorderPopup.countplus(e,this)
  },
  //数量+1
  countminus: function (e){
    addorderPopup.countminus(e, this)
  },
  //数量编辑
  countblur: function (e) {
    addorderPopup.countblur(e, this)
  },
  //做货要求
  askblur: function (e) {
    addorderPopup.askblur(e, this)
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
    //停止下拉刷新
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