// pages/main/share.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    model: {
      topImageUrl: 'http://imgmars.yohobuy.com/mars/2018/05/26/d939c526b9d84e0a16544de381af7d09.jpg',
      mallUrl: 'http://www.yohomars.com/admin/images/logo/C.jpg?imageView/1/w/100/h/100',
      name: '春丽咖啡公司春丽咖啡公司',
      city: '北京',
      content: '“春丽咖啡公司”是京城人气很高的“春丽吃饭公司”开的新店，延续了餐厅不走寻常路的装修风格，开在南三里屯路上一个非常本土化的小超市底下，白瓷砖，小木窗，其貌不扬的店面装潢反而让它在洋气的三里屯显得更加与众不同。虽然主打“随性”的风格，但春丽咖啡公司对于咖啡的制作却相当讲究，店里的咖啡豆也是由北京少有的获得 SC 卫生许可证的烘焙师来供应的，包括危地马拉、埃塞俄比亚等等的精品级别的豆子，不论是机器、豆子和牛奶都很有品质，且一天卖完 102 杯就不卖了。但因为店面不大，这里的咖啡只能外带或者坐在门口即饮，想象自己拿着酷似二锅头的瓶子喝着草莓拿铁，非常酷了！',
      address: '北京市 朝阳区南三里屯路',
      contentImages: [{
          image: 'http://imgmars.yohobuy.com/mars/2018/4/26/9ba2ac0468fc769b0d6097e800a133f5.jpg'
        },
        {
          image: 'http://imgmars.yohobuy.com/mars/2018/4/26/ab18f7d32fb94f7d9a275c76439a1982.jpg'
        }
      ],
    },
    windowWidth: 0,
    windowHeight: 0,
    totalHeight: 0,
    canvasScale: 1.0,// 画布放大多少倍
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx: wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.begainDrawShareImage()
  },

  /**
   * 绘制分享海报
   */
  begainDrawShareImage() {
    var that = this
    // 适配屏幕
    let scale = this.data.windowWidth / 375.0
 
    this.setData({ totalHeight: 667* scale})
    // 获取Canvas
    let ctx = wx.createCanvasContext('myCanvas')

    // 放大 因为不放大的话，生成的分享图会模糊。暂时先注释
    ctx.scale(this.data.canvasScale, this.data.canvasScale)

    // 绘制主背景白色
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, this.data.windowWidth, this.data.totalHeight)
    ctx.draw()

    // 首先要绘制顶部的背景图片，因为它在最底层，然后才能绘制其他内容
    let topImageWidth = parseInt(375 * scale) // 因为小数有时候会请求不到图片，所以转成int
    let topImageHeight = parseInt(250 * scale)
    let src1 = this.data.model.topImageUrl + `?imageView/2/w/${topImageWidth}/h/${topImageHeight}`
    wx.getImageInfo({
      src: src1,
      success: function(res) {
        ctx.drawImage(res.path, 0, 0, topImageWidth, topImageHeight)
        // 覆盖黑色蒙层
        ctx.setFillStyle('rgba(0,0,0,0.3)')
        ctx.fillRect(0, 0, topImageWidth, topImageHeight)

        ctx.draw(true)

        that.drawOtherContent(ctx, scale)
        that.drawOtherImage(ctx,scale)
      }
    })
  },

  // 绘制除了图片之外的剩余内容
  drawOtherContent(ctx, scale) {

    // 绘制中间的灰色背景
    ctx.setFillStyle('rgba(246,246,246,1)')
    ctx.fillRect(14 * scale, 230 * scale, 347 * scale, 158 * scale)

    //name
    ctx.setFillStyle('white');
    ctx.setFontSize(30 * scale);
    this.canvasTextAutoLine(this.data.model.name, ctx, 80 * scale, 220 * scale, 35 * scale, 258 * scale, 1)

    // cotent
    ctx.setFillStyle('#3c3c3c');
    ctx.setFontSize(15 * scale);
    this.canvasTextAutoLine(this.data.model.content, ctx, 30 * scale, 270 * scale, 22 * scale, 305 * scale, 4)

    // address
    ctx.setFillStyle('#dadada');
    ctx.setFontSize(15 * scale);
    this.canvasTextAutoLine(this.data.model.address, ctx, 30 * scale, 370 * scale, 22 * scale, 305 * scale, 1)

    this.drawNormalText(ctx, '探索新鲜好去处', 82 * scale, 596 * scale, 14 * scale, '#3C3C3C', 'left', 'middle', scale);
    this.drawNormalText(ctx, '长按右侧小程序码', 82 * scale, 620 * scale, 12 * scale, '#9A9CAC', 'left', 'middle', scale);
    this.drawNormalText(ctx, '查看更多店铺信息和热评', 82 *scale,635*scale, 12*scale, '#9A9CAC', 'left', 'middle', scale);

    ctx.draw(true)

  },

  // 绘制剩余图片
  drawOtherImage(ctx, scale) {

    let that = this

    let mallImageWidth = parseInt(57 * scale)
    let mallImageHeight = parseInt(57 * scale)
    let src1 = this.data.model.mallUrl + `?imageView/2/w/${mallImageWidth}/h/${mallImageHeight}`
    wx.getImageInfo({
      src: src1,
      success: function (res) {
        ctx.drawImage(res.path, 20 * scale, 184*scale, mallImageWidth, mallImageHeight)
        ctx.draw(true)
      }
    })

    let cotentImageWidth = parseInt(166 * scale)
    let cotentImageHeight = parseInt(166 * scale)
    for (let i = 0; i < this.data.model.contentImages.length; i++){
      let imageItem = this.data.model.contentImages[i]
      let src1 = imageItem.image + `?imageView/2/w/${cotentImageWidth}/h/${cotentImageHeight}`
      wx.getImageInfo({
        src: src1,
        success: function (res) {
          ctx.drawImage(res.path, 15 * scale + i*180*scale, 400 * scale, cotentImageWidth, cotentImageHeight)
          ctx.draw(true)
        }
      })
    }

    // icon 
    // ctx.setShadow(0, 8 * scale, 20, 'rgba(0,0,0,0.1)')  
    ctx.drawImage('../../img/mars.png', 13 * scale, 590 * scale, 54*scale, 54*scale)
    // ctx.setShadow(0, 0, 0, 'white')
    ctx.draw(true)
  },

  // 绘制只有一行的文字
  drawNormalText(ctx, str, x, y, font, style, align, baseLine) {
    ctx.setFontSize(font);
    ctx.setFillStyle(style);
    ctx.setTextAlign(align);
    ctx.setTextBaseline(baseLine);
    ctx.fillText(str, x, y);
  },


  /*
  *  绘制多行文本，自动换行，超出添加...
  *
  str:要绘制的字符串
  canvas:canvas对象
  initX:绘制字符串起始x坐标
  initY:绘制字符串起始y坐标
  lineHeight:字行高，自己定义个值即可
  maxWidth: 文本最大宽度
  row: 最大行数
  */
  canvasTextAutoLine: function(str, ctx, initX, initY, lineHeight, maxWidth, row = 1) {
    var lineWidth = 0;
    var lastSubStrIndex = 0;
    var currentRow = 1;
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > maxWidth) {
        currentRow++;
        let newStr = str.substring(lastSubStrIndex, i)
        if (currentRow > row && str.length > i) {
          newStr = str.substring(lastSubStrIndex, i - 2) + '...'
        }
        ctx.fillText(newStr, initX, initY);
        initY += lineHeight;
        lineWidth = 0;
        lastSubStrIndex = i;

        if (currentRow > row) {
          break;
        }
      }
      if (i == str.length - 1) {
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
      }
    }
  },

  // 保存图片
  saveImage(){
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.data.windowWidth * this.data.canvasScale,
      height: this.data.totalHeight * this.data.canvasScale,
      canvasId: 'myCanvas',
      success: function (res) {
        that.saveImageToPhotos(res.tempFilePath);
      },
      fail: function (res) {
        wx.showToast({
          title: '图片生成失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  saveImageToPhotos: function (tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success(result) {
        wx.showToast({
          title: '保存成功，从相册中分享到朋友圈吧',
          icon: 'none',
          duration: 4000
        })
      },
      fail: function (res) {
          wx.showToast({
            title: '图片保存失败',
            icon: 'none',
            duration: 2000
          })
      }
    })
  },

})