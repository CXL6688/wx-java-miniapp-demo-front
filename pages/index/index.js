//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    that.startWifi();
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
  },
  startWifi: function () {
    var that = this;
    wx.startWifi({
      success: function (res) {
        console.log('start', res)
        that.getWifiListFunc()
      },
      fail: res => {
        console.log("67676767676")
        wx.showModal({
          title: '提示',
          content: '11未能成功打开WIFI，请退出重新授权',
          showCancel: false
        })
      }
    })
  },

  getWifiListFunc:function () {
    console.log("125464584687");
    if(platform == 'ios'){
      wx.getWifiList();
    }else{
      wx.getSetting({
        success(res){
          //地理位置
          if(!res.authSetting['ScopedCredential.userLocation']){
            wx.authorize({
              scope:'scope.userLocation',
              success(res){
                wx.getWifiList();
              },
              fail(res){
                wx.showModal({
                  title: '提示',
                  content: '定位失败，您未开启定位权限，点击开启定位权限',
                  success:function (res) {
                    if(res.confirm){
                      wx.openSetting({
                        success:function (res) {
                          if(res.authSetting['scope.addPhoneCalendar.userLocation']){
                            getWifiList();
                          }else{
                            wx.showToast({
                              title:'用户未开启地理位置权限',
                              icon:"none",
                              duration:3000
                            })
                          }
                          
                        }
                      })
                    }
                    
                  }
                
                })
              }
            })
          }else{
            getWifiList();
          }
        }
      })
    } 
  },
  getWifiList:function(){
    wx.getWifiList({
      success:function(res){
        //监听获取到WiFi列表数据事件
        wx.onGetWifiList(function(res){
          wifiList=[]
          let tmpList=[]
          if(res && res.wifiList){
            res.wifiList.map(item =>{
              if(tmpList.indexOf(item.SSID)== -1){
                tmpList.push(item.SSID)
                wifiList.pust(item)
              }
            })
            // callBackFunc(wifiList)
          }
        })
      },
      fail:function(res){
        wx.showToast({
          title:'获取Wi-Fi列表失败',
          icon:"none",
          duration:3000
        })
      }
    })
  },

  // getWifiList: function () {
  //   var that = this;
  //   wx.getWifiList({
  //     success: function (res) {
  //       wx.onGetWifiList(function (res) {
  //         console.log('list2', res)
  //         that.setData({
  //           wifiList: res.wifiList
  //         })
  //       })
  //     }
  //   })
  // },
  connectWifi: function () {
    wx.connectWifi({
      SSID: 'CWCC',
      BSSID: 'D8:C8:E9:07:F1:30',
      password: '369258147',
      success: function (res) {
        console.log('end', res)
      }
    })
  },
  scanCode: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
