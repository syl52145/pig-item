// pages/coupons/coupons.js

const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:util.req()+"/upload/weixin/",
    modalShow: true,
    merchantsArr: [
    //   {
    //     id:1,
    //     img_url: '/assets/img/my/ad.png',
    //     name: '世纪华联',
    //     brief: '蜀山区人气榜单',
    //     distance: '300',
    //     place:"23.012367,113.762909"
    //   },
     ]
  },
  closeModal: function () {
    this.setData({
      modalShow:false
    })
  },
  receive: function () {
    console.log(111)
    this.setData({
      modalShow:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    var userInfo = wx.getStorageSync("userInfo");
    wx.getLocation({
      type:'gcj02',
      success(res){
        var latitude=res.latitude;
        var longitude=res.longitude;
        util.post("/index.php/index/Service/ServiceBusinessList",{latitude,longitude}).then((res)=>{
          //console.log(res)
          _this.setData({
            merchantsArr:res.data.list
          })
        })
      }
    })
   //
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