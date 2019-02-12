// pages/putAd/putAd.js
import { $init, $digest } from '../../utils/common.util';
const util = require('../../utils/util.js');
var city = require('../../utils/city.js');
var vm;
var list = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex:[0,0],
    multiArray: [['北京', '安徽', "福建", "甘肃", "广东", "广西", "贵州", "海南", "河北", "河南", "黑龙江", "湖北", "湖南", "吉林", "江苏", "江西", "辽宁", "内蒙古", "宁夏", "青海", "山东", "山西", "陕西", "上海", "四川", "天津", "西藏", "新疆", "云南", "浙江", "重庆", "香港", "澳门", "台湾"], ['北京']],
    objectMultiArray:[],
    showDown:false,
    list:{
      launch_area:'',
      launch_number:'',
      start_time:'',
      out_time:'',
      launch_title:'',
      content:'',
      openid:'',
      file:[],
    },
    area:["广州市","广州市","广州市","广州市","广州市","广州市","广州市","广州市","广州市"],
    areaIndex:null,
    pic:{url:"/assets/img/putImg.png",
       clear:false, //是否显示删除图标
       err:false
    },
    images: []
  },
  selArea: function(e){
    var index=e.currentTarget.dataset.index;
    var arr = this.data.area;
    this.setData({
      areaIndex:index,
      showDown:false,
      'list.launch_area':arr[index]
    })
  },
  bindShowDown:function(){
    this.setData({
      showDown:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      $init(this);
      this.setData({
        objectMultiArray:city.data.objectMultiArray
      })
      var userInfo = wx.getStorageSync("userInfo");
      var openid = userInfo.openid;
      if(openid){
        this.setData({
          'list.openid':openid
        })
      }

  },
  bindShowPic:function(e){
    var index=e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 8,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        this.data.images = images.length <= 8 ? images : images.slice(0, 8) 
        $digest(this);
      }
    })
  },
  removeImage(e) {
    const idx = e.target.dataset.index
    this.data.images.splice(idx, 1)
    $digest(this)
  },
  handleImagePreview(e) {//预览图片
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  bindDateChange(e) {//选择日期
   var type = e.currentTarget.dataset.type;
   var types = 'list.'+type;
    this.setData({
      [types]: e.detail.value
    })
  },
  inputData:function(e){
    var type = e.currentTarget.dataset.type;
    var types = 'list.'+type;
    this.setData({
      [types]: e.detail.value
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
  putImg() {//上传图片
    // if (!openid) {
      var _this=this;
      var list=_this.data.list;
      var imgs = _this.data.images;
      if(list.file != ''){
        _this.putMsg();
        return;
      }
      if(!list.launch_area){
        wx.showToast({
          title:'请选择投放区域',
          icon:"none",
          duration:1000
        })
        return;
      }
      if(!list.launch_number){
        wx.showToast({
          title:'请输入投放数量',
          icon:"none",
          duration:1000
        })
        return;
      }
      if(!list.start_time){
        wx.showToast({
          title:'请选择投放开始时间',
          icon:"none",
          duration:1000
        })
        return;
      }
      if(!list.out_time){
        wx.showToast({
          title:'请选择投放结束时间',
          icon:"none",
          duration:1000
        })
        return;
      }
      if(!list.launch_title){
        wx.showToast({
          title:'请输入广告标题',
          icon:"none",
          duration:1000
        })
        return;
      }
      
      if(imgs==''){
        wx.showToast({
          title:'图片不能为空',
          icon:"none",
          duration:1000
        })
        return;
      }
      if(!list.content){
        wx.showToast({
          title:'请输入广告内容',
          icon:"none",
          duration:1000
        })
        return;
      }
      
      var pathList=[];
      for (var i = 0; i < imgs.length; i++) {  
        wx.showLoading({  
            title: '第'+(i+1)+'张图片上传中...',  
            mask: true
        })
        wx.uploadFile({  
          url:util.req()+"index.php/upload",
          filePath: imgs[i],  
          name: 'file',      
          success: function (res) {   
            var data = JSON.parse(res.data);  
            //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }   
            pathList.push(data)
            //如果是最后一张,则隐藏等待中  
            console.log(i,imgs.length);
            if (imgs.length == i) {  
              wx.hideLoading();
              if(pathList.length == imgs.length){
                  //console.log(pathList);
                  for(let a=0;a<pathList.length;a++){
                    let file=pathList[a].file;
                    let type='list.file['+a+']';
                    _this.setData({
                        [type]:file
                    })
                  }
                  _this.putMsg()
              }

            }  
          },  
          fail: function (res) {  
            wx.hideLoading();
            wx.showModal({  
              title: '错误提示',  
              content:'第'+(i+1)+'张图片上传失败',  
              showCancel: false,  
              success: function (res) { }  
            })  
          }  
        });  
      }   
      
      
  //}
},
putMsg(){//提交信息
  var list = this.data.list;
  util.post("index.php/SetAdvertisingDelivery",list).then((res)=>{
    // console.log(res)
    wx.showToast({
      title: res.msg,
      icon: 'loading',
      duration: 1500
    })
    if(res.code==1){
      wx.showModal({
        title:'广告信息',
        content:res.msg,
        showCancel:false,
        success(res){
          if(res.confirm){
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  })
},
submitForm:function(){
  if(this.data.list.openid){
    this.putImg();
  }
},
bindMultiPickerChange: function (e) {
  var that=this;
  vm= this;
  var city = that.data.multiArray[0][e.detail.value[0]]+"省"+that.data.multiArray[1][e.detail.value[1]]+"市"
  that.setData({
    "multiIndex[0]": e.detail.value[0],
    "multiIndex[1]": e.detail.value[1],
    'list.launch_area':city
  })
  //console.log(that.data.multiArray[0][e.detail.value[0]],that.data.multiArray[1][e.detail.value[1]])
  // console.log(that.data.multiIndex)
  // console.log(e.detail.value)
},
bindMultiPickerColumnChange: function (e){
  var that=this;
  switch (e.detail.column){
    case 0:
      list = []
      for (var i = 0; i < that.data.objectMultiArray.length;i++){
        if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid){
          list.push(that.data.objectMultiArray[i].regname)
        }
      }
      that.setData({
        "multiArray[1]": list,
        "multiIndex[0]": e.detail.value,
        "multiIndex[1]" : 0
      })
      
  }
}

})