// pages/service/service.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 'scaleToFill',
    buttonData: [
      {
        src: '/assets/img/service/electricity.png',
        text: '电商',
        url:'../coupons/coupons'
      },
      {
        src: '/assets/img/service/car.png',
        text: '汽 车'
      },
      {
        src: '/assets/img/service/life.png',
        text: '生 活'
      },
      {
        src: '/assets/img/service/game.png',
        text: '游戏体验'
      },
      {
        src: '/assets/img/service/leisure.png',
        text: '休闲娱乐'
      },
      {
        src: '/assets/img/service/attractions.png',
        text: '旅游景点'
      },
      {
        src: '/assets/img/service/task.png',
        text: '任务指派'
      },
      {
        src: '/assets/img/service/public_benefit.png',
        text: '公益导图'
      },
      {
        src: '/assets/img/service/other.png',
        text: '其他服务'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // this.mapCtx = wx.createMapContext('map')
      // console.log(this.mapCtx)
  },
  goTo:function(e){
    var url = e.currentTarget.dataset.index;
    wx.navigateTo({url:url})
  },
  ddd:function() {
    console.log(1)
    this.mapCtx.moveToLocation()
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