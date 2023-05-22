var app = getApp()

Page({
  data:{

  } ,
  click: function (e) { 
    console.log("按了：", e.currentTarget.id)
  },
  onLoad(options) {
    this.getData()
  },
  getData:function(){
    console.info("获取列表数据");
    let data= {
      userId: app.globalData.userOpenId
    };
    app.wxRequest('GET','/wifi/list',data,(res)=>{
      console.info("获取到用户wifi列表",res);
        this.setData({
          list:res.data.data
        })
    },(err)=>{
      console.info("获取列表数据失败",err)
    })
  },
  viewPost:function(option){
    let code=option.currentTarget.dataset.code;
    console.info("海报option",option)
    console.info("查看海报",code)
    wx.navigateTo({
      url: '/pages/canvas/canvas?code='+code
    })
  },
  deleteWifi:function(option){
    let id = option.currentTarget.dataset.id;
    console.info("海报ID",id);
    let data= {
      id: id
    };
    app.wxRequest('GET','/wifi/delete',data,(res)=>{
      console.info("删除成功",res);
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
      this.getData();
    },(err)=>{
      console.info("获取用户openID失败",err)
    })
  }
})
