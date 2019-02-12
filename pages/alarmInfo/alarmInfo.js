// pages/alarmInfo/alarmInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aa:"",
    modalShow:true,
    markers: [{
      iconPath: '/assets/img/map/car.png',
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 28,
      height: 12,
      callout: {
        content: '0',
        color: '#06a54d',
        fontSize: '16',
        borderRadius: '12',
        bgColor: '#06a54d',
        borderColor: '#ffffff',
        borderWidth: '2',
        display: 'ALWAYS'
      }
    }],
    longitude: 113.3245211,
    latitude: 23.10229,
    diver:"张三 （男）",
    car:"京N123DJ2（别克君威2.0T 白色）"
  },
  offModal:function(){
    console.log(111)
    this.setData({
      modalShow:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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