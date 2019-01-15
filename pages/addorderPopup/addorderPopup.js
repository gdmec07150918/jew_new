// pages/addorderPopup/addorderPopup.js
var app = getApp()
var addorderPopup = {
  //保存订单
  saveorder: function (tabno,that) {
    var thisorder = that.data.thisorder
    var model = new Array()
    for (var i = 0; i < thisorder.length; i++) {
      var counts = new Array()
      for (var j = 0; j < thisorder[i].HandInchCounts.length; j++) {
        counts[j] = {
          "ghandInchID": thisorder[i].HandInchCounts[j].HandInchID,
          "ghandInch": thisorder[i].HandInchCounts[j].HandInch,
          "gcount": thisorder[i].HandInchCounts[j].Count,
        }
      }
      model[i] = {
        "ItemSign": thisorder[i].ItemSign,
        "gpurity": thisorder[i].purityID,
        "gask": thisorder[i].ask,
        "Counts": counts
      }
    }
    wx.request({
      url: 'https://gs.jewsoft.com/ASHX/TabServer.ashx?m=modifytabGoods&tabno=' + tabno + "&t=" + Number(new Date()),
      data: JSON.stringify(model),
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.ReturnID === 1) {
          app.success(res.data.ReturnMessage)
        } else {
          app.success0(res.data.ReturnMessage)
        }
        that.loadpage(tabno)
      },
      complete: function(){
        that.setData({ visible: false })
      }
    })
  },
  //数量增加
  countplus: function (obj,that) {
    var index0 = parseInt(obj.currentTarget.dataset.index1)
    var index = parseInt(obj.currentTarget.dataset.index)
    var thisorder = that.data.thisorder
    thisorder[index0].HandInchCounts[index].Count = thisorder[index0].HandInchCounts[index].Count + 1
    thisorder[index0].TotalCount = thisorder[index0].TotalCount + 1

    that.setData({
      thisorder: thisorder
    })
  },
  //数量减少
  countminus: function (obj, that) {
    var index0 = parseInt(obj.currentTarget.dataset.index1)
    var index = parseInt(obj.currentTarget.dataset.index)
    var thisorder = that.data.thisorder
    if (thisorder[index0].HandInchCounts[index].Count > 0) {
      thisorder[index0].HandInchCounts[index].Count = thisorder[index0].HandInchCounts[index].Count - 1
      thisorder[index0].TotalCount = thisorder[index0].TotalCount - 1
    } else {
      return false
    }

    that.setData({
      thisorder: thisorder
    })
  },
  //数量编辑失去焦点
  countblur: function (obj, that) {
    var index0 = parseInt(obj.currentTarget.dataset.index1)
    var index = parseInt(obj.currentTarget.dataset.index)
    var value = obj.detail.value
    var thisorder = that.data.thisorder
    if (value === "") {
      thisorder[index0].HandInchCounts[index].Count = 0
    }else{
      thisorder[index0].HandInchCounts[index].Count = parseInt(value)
    }
    var num = 0
    for (var i = 0; i < thisorder[index0].HandInchCounts.length; i++) {
      num += thisorder[index0].HandInchCounts[i].Count
    }
    //总件数
    thisorder[index0].TotalCount = num
    that.setData({
      thisorder: thisorder
    })
  },
  //做货要求
  askblur: function (obj, that) {
    var index0 = parseInt(obj.currentTarget.dataset.index1)
    var value = obj.detail.value
    var thisorder = that.data.thisorder
    thisorder[index0].ask = value
    that.setData({
      thisorder: thisorder
    })
  },
  //成色
}
export default addorderPopup
