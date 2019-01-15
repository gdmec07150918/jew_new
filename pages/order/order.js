// pages/order/order.js
import addorderPopup from "../addorderPopup/addorderPopup.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1,
    tabno: null,
    DefaultAdr: null,
    tab: null,
    handInchs:null,
    action: null,
    visible: false,
    thisorder: null,
    htabs: null,
    //展开手寸
    displayhands: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // this.loadpage("201809182865")
    this.loadpage(options.tabno)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (tabno) {
    
  },
  tabselect: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    console.log(index)
    this.setData({
      active: index
    })
  },
  loadpage: function (tabno){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this
    var s_count = new Array()
    var s_money = new Array()
    var s_weight = new Array()
    var hands = new Array()
    //订单详情数据
    wx.request({
      url: 'https://gs.jewsoft.com/Ashx/TabServer.ashx?m=tabInfoPage3',
      method: "POST",
      data: { "tabno": tabno, "t": Math.round(Math.random() * 10000) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.ReturnID === 1) {
          var displayhands = that.data.displayhands;
          for (let i = 0; i < res.data.tab.goods.length; i++){
            displayhands.push(false)
            s_count[i] = 0
            s_money[i] = 0
            s_weight[i] = 0
            for (let j = 0; j < res.data.tab.goods[i].handInchs.length; j++){
              s_count[i] += res.data.tab.goods[i].handInchs[j].count
              s_money[i] += res.data.tab.goods[i].handInchs[j].money
              s_weight[i] += res.data.tab.goods[i].handInchs[j].weight
            }
            hands.push({
              count: s_count[i],
              money: s_money[i],
              weight: s_weight[i]
            })
          }
          that.setData({
            tabno: tabno,
            DefaultAdr: res.data.DefaultAdr,
            tab: res.data.tab,
            handInchs: hands,
            action: res.data.Action,
            displayhands: displayhands
          })
        } else {

        }
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  //移入关注/删除
  deletetabGoods: function (wtgSigns, iscollect) {
    console.log(wtgSigns); console.log(iscollect);
    var that = this
    wx.request({
      url: 'https://gs.jewsoft.com/Ashx/TabServer.ashx?m=deletetabGoods',
      method: "POST",
      data: { "tabno": this.data.tabno, "wtgSigns": wtgSigns, "isCollect": iscollect, "t": Math.round(Math.random() * 10000) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.ReturnID === 1 ){
          wx.showToast({
            title: res.data.ReturnMessage,
            mask: true,
            duration: 1000,
            success: function() {
              that.loadpage(that.data.tabno)
            }
          })
        }
      }
    })
  },
  //更多
  more_modify: function(e){
    var that = this
    var wtgsigns = e.currentTarget.dataset.wtgsigns;
    wx.showActionSheet({
      itemList: ['移入关注','删除'],
      success: function(res){
        switch (res.tapIndex){
          case 0:
            that.deletetabGoods(wtgsigns,true)
            break;
          case 1:
            that.deletetabGoods(wtgsigns, false)
            break;
        }
      }
    })
  },
  //展开手寸
  displayhands: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    let displayhand = this.data.displayhands
    displayhand[index] = !displayhand[index]
    // console.log(displayhands[index])
    this.setData({
      displayhands: displayhand
    })
  },
  //货品修改按钮
  openOrderPopup: function(e){
    let itemsign = e.currentTarget.dataset.sign;
    var that = this
    wx.showLoading({
      title: '获取货品信息...',
      mask: true
    })
    wx.request({
      url: 'https://gs.jewsoft.com/ASHX/TabServer.ashx?m=tabGoodsList',
      data: {
        "tabno": "201809182865", "ItemSign": itemsign,
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
    
  },
  //关闭弹窗
  closePopup: function () {
    this.setData({ visible: false })
  },
  //保存订单（弹窗）
  saveorder: function (e) {
    //201809182865
    addorderPopup.saveorder(this.data.tabno, this)
    this.loadpage(this.data.tabno)
    
  },
  //数量+1
  countplus: function (e) {
    addorderPopup.countplus(e, this)
  },
  //数量+1
  countminus: function (e) {
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
    this.loadpage(this.data.tabno)
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