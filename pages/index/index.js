//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
var url = 'wss://xrz.xq.hk/index.php/index/Api/getaddress';
var latitude = '',longitude = '',angle='';
var socketOpen = false;
var SocketTask = false;
Page({
  data: {
    timer:false,
    showModal:false,//弹窗
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    getUserInfoFail:false,
    longitude:"",
    latitude:"",
    scale:16,
    marker:[
      // {
      //   iconPath: '/assets/img/map/car.png',
      //   latitude:'23.02075',
      //   longitude:'113.75160',
      //   callout:{
      //     content:'aaa',
      //     borderRadius:'50%',
      //     bgColor:'',
      //     padding:1,
      //     display:'ALWAYS',
      //     textAlign:'center'
      //   }
      // }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var _this=this;
    var userInfo = wx.getStorageSync("userInfo");
    if(userInfo){
      app.login(this.dataInit);
    }else{
      _this.setData({
        showModal:true
      })
    }
    wx.onCompassChange(function(res){      
        angle = res.direction
    })
    _this.getLocation();
    //var timter = setInterval(_this.getLocation,3000)
      
  },
  setInterval:function(){
    var _this=this
    var timer = setInterval(function(){
      if(_this.data.timer){
        clearInterval(timer);
      }
      _this.getLocation();
    },3000);
    
  },
  getLocation:function(){//获取地图
    var _this=this;
    wx.getLocation({
      type: "gcj02",
      success(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        _this.setData({
          'marker[0]': {
            iconPath: '/assets/img/map/car.png',
            latitude: latitude,
            longitude: longitude,
            width: 30,
            height: 15,
            rotate:angle+90
          }
        })
        if(_this.data.latitude==''){
          _this.setData({
            latitude: latitude,
            longitude: longitude
          })
        }else{
          _this.getMapCenter()
        }
        _this.getMapData(latitude,longitude);
      
      }
    })
  },
  getMapCenter:function(){
    var _this=this;
    _this.mapCtx.getCenterLocation({
      success(res){
        _this.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
      }
    })
  },
  getMapData:function(latitude,longitude){
    var _this=this;
    util.post('index.php/getaddress', { latitude, longitude }).then((res) => {
      if (res.code == 1) {
        var list = res.data.list;
        if(!list){
          _this.setData({
            timer:true
          })
          return;
        }
        var length = list.length;
        for (var i = 0; i < length; i++) {
          var type = 'marker[' + i + 1 + ']';
          var type1 = 'marker[' + length + 1 + i + ']';
          var la1 = latitude,
            lo1 = longitude,
            la2 = list[i].address.lat,
            lo2 = list[i].address.lng;
          var s = _this.distance(la1, lo1, la2, lo2);
          if (list[i].police == 0) {
            var pic = '/assets/img/map/stop.png';
          } else if (list[i].police == 1) {
            var pic = '/assets/img/map/ok.png';
          } else {
            var pic = '/assets/img/map/err.png';
          }
          _this.setData({
            [type]: {
              id: i,
              iconPath: pic,
              latitude: list[i].address.lat,
              longitude: list[i].address.lng,
              zIndex: 100,
              width: 24,
              height: 32,
              callout: {
                content: list[i].code + '\n距离' + s + 'KM',
                borderRadius: 10,
                bgColor: '#ffffff',
                padding: 5,
                display: 'BYCLICK',
                textAlign: 'center',
                fontSize: 12,
                borderColor: '#fcfcfc'
              }
            },
            [type1]: {
              id: length + i,
              iconPath: '/assets/img/map/car.png',
              latitude: list[i].address.lat,
              longitude: list[i].address.lng,
              width: 30,
              height: 15
            },
          })
        }
      }

    })
  },
  distance:function(la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(2);
     return s
    //console.log("计算结果",s)
  },
  getAngle:function(){ //获取方向角度
    // wx.startCompass({
    //   success:()=>{
    //     return true
    //   },
    //   fail:()=>{
    //     console.log("设备不支持指南针")
    //   }
    // })
   
    
  },
  dataInit(){
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
  },
  getUserInfo:function(e){
    this.setData({
      showModal:false
    });
    
    if(e.detail.userInfo){
      wx.showToast({
        title: '登录中',
        icon: 'loading',
        duration:1000
      })
      wx.setStorageSync("userInfo", e.detail.userInfo);
      app.login();
    }
    // else{
    //   this.openSetting();
    // }
  },
  offModal:function(){//取消弹框
    this.hideModal();
  },
  //跳转设置页面
  goTo:function(e){
      var url = e.currentTarget.dataset.url;
      wx.navigateTo({url: url});
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  ddd:function(e){
    console.log(e)
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function (e) {
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
    
  },
  
   onShow:function(){
   
   },
   login: function () {
    var that = this
    // if (typeof success == "function") {
    //   console.log(6);
    //   console.log('success');
    //   this.data.getUserInfoSuccess = success
    // }
    wx.login({
      success: function (res) {
        //var code = res.code;
        // console.log(res.code);
        wx.getUserInfo({
          success: function (res) {
            app.globalData.userInfo = res.userInfo
            that.setData({
              getUserInfoFail: false,
              userInfo: res.userInfo,
              hasUserInfo: true
            })
            //平台登录
          },
          fail: function (res) {
            that.setData({
              getUserInfoFail: true,
              showModal:true
            })
          }
        })
      }
    })
  },
   onReady:function(){
    this.mapCtx = wx.createMapContext('map');
    this.setInterval();
   
  //    // 创建Socket
  //    SocketTask = wx.connectSocket({
  //     url: url,
  //     data: 'data',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'post',
  //     success: function (res) {
  //       console.log('WebSocket连接创建', res)
  //     },
  //     fail: function (err) {
  //       wx.showToast({
  //         title: '网络异常！',
  //       })
  //       console.log(err)
  //     },
  //   })
  //   if (SocketTask) {
  //     SocketTask.onOpen(res => {
  //       console.log('监听 WebSocket 连接打开事件。', res)
  //     })
  //     SocketTask.onClose(onClose => {
  //       console.log('监听 WebSocket 连接关闭事件。', onClose)
  //     })
  //     SocketTask.onError(onError => {
  //       console.log('监听 WebSocket 错误。错误信息', onError)
  //     })
  //     SocketTask.onMessage(onMessage => {
  //       console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', onMessage)
  //     })
  //   }
  },
  onHide:function(){
    //clearInterval(this.onLoad.timer)
    this.setData({
      timer:true
    })
    wx.stopCompass() //关闭方向
  },
  onUnload:function(){
    //clearInterval(this.onLoad.timer)
  },
  markertap:function(e){ //点击标记
    console.log(e)
  }
})
