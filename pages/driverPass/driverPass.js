// pages/driverPass/driverPass.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null
  //   list: {
  //     openid: "o-2FW48oz4zcK7gkFk1DMM4DkQO4",
  //     username: "XXX",
  //     phone1: "13825341905",
  //     vehicle_license: "p40166",
  //     comments: [
  //         {
  //             screen_number: "e123456",
  //             status: 1,
  //             deposit: "50"
  //         },
  //         {
  //             screen_number: "e654321",
  //             status: 1,
  //             deposit: "50"
  //         }
  //     ]
  // }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this. getDriverPass();
   
    
  },
  getDriverPass:function(){
    var userInfo = wx.getStorageSync("userInfo");
    var openid = userInfo.openid;
    util.get("index.php/GetDriverInfo",{openid}).then(
      (res)=>{
         this.setData({
          list:res.data.list
         })
      }
    )
  },
  scan:function(){
    wx.scanCode({
      success: (res) => {
        var openid = this.data.list.openid;
        util.post('index.php/SetDriverInsert?'+res.result+'&openid='+openid).then((res)=>{
          wx.showToast({
            title:res.msg,
            icon:'loading',
            duration:2000
          })
          if(res.code==1){
            this. getDriverPass();
          }
        })
      }
    })
  },
  untying:function(e){
    var code = e.currentTarget.dataset.number;
    var openid = this.data.list.openid;
    util.post('index.php/SetUnbind',{openid,code}).then((res)=>{
      wx.showToast({
        title:res.msg,
        icon:'loading',
        duration:2000
      })
      if(res.code==1){
        this. getDriverPass();
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

  }
})