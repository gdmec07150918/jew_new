// pages/EditAdress/EditAdress.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AdressInfo: {},
    region: ['北京市', '北京市', '东城区'],
    adressid: -1,
    IsDefault: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    let adressid = options.adressid;
    if (adressid == undefined) {} else {
      wx.showLoading({
        title: '获取地址信息...',
        mask: true
      })
      wx.request({
        url: 'https://jl.jewsoft.com/ASHX/CompanyServer.ashx?m=getAddress&t=' + Number(new Date()),
        data: {
          CAddressID: adressid
        },
        method: "GET",
        success: function(res) {
          wx.hideLoading()
          if (res.data.ReturnID === 1) {
            that.setData({
              AdressInfo: res.data.Rows[0],
              region: [res.data.Rows[0].ProvinceText, res.data.Rows[0].CityText, res.data.Rows[0].CountyText],
              adressid: adressid,
              IsDefault: res.data.Rows[0].IsDefault
            })
          } else {
            app.success0(res.data.ReturnMessage);
          }
        },
        complete: function() {
          // wx.hideLoading()
        }
      })
    }
  },
  changeRegin: function(e) {
    var value = e.detail.value;
    var AdressInfo = this.data.AdressInfo;
    AdressInfo.ProvinceText = value[0];
    AdressInfo.CityText = value[1];
    AdressInfo.CountyText = value[2];
    this.setData({ region: [value[0], value[1], value[2]]})
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
  keyvalue: function(e) {
    var name = e.currentTarget.dataset.name;
    var value = e.detail.value;
    var AdressInfo = this.data.AdressInfo;
    switch (name) {
      case 'pserson_name':
        AdressInfo.PersonName = value;
        break;
      case 'phone':
        AdressInfo.Phone = value;
        break;
      case 'adress':
        AdressInfo.Address = value;
        break;
      case 'zipcode':
        AdressInfo.ZipCode = value;
        break;
      case 'adr_name':
        AdressInfo.CAddressName = value;
        break;
    }
  },
  defaultChange: function (e) {
    this.data.IsDefault =  e.detail.value;
  },
  save: function() {
    var that = this
    let AdressInfo = this.data.AdressInfo;
    console.log(this.data.AdressInfo)
    wx.request({
      url: 'https://jl.jewsoft.com/ASHX/CompanyServer.ashx?m=modifyAddress&t=' + Number(new Date()),
      data: {
        "CAddressID": that.data.adressid, "CAddressName": AdressInfo.CAddressName, "PersonName": AdressInfo.PersonName,
        "Phone": AdressInfo.Phone, "Address": AdressInfo.Address, "ZipCode": AdressInfo.ZipCode,"Country": 1,
        "ProvinceText": AdressInfo.ProvinceText, "CityText": AdressInfo.CityText, "CountyText": AdressInfo.CountyText
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        if (res.data.ReturnID == 1) {
          app.success(res.data.ReturnMessage);
          wx.navigateBack({
            delta: 1
          })
        } else {
          app.success0(res.data.ReturnMessage);
        }
      }
    })
  },
  delete: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该收货地址？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: 'https://jl.jewsoft.com/ASHX/CompanyServer.ashx?m=deleteAddress&t=' + Number(new Date()),
            data: {
              CAddressID: that.data.adressid
            },
            method: "GET",
            success: function(res) {
              if(res.data.ReturnID == 1){
                app.success(res.data.ReturnMessage);
                wx.navigateBack({
                  delta: 1
                })
              } else {
                app.success0(res.data.ReturnMessage);
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  }
})