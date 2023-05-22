Page({
  data: {
    template: {},
    image: "",
    width: 864,
    height: 1257,
    code:""
  },

  onLoad(options) {
    var that = this;
    that.data.code = options.code;
    this.getDraw()
  },

  getDraw() {
    wx.showLoading({
      title: '正在努力生成中',
    })
    this.setData({
      template: {
        background: '#30C4A7',
        width: this.data.width + 'px',
        height: this.data.height + 'px',
        views: [
          {
            type: 'image',
            url: '/images/wifi_post.jpg',
            css: {
              top: '0px',
              left: '0px',
              width: this.data.width + 'px',
              height: this.data.height + 'px'
            },
          },
          {
            type: 'image',
            url: 'data:image/png;base64,'+this.data.code,
            css: {
              width: '580px',
              height:  '620px',
              top: (this.data.height-620)/2+'px',
              left: (this.data.width-580)/2+'px'
             
            },
          },
        ],
      }
    })
  },
  // 生成成功
  canvasSuc(e) {
    console.log(e)
    wx.hideLoading()
    this.setData({
      image: e.detail.path
    })
  },
  
   getSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.image,
      success: (res) => {
        wx.showToast({
          title: '保存成功',
        });
      }
    })
    wx.getSetting({
      success: (set) => {
        if (set.authSetting['scope.writePhotosAlbum'] == false) {
          wx.openSetting()
        }
      }
    })
  },

  previewImg() {
    wx.previewImage({
      current: this.data.image,
      urls: [this.data.image]
    })
  },
})
