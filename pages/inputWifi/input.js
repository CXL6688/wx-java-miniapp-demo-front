// pages/inputWifi/input.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  inputChange: function (e) {
    var that = this;
    if (e.currentTarget.dataset.type == 'ssid') {
      that.data.wifiSsid = e.detail.value;
    } else if (e.currentTarget.dataset.type == 'password') {
      that.data.wifiPassWord = e.detail.value;
    }
  },
  creatQRcode: function () {
    var that = this;
    var path = 'pages/connectWifi/connect';
    // var dataUrl = '?wifiSsid=' + that.data.wifiSsid + '&wifiPassWord=' + that.data.getwxaqrcode
    var dataUrl = '?wifi=' + that.data.wifiSsid + ';' + that.data.wifiBssid + ';' + that.data.wifiPassWord;
    console.log(path + dataUrl)
    wx.showLoading({
      title: '生成中',
    })
    wx.request({
      url: 'https://read.greathammer.com/index.php/Qrcode/Qrcode/getwxaqrcodeB',
      data: {
        appid: 'wx53c1b1685d44f649',
        appsecret: 'c9de41cdc0d63adceaacd404ef78e856',
        path: path,
        dataUrl: dataUrl
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        console.log('二维码路径', res)
        var qrPath = 'https://read.greathammer.com/' + res.data.result
        wx.downloadFile({
          url: qrPath,
          success: res => {
            console.log('erweima', res)
            wx.hideLoading();
            that.data.wifiQRcode = res.tempFilePath;
            that.setData({
              wifiQRcode: res.tempFilePath
            })
          }
        })
      }
    })
  },
  saveImage: function () {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.wifiQRcode,
      success: res => {
        wx.showToast({
          title: '保存成功',
        })
      }
    })
  },
  startWifi: function () {
    var that = this;
    wx.startWifi({
      success: function (res) {
        console.log('start', res)
        that.getWifiList()
      },
      fail: res => {
        console.error('startWifi faile',res)
        wx.showModal({
          title: '提示',
          content: res,
          showCancel: false
        })
      }
    })
  },
  getWifiList: function () {
    console.info('start get wifi list')
    var that = this;
    wx.getSetting({
      success(res) {
        //地理位置
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              getWifiList();
            },
            fail(res) {
              wx.showModal({
                title: '提示',
                content: '定位失败，您未开启定位权限，点击开启定位权限',
                success: function(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function(res) {
                        if (res.authSetting['scope.userLocation']) {
                          wx.getWifiList({
                            success: function (res) {
                              wx.onGetWifiList(function (res) {
                                console.log('list2', res)
                                that.setData({
                                  wifiList: res.wifiList
                                })
                              })
                            }
                          })
                        } else {
                          wx.showToast({
                            title: '用户未开启地理位置权限',
                            icon: "none",
                            duration: 3000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          wx.getWifiList({
            success: function (res) {
              wx.onGetWifiList(function (res) {
                console.log('list2', res)
                that.setData({
                  wifiList: res.wifiList
                })
              })
            }
          })
        }
      }
    })
  },
  copyBssid: function (e) {
    let ssid = e.currentTarget.dataset.ssid;
    let bssid = e.currentTarget.dataset.bssid;
    this.data.bssid = bssid;
    this.setData({
      wifiBssid: bssid,
      wifiSsid: ssid
    })
    wx.showToast({
      title: '填写成功',
    })
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
    var that = this;
    var path = 'pages/connectWifi/connect';
    // var dataUrl = '?wifiSsid=' + that.data.wifiSsid + '&wifiPassWord=' + that.data.getwxaqrcode
    var dataUrl = '?wifi=' + that.data.wifiSsid + ';' + that.data.wifiBssid + ';' + that.data.wifiPassWord;
    console.log(path + dataUrl)

    return {
      title: '扫码链接' + that.data.wifiSsid,
      path: path + dataUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})