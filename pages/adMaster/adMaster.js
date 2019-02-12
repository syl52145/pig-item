// pages/adMaster/adMaster.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPutAd:false,//是否有广告投放
    adMaster:false,//是否为广告主
    list:{
      openid: "o-2FW48oz4zcK7gkFk1DMM4DkQO4", 
      company_name: null,
      legal_name: null,
      phone: null,
      status: 0,
      comments: [
          {
              launch_number: 200,
              out_time: 1546185600,
              launch_title: "蒙牛真果粒宣传广告",
              status: 0
          }
          
      ]
  }

  },
  reDate:function(date){ //时间戳转日期
    return util.date(date)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    var openid = userInfo.openid;
    if(openid){
      util.get('index.php/GetAdvertiserInfo',{openid}).then((res)=>{
        if(res.data){
          var user = res.data.list;
          var adlist = user.comments;
          delete user.comments;
          this.setData({
            list:user,
            adMaster:true
          })
          if(adlist==""){
            this.setData({
              isPutAd:false
            })
          }else{
            this.setData({
              isPutAd:true
            })
            for(var i=0;i<adlist.length;i++){
              var type = 'list.comments['+i+']';
              this.setData({
                [type]:{
                    launch_number: adlist[i].launch_number,
                    out_time: this.dateFormat(adlist[i].out_time),
                    launch_title: adlist[i].launch_title,
                    status: adlist[i].status
                }
              })
            }
          }
        }

      })
    }
    
  },
  putAd:function(){
    wx.navigateTo({url:'../putAd/putAd'})
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