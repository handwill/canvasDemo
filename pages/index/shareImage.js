// pages/index/shareImage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
      observer: 'handleData'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    pixelRatio: 0,
    windowWidth: 0,
    windowHeight: 0,
    bgLocalUrl: '',
    exLocalUrl: '',
    artworkImageArr: [],
    canShow: true,
    scale:0,

    texts: [{
      text: '你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好',
      color: 'red',           // 文字颜色
      fontSize: 24,           // 字体 单位rpx
      textAlign: 'left',      // 对齐方式：left center right
      x: 0,                   // 坐标x，以文字的右上角为原点，单位rpx
      y: 0,                   // 坐标y，以文字的右上角为原点，单位rpx
      width: 560,             // 文字区域的宽度
      lineNum: 2,             // 文字行数，放不下使用...代替
      lineHeight: 50,         // 行高 单位rpx
    },
    {
      text: '测试测试测试测试测试测试测试测试测试测试测试测试',
      color: 'blue',           // 文字颜色
      fontSize: 32,           // 字体 单位rpx
      textAlign: 'left',      // 对齐方式：left center right
      x: 0,                   // 坐标x，以文字的右上角为原点，单位rpx
      y: 300,                   // 坐标y，以文字的右上角为原点，单位rpx
      width: 500,             // 文字区域的宽度
      lineNum: 2,             // 文字行数，放不下使用...代替
      lineHeight: 50,         // 行高 单位rpx
    }
    ],
  },

  created() {
    const sysInfo = wx.getSystemInfoSync();
    const screenWidth = sysInfo.screenWidth;
    // rpx（responsive pixel）: 规定屏幕宽为750rpx, 所以只需关心rpx即可
    this.factor = screenWidth / 750;
  },
  attached() {
    // this.ctx = wx.createCanvasContext('myCanvas', this);   // 加上this才能选中组件内的canvas元素
    // this.setData({
    //   pxWidth: this.toPx(this.data.width),
    //   pxHeight: this.toPx(this.data.height),
    // });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // https://img.zai-art.com/zaiart_article%2F55153cb868bcbcde645a8cc640e773aa.jpeg?imageView2/1/w/148/h/200
    handleData: function () {

      var that = this;
      wx.getImageInfo({
        src: this.data.data.info.imageUrl + '?imageView2/1/w/375/h/484',
        success: function (res) {
          that.data.bgLocalUrl = res.path
          console.log(res)
        }
      })

      wx.getImageInfo({
        src: this.data.data.info.imageUrl + '?imageView2/1/w/200/h/274',
        success: function (res) {
          that.data.exLocalUrl = res.path
          console.log(res)
        }
      })

      let artworkW = 108 * 2
      let artworkH = 154 * 2
      if (this.data.data.artworks.datas && this.data.data.artworks.datas.length == 1) {
        artworkW = 335 * 2
        artworkH = 164 * 2
      } else if (this.data.data.artworks.datas && this.data.data.artworks.datas.length == 2) {
        artworkW = 164 * 2
        artworkH = 164 * 2
      }

      let maxLength = (this.data.data.artworks.datas && this.data.data.artworks.datas.length > 3) ? 3 : this.data.data.artworks.datas.length
      for (let i = 0; i < maxLength; i++) {
        wx.getImageInfo({
          src: this.data.data.artworks.datas[i].imageUrl + '?imageView2/1/w/' + artworkW + '/h/' + artworkH,
          success: function (res) {
            // that.data.bgLocalUrl = res.path
            console.log(res.path)
            that.data.artworkImageArr.push(res.path)
          }
        })
      }

      wx: wx.getSystemInfo({
        success: function (res) {
          that.setData({
            pixelRatio: res.pixelRatio,
            windowWidth: res.windowWidth,
            windowHeight: res.windowHeight + 64
          })
        }
      })

    },

    createShareImageAction: function () {
      this.setData({
        canShow: true
      })

      // 默认像素比
      let pixelRatio = this.data.pixelRatio;
      // 屏幕系数比，以设计稿375*667（iphone7）为例
      let XS = this.data.windowWidth / 375.0;
      this.data.scale = XS

      let messageContentHeight = 334 * XS

      const ctx = wx.createCanvasContext('myCanvas', this)


      ctx.setFillStyle('#7e6d50')
      ctx.fillRect(0, 0, this.data.windowWidth * XS, this.data.windowHeight * XS)

      ctx.drawImage(this.data.bgLocalUrl, 0, 0, this.data.windowWidth * XS, 242 * XS)

      ctx.setFillStyle('rgba(0,0,0,0.6)')
      ctx.fillRect(0, 0, this.data.windowWidth * XS, 242 * XS)

      ctx.drawImage(this.data.exLocalUrl, 10 * XS, 53 * XS, 100 * XS, 137 * XS)

      // 展览名称
      this.drawText(ctx, this.data.data.info.name, 14, 20, 122, 96, 16, '#FFFFFF', 'left', 'middle')

      this.drawText(ctx, '¥', 13, 12, 122, 170, 12, '#FFFFFF', 'left', 'middle')

      // 价格
      ctx.setFontSize(24 * XS);
      ctx.setFillStyle('#FFFFFF');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, this.data.data.info.ticketPriceLow + '-' + this.data.data.info.ticketPriceHigh, 13 * XS, 24 * XS, 135 * XS, 154 * XS);

      ctx.setStrokeStyle('#ffffff')
      ctx.strokeRect(300 * XS, 168 * XS, 42 * XS, 20 * XS)

      ctx.setFontSize(12 * XS);
      ctx.setFillStyle('#FFFFFF');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '售票中', 13, 12 * XS, 303 * XS, 166 * XS);

      ctx.setFillStyle('#ffffff')
      ctx.setShadow(0, 8 * XS, 20, 'rgba(0,0,0,0.1)')
      ctx.fillRect(11 * XS, 210 * XS, 354 * XS, messageContentHeight)



      // 展览时间
      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#9A9CAC');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '展览时间', 30, 14 * XS, 21 * XS, 226 * XS);

      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#3C3C3C');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '2018.03.24-2018.05.27', 30, 14 * XS, 93 * XS, 226 * XS);


      // 场馆
      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#9A9CAC');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '场馆', 10, 14 * XS, 21 * XS, 252 * XS);

      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#3C3C3C');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '今日美术馆', 30, 14 * XS, 93 * XS, 252 * XS);

      // 开放时间
      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#9A9CAC');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '开放时间', 10, 14 * XS, 21 * XS, 276 * XS);

      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#3C3C3C');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '10:00-18:00', 30, 14 * XS, 93 * XS, 276 * XS);

      // 地址
      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#9A9CAC');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '地址', 10, 14 * XS, 21 * XS, 304 * XS);

      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#3C3C3C');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '北京市朝阳区百子湾路号苹果社区', 30, 14 * XS, 93 * XS, 304 * XS);

      // 展位
      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#9A9CAC');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '展位', 10, 14 * XS, 21 * XS, 330 * XS);

      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#3C3C3C');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '2号馆', 30, 14 * XS, 93 * XS, 330 * XS);

      if (this.data.data.artworks.datas && this.data.data.artworks.datas.length == 1) {
        ctx.drawImage(this.data.artworkImageArr[0], 21 * XS, 365 * XS, 335 * XS, 164 * XS)
      } else if (this.data.data.artworks.datas && this.data.data.artworks.datas.length == 2) {
        ctx.drawImage(this.data.artworkImageArr[0], 21 * XS, 365 * XS, 164 * XS, 164 * XS)
        ctx.drawImage(this.data.artworkImageArr[1], 191 * XS, 365 * XS, 164 * XS, 164 * XS)
      } else if (this.data.data.artworks.datas && this.data.data.artworks.datas.length >= 3) {
        ctx.drawImage(this.data.artworkImageArr[0], 21 * XS, 365 * XS, 108 * XS, 154 * XS)
        ctx.drawImage(this.data.artworkImageArr[1], 134 * XS, 365 * XS, 108 * XS, 154 * XS)
        ctx.drawImage(this.data.artworkImageArr[2], 247 * XS, 365 * XS, 108 * XS, 154 * XS)
      }





      ctx.setFontSize(14 * XS);
      ctx.setFillStyle('#3C3C3C');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '爱艺术的人都在这里', 20, 14 * XS, 82 * XS, 570 * XS);

      ctx.setFontSize(12 * XS);
      ctx.setFillStyle('#9A9CAC');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '长按右侧小程序码', 20, 12 * XS, 82 * XS, 594 * XS);

      ctx.setFontSize(12 * XS);
      ctx.setFillStyle('#9A9CAC');
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      this.fontLineFeed(ctx, '查看更多展览和点评', 20, 12 * XS, 82 * XS, 610 * XS);

      // 小程序二维码
      ctx.drawImage(this.data.bgLocalUrl, 279 * XS, 557 * XS, 86 * XS, 86 * XS)

      // 在艺logo
      ctx.setShadow(0, 8 * XS, 20, 'rgba(0,0,0,0.1)')
      ctx.drawImage(this.data.bgLocalUrl, 10, 571 * XS, 59 * XS, 59 * XS)

      ctx.draw()

      var that = this
      setTimeout(function () {
        that.saveImage()
      }, 500);

    },

    drawText: function (ctx, str, splitLen, strHeight, x, y, font, style, align, baseLine) {
      ctx.setFontSize(font * this.data.scale);
      ctx.setFillStyle(style);
      ctx.setTextAlign(align);
      ctx.setTextBaseline(baseLine);
      this.fontLineFeed(ctx, str, splitLen * this.data.scale, strHeight * this.data.scale, x * this.data.scale, y * this.data.scale)
    },
    /**
     * ctx,画布对象
     * str,需要绘制的文字
     * splitLen,切割的长度字符串
     * strHeight,每行文字之间的高度
     * x,位置
     * y
     */
    fontLineFeed: function (ctx, str, splitLen, strHeight, x, y) {
      let strArr = [];
      for (let i = 0, len = str.length / splitLen; i < len; i++) {
        strArr.push(str.substring(i * splitLen, i * splitLen + splitLen));
      }
      let s = 0;
      for (let j = 0, len = strArr.length; j < len; j++) {
        s = s + strHeight;
        ctx.fillText(strArr[j], x, y + s);
      }
    },

    saveImage: function () {
      var that = this
      let XS = this.data.windowWidth / 375.0;
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.data.windowWidth * XS,
        height: this.data.windowHeight * XS,
        destWidth: this.data.windowWidth * 2,
        destHeight: this.data.windowHeight * 2,

        canvasId: 'myCanvas',
        success: function (res) {
          console.log(res);
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(result) {
              wx.showToast({
                title: '图片保存成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                canShow: false
              })
            }
          })
        },
        fail: function (res) {
          console.log(res);
        }
      }, this)
    },
  },


  // createShareImageAction: function () {
  //   console.log('createShareImage')
  //   this.setData({

  //   })
  // },
})
