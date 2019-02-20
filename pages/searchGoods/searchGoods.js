// pages/searchGoods/searchGoods.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    del_input: false,
    focus: true,
    jewsoft_ky_arr: [],
    keywordList: [],
    matchItem: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'jewsoft_ky_arr',
      success(res) {
        // that.data.jewsoft_ky_arr = res.data
        that.setData({ jewsoft_ky_arr: res.data})
        console.log(res)
      }
    })
    wx.request({
      url: 'https://jl.jewsoft.com/ASHX/FHomeServer.ashx?m=getSearchCondition',
      method: "GET",
      data: {
        "prop": 1, "propType": 2, "t": Math.round(Math.random() * 10000)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        if (data.ReturnID == 1) {
          var arr = new Array();
          for (var i = 0; i < data.prop.length; i++) {
            for (var j = 0; j < data.prop[i].Values.length; j++) {
              //if (histextArr[i].text == text)
              var val = data.prop[i].Values[j].VAL;
              if (arr.indexOf(val) < 0) {
                arr.push(data.prop[i].Values[j].VAL)
              }
            }
          }
          that.data.keywordList = arr;
        } else {
          app.success0(data.ReturnMessage);
        }
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
  },
  //监听输入框
  binput: function(e){
    var value = e.detail.value;
    this.data.value = value
    var show = this.data.del_input;
    var keywordArr = [];
    if (value == "") {
      this.setData({
        del_input: false,
        matchItem: keywordArr
      })
    } else{
      var loadkw_arr = this.data.keywordList;
      var len = loadkw_arr.length;
      // console.log(len);
      var reg = new RegExp(value);
      for (var i = 0; i < len; i++) {
        if (loadkw_arr[i].match(reg)) {
          var text = loadkw_arr[i]
          var html = loadkw_arr[i].replace(new RegExp("(" + value + ")", "ig"), '<span class="bold">' + value + '</span>');
          // keywordArr.push(newtext);
          keywordArr.push({
            text: text,
            html: html
          })
        }
      }
      // console.log(keywordArr);
      // this.setData({ matchItem})

      if (!show) {
        this.setData({
          del_input: true,
          matchItem: keywordArr
        })
      }else{
        this.setData({
          matchItem: keywordArr
        })
      }
    }

  },
  //搜索货品
  searchGrid: function(){
    try {
      wx.removeStorageSync('dataProp')
    } catch (e) {
      // Do something when catch error
    }
    var value = this.data.value;
    this.setData({ value: value})
    this.updateHistory(value);
  },
  //更新历史搜索内容
  updateHistory: function (value) {
    var keyword = this.data.jewsoft_ky_arr;
    if (value != "") {
      var haskeyword = false;
      //查找该数组
      for (var i = 0; i < keyword.length; i++) {
        if (keyword[i] == value) {
          haskeyword = true;
          //先从记录中删除
          keyword.splice(i, 1);
          break;
        }
      }
      keyword.splice(0, 0, value);
    }
    wx.setStorage({
      key: 'jewsoft_ky_arr',
      data: keyword
    })
    this.setData({ jewsoft_ky_arr: keyword })
    wx.navigateTo({
      url: '/pages/grid/grid?txt=' + value
    })
  },
  del_input: function() {
    this.setData({ del_input: false, value: ''})
  },
  //删除历史搜索
  removekey: function(e){
    var that = this;
    var value = e.currentTarget.dataset.name;
    wx.showModal({
      title: '',
      content: '确定删除该历史记录？',
      confirmColor: '#ffb03f',
      success(res) {
        if (res.confirm) {
          var keyword = that.data.jewsoft_ky_arr;
          for (var i = 0; i < keyword.length; i++) {
            if (keyword[i] == value) {
              //先从记录中删除
              keyword.splice(i, 1);
              break;
            }
          }
          wx.setStorage({
            key: 'jewsoft_ky_arr',
            data: keyword
          })
          that.setData({ jewsoft_ky_arr: keyword })
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  //删除所有历史搜索
  removeAllkw: function() {
    var that =  this;
    wx.showModal({
      title: '',
      content: '确定删除所有历史记录？',
      confirmColor: '#ffb03f',
      success(res) {
        if (res.confirm) {
          // var keyword = that.data.jewsoft_ky_arr;
          // console.log('用户点击确定')
          wx.setStorage({
            key: 'jewsoft_ky_arr',
            data: []
          })
          that.setData({ jewsoft_ky_arr: [] })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  //点击历史记录
  navigatorgrid: function (e) {
    try {
      wx.removeStorageSync('dataProp')
    } catch (e) {
      // Do something when catch error
    }
    var text = e.currentTarget.dataset.name;
    this.updateHistory(text);
    wx.navigateTo({
      url: '/pages/grid/grid?txt=' + text
    })
  }
})