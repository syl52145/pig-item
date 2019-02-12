//app.js
const util = require('./utils/util.js')
App({
  onLaunch: function () {
    // console.log('app-onLaunch')
    //this.getUserInfo();
   
  },
  onShow:function(){
    // console.log('app-onShow')
  },
  // 获取用户信息，登录

  login: function (callBack) {
    let that = this;
    if (that.globalData.userInfo) {
      typeof callBack == 'function' && callBack()
    }else {
      wx.login({
        success: function (res1) {
          // console.log('res11111111111111111',res1);
           if(res1.code) {
            //授权   
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                //console.log('ryy-getUserInfo', res.userInfo)
                that.globalData.userInfo = res.userInfo
                util.post("/index.php/Login",{
                  code:res1.code,
                  rawData:res.rawData,
                  signature:res.signature,
                  iv:res.iv, 
                  encryptedData:res.encryptedData
                }).then((res)=>{
                   if (res && res.code == 1) {  
                      wx.setStorageSync("userInfo", res.data);
                      that.globalData.login = true;
                      that.globalData.userInfo = res.data;
                    //       wx.setStorageSync('session_id', res.data.data.session_id)
                    //       that.globalData.header.Cookie = 'JSESSIONID=' + res.data.data.session_id;
                    //       that.globalData.is_vip = res.data.data.is_vip;
                        if (callBack) {
                             callBack()
                        }
                   }
                })
                
              }
            })
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})