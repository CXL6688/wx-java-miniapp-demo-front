// pages/connectWifi/connect.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    connect: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info("开始加载connect");
    var that = this;
    let id = decodeURIComponent(options.scene);
    let data= {
      id: id
    }
    console.info("开始获取wifi信息")
    app.wxRequest('GET','/wifi/info',data,(res)=>{
      console.info("获取wifi信息成功")
      //复制推广地址到剪切板
      wx.setClipboardData({
        data: res.data.data.storeUrl,
         success: function (result) {
           console.log("复制推广地址到剪切板")     
        }
     })
     console.info("开始连接wifi")
      wx.startWifi({
        success: function (result) {
          console.log('start connectWifi', result)
          wx.connectWifi({
            SSID: res.data.data.wifiSsid,
            password: res.data.data.wifiPassword,
            success: function (result) {
              console.log('connectWifi success', result)
              that.setData({
                connect: 2
              })
            },
            fail: result => {
              console.log('连不上', result)
              that.setData({
                connect: 3
              })

              wx.showModal({
                title: '提示',
                content: '你可能得到的是假密码',
                showCancel: false
              })
            }
          })
        },
        fail: result => {
          wx.showModal({
            title: '提示',
            content: '未能成功打开WIFI，请退出重新授权',
            showCancel: false
          })
        }
      })
    },(err)=>{
      console.info("获取wifi信息失败",err)
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