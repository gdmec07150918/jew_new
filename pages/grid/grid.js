// pages/grid/grid.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: 1,
    loadsize: 0,
    gssize: 20,
    allgoods: [],
    scrollT: 0,
    scrollP: 0,
    showheader: true,
    column: true,
    flag: 0,
    txt: '',
    it: "",
    prop: "",
    ord: 6,
    choose: 6,
    select_price: false,
    wpmin: "", //最低批发价
    wpmax: "", //最高批发价
    zwmin: "", //最低连石重
    zwmax: "", //最高连石重
    gwmin: "", //最低金重
    gwmax: "", //最高金重
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // this.setData({
    //   txt: options.txt
    // })
    wx.setStorage({
      key: 'IsRefresh',
      data: true
    })
    wx.getStorage({
      key: 'item_sortType',
      success(res) {
        that.setData({
          column: res.data,
          txt: options.txt
        })
      },
      fail(error) {
        that.setData({
          txt: options.txt
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'IsRefresh',
      success(res) {
        if (res.data) {
          wx.getStorage({
            key: 'dataProp',
            success: function(res) {
              that.data.allgoods = []
              that.setData({
                pid: 1,
                ord: 6,
                wpmin: (res.data.wpmin == null ? "" : res.data.wpmin),
                wpmax: (res.data.wpmax == null ? "" : res.data.wpmax),
                zwmin: (res.data.zwmin == null ? "" : res.data.zwmin),
                zwmax: (res.data.wpmin == null ? "" : res.data.zwmax),
                gwmin: (res.data.gwmin == null ? "" : res.data.gwmin),
                gwmax: (res.data.gwmax == null ? "" : res.data.gwmax),
                it: res.data.tradeGoodsTypeValue,
                prop: res.data.propValue.join('_'),
              })
              that.loadPage()
            },
            fail: function(error) {
              that.loadPage()
            }
          })
          wx.setStorage({
            key: 'IsRefresh',
            data: false
          })
        }
      }
    })

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
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.gssize === this.data.loadsize) {
      this.setData({
        pid: this.data.pid + 1
      })
      this.loadPage()
    }
  },
  sortTypeChange: function() {
    this.setData({
      column: !this.data.column
    })
    wx.setStorage({
      key: 'item_sortType',
      data: this.data.column
    })
  },
  //监听页面滚动
  onPageScroll: function(e) {
    var scrollTop = e.scrollTop;
    if (scrollTop == 0) {
      this.setData({
        showheader: true
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  loadPage: function() {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: 'https://jl.jewsoft.com/ASHX/ItemServer.ashx?m=itemList1&t=' + Math.round(Math.random() * 10000),
      method: "POST",
      data: {
        "cno": "",
        "pid": this.data.pid,
        "psize": this.data.gssize,
        "ord": this.data.ord,
        "txt": that.data.txt,
        "prop": this.data.prop,
        "it": this.data.it,
        "fgt": "",
        "xsk": "",
        "lpmin": "",
        "lpmax": "",
        "wpmin": this.data.wpmin,
        "wpmax": this.data.wpmax,
        "zwmin": this.data.zwmin,
        "zwmax": this.data.zwmax,
        "gwmin": this.data.gwmin,
        "gwmax": this.data.gwmax,
        cno: "",
        swmin: "",
        swmax: "",
        zwmin: "",
        zwmax: "",
        ctmin: "",
        ctmax: "",
        tabNo: "",
        xl: "",
        kslb: "",
        zk: "",
        shid: "",
        stid: ""
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.ReturnID === 1) {
          var length = that.data.allgoods.length
          var gsarr = that.data.allgoods
          for (var i = 0; i < res.data.Items.length; i++) {
            gsarr[length + i] = res.data.Items[i]
          }
          that.setData({
            loadsize: res.data.Items.length,
            allgoods: gsarr
          })
        } else {

        }
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  handletouchmove: function(event) {
    console.log(event)
    if (this.data.flag !== 0) {
      return
    }
    // let currentX = event.touches[0].pageX;
    let currentY = event.touches[0].pageY;
    // let tx = currentX - this.data.lastX;
    let ty = currentY - this.data.lastY;
    //左右方向滑动
    // if (Math.abs(tx) > Math.abs(ty)) {
    // }
    // //上下方向滑动
    // else {

    // } 
    if (ty < 0) {
      this.data.flag = 3

    } else if (ty > 0) {
      this.data.flag = 4
    }

    //将当前坐标进行保存以进行下一次计算
    // this.data.lastX = currentX;
    this.data.lastY = currentY;
  },

  handletouchtart: function(event) {
    // this.data.lastX = event.touches[0].pageX;
    this.data.lastY = event.touches[0].pageY;
  },
  handletouchend: function(event) {
    console.log(this.data.flag);
    var flag = this.data.flag;
    var show = true;
    if (flag == 4) {
      show = false;
    } else {
      show = true;
    }
    this.data.flag = 0
    this.setData({
      showheader: show
    });
  },
  //排序方式
  sortType: function(e) {
    var id = parseInt(e.currentTarget.dataset.sort);
    console.log(e);
    if (id !== 3) {
      this.setData({
        ord: id,
        pid: 1,
        select_price: false
      })
      this.loadPage()
    }
  },
  //价格排序
  select_price: function() {
    this.setData({
      select_price: !(this.data.select_price)
    })
  },
  navigateBack1: function() {
    app.navigateBack1()
  }
})