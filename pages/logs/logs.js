//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    wx.showModal({
      title: "警告",
      content: "尚未进行授权，请点击确定跳转到授权页面进行授权。",
      success: function (res) {
      if (res.confirm) {
      console.log("用户点击确定")
      
      }else{
        console.log("取消")
      }
      }
    })
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
