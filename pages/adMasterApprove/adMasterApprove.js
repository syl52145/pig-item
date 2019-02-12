// pages/adMasterApprove/adMasterApprove.js

const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    status:0,//0未申请，1未通过
    idCardData: [
      {
        text: '法人证件照（正面）',
        src: '/assets/img/driver/id_card_positive.png',
        pic:false, //是否上传
        err:false
      },
      {
        text: '法人证件照（反面）',
        src: '/assets/img/driver/id_card_back.png',
        pic:false,
        err:false
      },
      {
        text: '营业执照（正面）',
        src: '/assets/img/driver/license.png',
        pic:false,
        err:false
      },

    ],
    params: {
      positive: undefined,
      opposite: undefined,
      license: undefined,
      company_name: '',
      company_address: '',
      range: '',
      legal_name: '',
      phone: '',
      email: ''
    },
    listDetail: {
      positive: false,
      opposite: false,
      license: false,
      company_name: false,
      company_address: false,
      range: false,
      legal_name: false,
      phone: false,
      email: false
    }
  },
  adMasterApprove:function(){
    var userInfo = wx.getStorageSync("userInfo");
    var params = this.data.params;
    if(userInfo.openid){
      params.openid = userInfo.openid;
      util.post('index.php/SetAdvertisement',params).then((res)=>{
        console.log(res);
        if(res.code==1){
          wx.showToast({
            title:res.msg,
            icon:"none",
            duration:1000
          })
        }else{
          wx.showModal({
            title: '提交成功',
            content: '请等待审核通过',
            showCancel: false,
            success(res){
                wx.navigateTo({
                  url: '../driverReview/driverReview'
                })
            }
          })
        }
    })
    } 
  },
  onChange:function(e){
    var _this=this;
    var value = e.detail.value;
    var type = e.currentTarget.dataset.wpyonchangeA;
    var item = 'params.'+type;
    _this.setData({
        [item]:value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo:userInfo
    })
    var status = options.status;
    if(status==3){
      var type = 1;
      var openid = userInfo.openid;
      util.get('index.php/AuditFailed',{openid,type}).then((res)=>{
        var lists=res.msg.list;
        var detail=res.msg.list.relation.location;  
        var  positive=util.req()+'upload/weixin/'+lists.positive,
        opposite=util.req()+'upload/weixin/'+lists.opposite,
        license=util.req()+'upload/weixin/'+lists.license;

        delete lists.relation;
        this.setData({
          params:lists,
          'idCardData[0].src':positive,
          'idCardData[1].src':opposite,
          'idCardData[2].src':license
        })
        for(var i=0;i<detail.length;i++){
          var key=detail[i];
          if(key==positive){
            this.setData({
              'idCardData[0]':true
            })
          }
          if(key==opposite){
            this.setData({
              'idCardData[1]':true
            })
          }
          if(key==license){
            this.setData({
              'idCardData[2]':true
            })
          }
          var item = 'listDetail.'+key
          this.setData({
            [item]:true
          })
        }
      })
    }
    

  },
  showAction: function (e) {//上传图片
    var _this = this;
    var index = e.currentTarget.dataset.wpyshowactionA;
    var pictype = index==0?'params.positive':index==1?'params.opposite':'params.license';
    var title = _this.data.idCardData[index].text;
    var src = 'idCardData['+index+'].src';
    var pic = 'idCardData['+index+'].pic';
    var req = util.req();
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
            [src]:res.tempFilePaths[0],
            [pic]:true
        })
          wx.uploadFile({
            url:req+'/index.php/SetUpload',
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              del_url: ''
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              var data = JSON.parse(res.data);
              if(data.code==1){
                wx.showToast({
                  title: title,
                  icon:'success',    
                  duration: 1500
                })
                _this.setData({
                  [pictype]:data.file
                })
              }
              
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false
              })
            }
          });
        }
    })
  },
  reUp:function(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var src = 'idCardData['+index+'].src';
    var pictype = index==0?'params.positive':index==1?'params.opposite':'params.license';
    var path = index==0?_this.data.params.positive:index==1?_this.data.params.opposite:_this.data.params.license;
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
            [src]:res.tempFilePaths[0]
        })
          wx.uploadFile({
            url:util.req()+'/index.php/SetUpload',
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              del_url: path
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              var data = JSON.parse(res.data);
              if(data.code==1){
                wx.showToast({
                  title: title,
                  icon:'success',    
                  duration: 1500
                })
                _this.setData({
                  [pictype]:data.file
                })
              }
              
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false
              })
            }
          });
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