// pages/my/my.js
const util = require('../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    userInfo: {},
    mode: 'scaleToFill',
    review:["未认证","审核中","已认证","审核不通过"],
    reviewAd:["未申请","审核中","已通过","审核不通过"],
    role:0, //0游客 1司机 2广告主
    Authentication:0, //0未认证 1 2 3 
    userStatus:1, //0禁用 1正常
    buttonData: [
    {
      src: '/assets/img/my/alarm.png',
      text: '警报',
      url: '../alarm/alarm'
    },
    {
      src: '/assets/img/my/ad.png',
      text: '我的广告',
      url: '../adMasterApprove/adMasterApprove'
    },
    {
      src: '/assets/img/my/card_bag.png',
      text: '卡包',
      url: '../cardBag/cardBag'
    }],
  },
  goTo:function(e) {
    var index = e.currentTarget.dataset.index;
    var url = e.currentTarget.dataset.url;
    if(!this.data.isLogin){
      wx.showToast({
        title: '请登录后使用',
        icon: 'loading',
        duration:1000
      })
      return;
    }
    if(this.data.userStatus==0){
      this.isForbidden();
      return;
    }
    if(index==0){
      wx.navigateTo({url: '../alarm/alarm'})
      return;
    }
    if(index==1){
      if(this.data.role==0){
        if(this.data.Authentication==1){//认证中
          wx.navigateTo({url: '../driverReview/driverReview'})
          return;
        }else{
          var status = this.data.Authentication;
          wx.navigateTo({url: url+'?status='+status});
          return;
        }
      };
        if(this.data.role==1){
          wx.showToast({
            title: '暂不可使用',
            icon: 'loading',
            duration: 1000
          })
          return;
        }
        if(this.data.role==2){//广告主
          if(this.data.Authentication==1){//认证中
            wx.navigateTo({url: '../driverReview/driverReview'})
            return;
          }else if(this.data.Authentication==2){//认证 通过
            wx.navigateTo({url: '../adMaster/adMaster'})
            return;
          }else{
            var status = this.data.Authentication;
            wx.navigateTo({url: url+'?status='+status});
            return;
          }

        }
    }
    //var url = e.target.dataSet
    if(index==2){
      wx.showToast({
        title: '暂不可用',
        icon: 'loading',
        duration: 1000
      })
    }
    
  },
  review:function(e){
    var url = e.currentTarget.dataset.url;
    var status = this.data.Authentication;
    if(!this.data.isLogin){
      wx.showToast({
        title: '请登录后使用',
        icon: 'loading',
        duration:1000
      })
      return;
    }
    if(this.data.userStatus==0){
      this.isForbidden();
      return;
    }
    if(this.data.role==2){//广告主
      if(status==1){//认证中
        wx.navigateTo({url: '../driverReview/driverReview'})
        return;
      }else if(status==2){//认证 通过
        wx.navigateTo({url: '../adMaster/adMaster'})
        return;
      }else{
        status
        wx.navigateTo({url: url+'?status='+status});
        return;
      }
    }
    if(this.data.role==1){//司机
      if(status==1){//认证中
        wx.navigateTo({url: '../driverReview/driverReview'})
        return;
      }else if(status==2){//认证 通过
        wx.navigateTo({url: '../driverPass/driverPass'})
        return;
      }else{
        wx.navigateTo({url: url+'?status='+status});
        return;
      }
    }
    
    wx.navigateTo({url: url+'?status='+status});

  },
  cashList:function(){
    if(!this.data.isLogin){
      wx.showToast({
        title: '请登录后使用',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    if(this.data.userStatus==0){
        this.isForbidden();
        return;
    }
    var url = "../withdrawalRecord/withdrawalRecord"
    wx.navigateTo({url: url})
  },
  goCash:function(){
    if(!this.data.isLogin){
      wx.showToast({
        title: '请登录后使用',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    if(this.data.userStatus==0){
      this.isForbidden();
      return;
    }
    if(this.data.role==0){
      wx.showToast({
        title: '您没有权限',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    var openid = this.data.userInfo.openid;
    util.get("index.php/SetWithdrawalInfo",{openid}).then((res)=>{
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000
      })
    })
  },
  isForbidden:function(){ //被禁用提示
      wx.showToast({
        title: '账号被禁用',
        icon: 'loading',
        duration: 2000
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this; 
    var userInfo = wx.getStorageSync("userInfo");
    if(userInfo){
      _this.setData({
        isLogin:true,
        role:userInfo.role,
        Authentication:userInfo.authentication,
        userInfo:userInfo,
        userStatus:userInfo.status,      
      })
      if(userInfo.role==1 || _this.data.role==1){
        _this.setData({
          'buttonData[1]':{
            src: '/assets/img/my/task.png',
            text: '任务指派',
            url: ''
          }
        })
      }
    }

    
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
    this.getMy();
  },
  getMy:function(){ //获取我的页面
    var _this=this;
    var userInfo = wx.getStorageSync("userInfo");
    if(userInfo){
      var openid = userInfo.openid;
      util.get("index.php/GetMyInfo",{openid:openid}).then((res)=>{
        if(res.code==1){
          _this.setData({
            isLogin:true,
            role:res.data.list.role,
            userInfo:res.data.list,
            Authentication:res.data.list.authentication,
            userStatus:res.data.list.status
          })
        }
      })
    }
  },
  getUserInfo:function(e){
    if(e.detail.userInfo){
      wx.showToast({
        title: '登录中',
        icon: 'loading',
        duration:1000
      })
      wx.setStorageSync("userInfo", e.detail.userInfo);
      app.login(this.getMy);
      
    }
    // else{
    //   this.openSetting();
    // }
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