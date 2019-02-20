// pages/filter/filter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word: [],
    tradeGoodsType: [], //平台货类
    prop: [], //属性值
    tradeProp: [], //选中平台属性组
    tradeGoodsTypeValue: "", //选中的平台货类
    propValue: [], //选中的平台属性组
    wpmin: null, //最低批发价
    wpmax: null, //最高批发价
    zwmin: null, //最低连石重
    zwmax: null, //最高连石重
    gwmin: null, //最低金重
    gwmax: null, //最高金重
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'dataProp',
      success(res) {
        that.setData({
          word: res.data.word,
          tradeGoodsType: res.data.tradeGoodsType, //平台货类
          prop: res.data.prop, //属性值
          tradeProp: res.data.tradeProp, //选中平台属性组
          tradeGoodsTypeValue: res.data.tradeGoodsTypeValue, //选中的平台货类
          propValue: res.data.propValue, //选中的平台属性组
          wpmin: res.data.wpmin, //最低批发价
          wpmax: res.data.wpmax, //最高批发价
          zwmin: res.data.zwmin, //最低连石重
          zwmax: res.data.zwmax, //最高连石重
          gwmin: res.data.gwmin, //最低金重
          gwmax: res.data.gwmax, //最高金重
        })
        // var newArr = [], propValue = [];
        // let prop = res.data.prop;
        // var id= 0;
        // for (let t = 0; t < res.data.tradeGoodsType.length; t++) {
        //   if (res.data.tradeGoodsType[t].select) {
        //     id = res.data.tradeGoodsType[t].ID
        //     for (let i = 0; i < prop.length; i++) {
        //       // prop[i].selectText = [];
        //       // prop[i].selectValue = [];
        //       if (prop[i].ITID == 0 || prop[i].ITID == id) {
        //         // prop[i].Values[j].select = false;
        //         newArr.push(prop[i]);
        //       }
        //       for (let j = 0; j < prop[i].Values.length; j++) {
        //         if (prop[i].Values[j].select){
        //           propValue.push(prop[i].Values[j].VID);
        //         }
        //         // prop[i].Values[j].select = false;
        //       }
        //     }
        //   }
        // }
        // that.setData({
        //   tradeGoodsType: res.data.tradeGoodsType,
        //   prop: res.data.prop,
        //   word: res.data.word,
        //   tradeProp: newArr,
        //   tradeGoodsTypeValue: "" + id,
        //   propValue: propValue
        // })
      },
      fail(error) {
        // console.log(error)
        wx.request({
          url: 'https://jl.jewsoft.com/ASHX/FHomeServer.ashx?m=getSearchCondition&t=' + Number(new Date()),
          method: "GET",
          data: {
            "prop": true,
            "word": true,
            "tradeGoodsType": true,
            "propType": 2,
            "t": Math.round(Math.random() * 10000)
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            var prop = res.data.prop;
            var tradeGoodsType = res.data.tradeGoodsType;
            // var newprop = [],
            // newtradeGoodsType = [];
            for (let i = 0; i < tradeGoodsType.length; i++) {
              tradeGoodsType[i].select = false;
            }
            for (let i = 0; i < prop.length; i++) {
              prop[i].selectText = [];
              prop[i].selectValue = [];
              for (let j = 0; j < prop[i].Values.length; j++) {
                prop[i].Values[j].select = false;
              }
            }
            // console.log(tradeGoodsType)
            that.setData({
              tradeGoodsType: tradeGoodsType,
              prop: prop,
              word: res.data.word
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setStorage({
      key: 'IsRefresh',
      data: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("hide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.getStorage({
      key: 'IsRefresh',
      success(res) {
        if(res.data){
          return false;
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //选择平台货类
  tradeSelect: function(e) {
    var id = parseInt(e.currentTarget.dataset.id);
    var index = parseInt(e.currentTarget.dataset.index);
    var tradeGoodsType = this.data.tradeGoodsType;
    var hasChoose = false; //是否有选择货类
    var tradeGoodsTypeValue = ""; //选择的货类id
    for (let i = 0; i < tradeGoodsType.length; i++) {
      if (i != index) {
        tradeGoodsType[i].select = false;
      }
    }
    tradeGoodsType[index].select = !tradeGoodsType[index].select
    if (tradeGoodsType[index].select) {
      tradeGoodsTypeValue = "" + tradeGoodsType[index].ID;
      hasChoose = true
    } else {
      tradeGoodsTypeValue = "";
      hasChoose = false
    }
    var newArr = [];
    var prop = this.data.prop
    // console.log(hasChoose);
    if (hasChoose) { //选择了货类
      for (let i = 0; i < prop.length; i++) {
        prop[i].selectText = [];
        prop[i].selectValue = [];
        if (prop[i].ITID == 0 || prop[i].ITID == id) {
          // prop[i].Values[j].select = false;
          newArr.push(prop[i]);
        }
        for (let j = 0; j < prop[i].Values.length; j++) {
          prop[i].Values[j].select = false;
        }
      }
    }
    this.setData({
      tradeProp: newArr,
      tradeGoodsTypeValue: tradeGoodsTypeValue, //选中的货类
      tradeGoodsType: tradeGoodsType,
      propValue: []
    })
  },
  //选择对应属性值
  propSelect: function(e) {
    var i = parseInt(e.currentTarget.dataset.i);
    var j = parseInt(e.currentTarget.dataset.j);
    var vid = parseInt(e.currentTarget.dataset.vid);
    var val = e.currentTarget.dataset.val;
    var tradeProp = this.data.tradeProp;
    var propValue = this.data.propValue;
    tradeProp[i].Values[j].select = !tradeProp[i].Values[j].select;
    if (tradeProp[i].Values[j].select) { //选中添加，
      tradeProp[i].selectText.push(val);
      propValue.push(vid);
    } else { //否则删除
      let index = tradeProp[i].selectText.indexOf(val);
      tradeProp[i].selectText.splice(index, 1);
      let index2 = propValue.indexOf(vid)
      propValue.splice(index2, 1);
    }
    this.setData({
      tradeProp: tradeProp
    })
  },
  //搜索
  search: function() {
    var that = this;
    var word = this.data.word;
    var tradeGoodsType = this.data.tradeGoodsType;
    var prop = this.data.prop;
    wx.setStorage({
      key: 'dataProp',
      data: that.data
    })
    wx.setStorage({
      key: 'IsRefresh',
      data: true
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //重置
  rest: function() {
    var that = this;
    var tradeGoodsType = this.data.tradeGoodsType;
    for (let i = 0; i < tradeGoodsType.length;i++){
      tradeGoodsType[i].select = false
      // tradeGoodsType.push(that.data.tradeGoodsType[i])
    }
    this.setData({
      tradeGoodsType: tradeGoodsType, //平台货类
      tradeProp: [], //当前平台属性组
      tradeGoodsTypeValue: "", //选中的平台货类
      propValue: [], //选中的平台属性组
      wpmin: null, //最低批发价
      wpmax: null, //最高批发价
      zwmin: null, //最低连石重
      zwmax: null, //最高连石重
      gwmin: null, //最低金重
      gwmax: null, //最高金重
    })
  },
  //监听价格输入
  bindvalue: function(e) {
    var valueType = e.currentTarget.dataset.input;
    var value = parseInt(e.detail.value);
    switch (valueType) {
      case "wpmin":
        this.data.wpmin = value;
        break;
      case "wpmax":
        this.data.wpmax = value;
        break;
      case "zwmin":
        this.data.zwmin = value;
        break;
      case "zwmax":
        this.data.zwmax = value;
        break;
      case "gwmin":
        this.data.gwmin = value;
        break;
      case "gwmax":
        this.data.gwmax = value;
        break;
    }
  }
})