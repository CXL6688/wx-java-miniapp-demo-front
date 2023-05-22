//app.js
App({
  async onLaunch() {
     // 使用callContainer前一定要init一下，全局执行一次即可
     wx.cloud.init()
     // 下面的请求可以在页面任意一处使用
     const result = await wx.cloud.callContainer({
       config: {
         env: this.globalData.cloudEnv, // 微信云托管的环境ID
       },
       path: '/test/test', // 填入业务自定义路径和参数，根目录，就是 / 
       method: 'GET', // 按照自己的业务开发，选择对应的方法
       header: {
         'X-WX-SERVICE': this.globalData.cloudService, // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
       }
       // dataType:'text', // 默认不填是以JSON形式解析返回结果，若不想让SDK自己解析，可以填text
     })
     console.log(result)

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
            let data= {
              jsCode: res.code
            };
            this.wxRequest('GET','/user/getUserOpenId',data,(result)=>{
              console.info("获取用户openID成功",result)
              this.globalData.userOpenId = result.data.data
            },(err)=>{
              console.info("获取用户openID失败",err)
            })
          }
        }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.info("当前用户",this.globalData.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userOpenId:null,
    cloudEnv:"prod-5gr3n3aa247ebcff",
    cloudService:"springboot-6xko"
  },
  api:{
    url:'https://jlqqnsgd.springboot-6xko.omagvk74.bh0wkys1.com'
  },
  wxRequest(method, url, data, callback, errFun) {
    wx.cloud.callContainer({
      config: {
        env: this.globalData.cloudEnv, // 微信云托管的环境ID
      },
      path: url, // 填入业务自定义路径和参数，根目录，就是 / 
      method: method, // 按照自己的业务开发，选择对应的方法
      data:data,
      header: {
        'X-WX-SERVICE': this.globalData.cloudService, // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他header参数
      },
      // dataType:'text', // 默认不填是以JSON形式解析返回结果，若不想让SDK自己解析，可以填text
      // 其余参数同 wx.request
      success: function (res) {
        callback(res);
      },
      fail: function (err) {
        errFun(res);
      }
    });
  }
})