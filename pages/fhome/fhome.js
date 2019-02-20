const app = getApp()
// pages/fhome/fhome.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Finfo: null,
    _thisplay2: 0,
    scrollTop: 0,
    pid: 1,
    allgoods: [],
    newitem: [],
    gssize: 20,
    gsNum: 0,
    collect: false,
    lazyload: true,
    headerImg: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this
    wx.getSystemInfo({
      success: function(e) {
        that.setData({
          height: (e.windowHeight) + "px"
        })
        console.log(e.windowHeight)
      }
    })
    wx.request({
      url: 'https://jl.jewsoft.com/ASHX/FHomeServer.ashx?m=getHomeData&fsign=' + options.fsign,
      method: "GET",
      success: function(res) {
        if (res.data.ReturnID === 1) {
          wx.setNavigationBarTitle({
            title: res.data.Info.Name,
          })
          for (let i = 0; i < res.data.Images.length; i++) {
            if (res.data.Images[i].ImageType === 3) {
              that.data.headerImg = 'https://jl.jewsoft.com/' + res.data.Images[i].ImageURL;
            } else {
              that.data.headerImg = 'https://jl.jewsoft.com/images/5a72b5c2Ne07b1ce2.jpg';
            }
          }
          that.setData({
            Finfo: res.data,
            collect: res.data.Info.Collection,
            headerImg: that.data.headerImg
          })
        }
        wx.hideLoading()
      }
    })
  },
  //搜索商品
  searchgoods: function() {
    wx.navigateTo({
      url: '/pages/searchGoods/searchGoods',
    })
  },
  //打电话
  callphone: function(e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  // onPageScroll: function (ev) {
  //   var _this = this;
  //   if (ev.scrollTop >=600){
  //     this.setData({
  //       gotop: true
  //     })
  //   }else{
  //     this.setData({
  //       gotop: false
  //     })
  //   }

  //   if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
  //     this.setData({
  //       scroll: false
  //     })
  //   } else {
  //     this.setData({
  //       scroll: true
  //     })
  //   }
  //   setTimeout(function () {
  //     _this.setData({
  //       scrollTop: ev.scrollTop
  //     })
  //   },0)
  // },
  gotop: function() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  //切换
  changetab: function(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    if (index === 1) {
      //获取全部货品数据
      if (this.data.allgoods.length < 1) this.getAllGoods()
    } else if (index === 2) {
      //获取上新货品数据
      if (this.data.newitem.length < 1) this.getnewItem()
    } else {
      if (index == 3) {
        //做跳转
        return
      }
    }
    this.setData({
      _thisplay2: index
    })
  },
  //
  //收藏
  collect: function(e) {
    wx.showLoading({
      title: '处理中...',
      mask: true
    })
    var m = "";
    if (e.currentTarget.dataset.collect === '1') {
      m = "deleteUACompany";
    } else {
      m = "addUACompany";
    }
    var that = this
    wx.request({
      url: 'https://jl.jewsoft.com/ASHX/UserServer.ashx?m=' + m,
      method: "POST",
      data: {
        "sign": app.globalData.userInfo2.Info.CurrCompanySign,
        "t": Math.round(Math.random() * 10000)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.ReturnID === 1) {
          wx.showToast({
            title: res.data.ReturnMessage,
            mask: true
          })
          that.setData({
            collect: !that.data.collect
          })
        }
      },
      complete: function() {
        wx.hideLoading()
      }
    })
    // console.log(!this.data.collect)
  },
  //获取全部货品
  getAllGoods: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this
    wx.request({
      url: 'https://jl.jewsoft.com/ASHX/ItemServer.ashx?m=itemList1',
      method: "POST",
      data: {
        "cno": "",
        "pid": this.data.pid,
        "psize": this.data.gssize,
        "ord": 6,
        "txt": "",
        "prop": "",
        "it": "",
        "fgt": "",
        "xsk": "",
        "lpmin": "",
        "lpmax": "",
        "wpmin": "",
        "wpmax": "",
        "swmin": "",
        "swmax": "",
        "gwmin": "",
        "gwmax": "",
        "t": Math.round(Math.random() * 10000)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.ReturnID === 1) {
          //小程序无push方法，所以只能如此添加数组
          var length = that.data.allgoods.length
          var gsarr = that.data.allgoods
          for (var i = 0; i < res.data.Items.length; i++) {
            gsarr[length + i] = res.data.Items[i]
          }
          that.setData({
            allgoods: gsarr,
            gsNum: res.data.Items.length
          })
        }
        wx.hideLoading()
      }
    })
  },
  //上新货品
  getnewItem: function() {
    if (this.data.newitem.length === 0) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
    }
    var that = this
    wx.request({
      url: 'https://jl.jewsoft.com/ASHX/ItemServer.ashx?m=newItem',
      method: "GET",
      data: {
        "CompanySign": "A5507898C0C84014A455D48F47941B08",
        // "CompanySign": app.globalData.userInfo2.Info.CurrCompanySign,
        "t": Math.round(Math.random() * 10000)
      },
      success: function(res) {
        if (res.data.ReturnID === 1) {
          that.setData({
            newitem: res.data
          })
        }
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    //全部货品的上拉加载
    if (this.data._thisplay2 === 1) {
      //返回数和请求数相同才再次加载，不相同则说明数据不够（即无更多数据）
      if (this.data.gsNum === this.data.gssize) {
        this.setData({
          pid: this.data.pid + 1
        })
        this.getAllGoods()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})